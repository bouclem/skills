import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { scanSkillsMulti } from "./scanner";
import { scoreSkills, tokenize } from "./matcher";
import {
  installSkills,
  listInstalled,
  resolveTarget,
  Scope,
  uninstallAll
} from "./kiroInstall";
import { SkillsTreeProvider } from "./tree";
import { SkillRecord } from "./types";
import { resolveUserRoot, syncWorkspaceToUser } from "./userSync";

let skills: SkillRecord[] = [];
let treeProvider: SkillsTreeProvider;
let outputChannel: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;
/** Edge-trigger memory: was the trigger word present last time we evaluated this doc? */
const lastTriggerByDoc = new Map<string, boolean>();

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Kiro Skills");
  treeProvider = new SkillsTreeProvider();

  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.command = "kiroSkills.toggleForActiveFile";
  statusBar.text = "$(book) Skills";
  statusBar.tooltip = "Toggle install of all indexed skills into ~/.kiro/skills/";
  statusBar.show();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("kiroSkills.tree", treeProvider),
    outputChannel,
    statusBar
  );

  void refreshIndex();

  // Watch SKILLS folder for changes
  const root = workspaceRoot();
  if (root) {
    const cfg = vscode.workspace.getConfiguration("kiroSkills");
    const rel = cfg.get<string>("skillsRoot", "SKILLS");
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(root, `${rel}/**/SKILL.md`)
    );
    const onChange = () => { void refreshIndex(); };
    watcher.onDidCreate(onChange);
    watcher.onDidChange(onChange);
    watcher.onDidDelete(onChange);
    context.subscriptions.push(watcher);
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("kiroSkills")) {
        void refreshIndex();
      }
    })
  );

  // Trigger-word reaction. Debounced to avoid keystroke spam.
  const debounceTimers = new Map<string, NodeJS.Timeout>();
  const debouncedReact = (doc: vscode.TextDocument) => {
    const key = doc.uri.toString();
    const existing = debounceTimers.get(key);
    if (existing) clearTimeout(existing);
    debounceTimers.set(key, setTimeout(() => {
      debounceTimers.delete(key);
      void onDocumentChanged(doc);
    }, 400));
  };
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) void onDocumentChanged(editor.document);
    }),
    vscode.workspace.onDidOpenTextDocument(doc => {
      void onDocumentChanged(doc);
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (vscode.window.activeTextEditor?.document === e.document) {
        debouncedReact(e.document);
      }
    }),
    vscode.workspace.onDidCloseTextDocument(doc => {
      lastTriggerByDoc.delete(doc.uri.toString());
      const t = debounceTimers.get(doc.uri.toString());
      if (t) { clearTimeout(t); debounceTimers.delete(doc.uri.toString()); }
    })
  );

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand("kiroSkills.refresh", () => refreshIndex(true)),
    vscode.commands.registerCommand("kiroSkills.openSkill", async (skill?: SkillRecord) => {
      const target = skill ?? await pickSkill();
      if (!target) return;
      const doc = await vscode.workspace.openTextDocument(target.skillPath);
      await vscode.window.showTextDocument(doc, { preview: false });
    }),
    vscode.commands.registerCommand("kiroSkills.toggleForActiveFile", () => {
      void manualToggle();
    }),
    vscode.commands.registerCommand("kiroSkills.installAll", () => {
      void installAllNow("manual: install all");
    }),
    vscode.commands.registerCommand("kiroSkills.uninstallAll", () => {
      void uninstallAllNow("manual: uninstall all");
    }),
    vscode.commands.registerCommand("kiroSkills.searchByKeyword", async () => {
      const query = await vscode.window.showInputBox({
        prompt: "Search skills by keyword (e.g. 'react testing', 'sql injection')"
      });
      if (!query) return;
      const tokens = tokenize(query);
      const ranked = scoreSkills(skills, tokens).slice(0, 25);
      if (ranked.length === 0) {
        vscode.window.showInformationMessage("No matching skills.");
        return;
      }
      const pick = await vscode.window.showQuickPick(
        ranked.map(r => ({
          label: r.skill.id,
          description: r.skill.category.join(" / "),
          detail: `score=${r.score}  hits=${r.hits.join(",")}  ${typeof r.skill.frontmatter.description === "string" ? r.skill.frontmatter.description : ""}`,
          skill: r.skill
        })),
        { matchOnDescription: true, matchOnDetail: true, placeHolder: "Pick a skill to open" }
      );
      if (pick) {
        const doc = await vscode.workspace.openTextDocument(pick.skill.skillPath);
        await vscode.window.showTextDocument(doc, { preview: false });
      }
    }),
    vscode.commands.registerCommand("kiroSkills.syncToUser", async () => {
      const w = workspaceRoot();
      if (!w) { vscode.window.showWarningMessage("No workspace open."); return; }
      const cfg = vscode.workspace.getConfiguration("kiroSkills");
      const rel = cfg.get<string>("skillsRoot", "SKILLS");
      const userRoot = resolveUserRoot(cfg.get<string>("userSkillsRoot"));
      const workspaceSkillsRoot = path.join(w, rel);
      if (!fs.existsSync(workspaceSkillsRoot)) {
        vscode.window.showWarningMessage(`Workspace skills root not found: ${workspaceSkillsRoot}`);
        return;
      }
      const result = syncWorkspaceToUser(workspaceSkillsRoot, userRoot);
      log(`Manual sync to library: copied ${result.copied}, skipped ${result.skipped}, dest ${result.userRoot}`);
      vscode.window.showInformationMessage(
        `Library synced — copied ${result.copied}, skipped ${result.skipped}.`
      );
      void refreshIndex();
    }),
    vscode.commands.registerCommand("kiroSkills.openUserFolder", async () => {
      const cfg = vscode.workspace.getConfiguration("kiroSkills");
      const userRoot = resolveUserRoot(cfg.get<string>("userSkillsRoot"));
      fs.mkdirSync(userRoot, { recursive: true });
      await vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(userRoot));
    }),
    vscode.commands.registerCommand("kiroSkills.openKiroSkillsFolder", async () => {
      const target = currentTarget();
      if (!target) { vscode.window.showWarningMessage("Cannot resolve install target."); return; }
      fs.mkdirSync(target.skillsDir, { recursive: true });
      await vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(target.skillsDir));
    })
  );
}

export function deactivate() { /* nothing */ }

// ---------- helpers ----------

function workspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function currentScope(): Scope {
  const cfg = vscode.workspace.getConfiguration("kiroSkills");
  return (cfg.get<string>("installScope", "global") as Scope);
}

function currentTarget() {
  return resolveTarget(currentScope(), workspaceRoot());
}

async function refreshIndex(showToast = false) {
  const w = workspaceRoot();
  const cfg = vscode.workspace.getConfiguration("kiroSkills");
  const rel = cfg.get<string>("skillsRoot", "SKILLS");
  const companions = cfg.get<string[]>("companionFolders", []);
  const userRoot = resolveUserRoot(cfg.get<string>("userSkillsRoot"));
  const autoSync = cfg.get<boolean>("syncToUserOnRefresh", true);

  const roots: string[] = [];
  if (w) {
    const workspaceSkillsRoot = path.join(w, rel);
    roots.push(workspaceSkillsRoot);
    if (autoSync && fs.existsSync(workspaceSkillsRoot)) {
      try {
        const result = syncWorkspaceToUser(workspaceSkillsRoot, userRoot);
        if (result.copied > 0) {
          log(`Synced ${result.copied} skills to ${userRoot} (${result.skipped} already present)`);
        }
      } catch (err) {
        log(`User-folder sync failed: ${(err as Error).message}`);
      }
    }
  }
  roots.push(userRoot);

  skills = scanSkillsMulti(roots, companions);
  treeProvider.setSkills(skills);
  log(`Indexed ${skills.length} skills (workspace + user library)`);
  updateStatusBar();
  if (showToast) {
    vscode.window.showInformationMessage(`Indexed ${skills.length} skills.`);
  }
}

async function pickSkill(): Promise<SkillRecord | undefined> {
  const items = skills.map(s => ({
    label: s.id,
    description: s.category.join(" / "),
    detail: typeof s.frontmatter.description === "string" ? s.frontmatter.description : "",
    skill: s
  }));
  const pick = await vscode.window.showQuickPick(items, {
    matchOnDescription: true,
    matchOnDetail: true,
    placeHolder: "Pick a skill"
  });
  return pick?.skill;
}

// ---------- trigger-word toggle ----------

function triggerRegex(word: string): RegExp | null {
  const trimmed = word.trim();
  if (!trimmed) return null;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`);
}

/**
 * Edge-trigger toggle:
 *   - when trigger word appears (off → on), toggle the install:
 *       if anything is installed, uninstall everything;
 *       otherwise install all indexed skills.
 *   - when it stays on or stays off, do nothing
 *
 * Determinism is provided by Kiro itself once skills are installed: Kiro
 * matches your chat request against each skill's description. We just
 * provide the catalog.
 */
async function onDocumentChanged(doc: vscode.TextDocument) {
  const cfg = vscode.workspace.getConfiguration("kiroSkills");
  if (!cfg.get<boolean>("autoInstall", true)) return;
  if (skills.length === 0) return;
  if (doc.uri.scheme !== "file") return;
  if (/SKILL\.md$/i.test(doc.uri.fsPath)) return;

  const triggerWord = cfg.get<string>("triggerWord", "SKILLS");
  const re = triggerRegex(triggerWord);
  if (!re) return;

  const text = doc.getText();
  const hasTrigger = re.test(text);
  const docKey = doc.uri.toString();
  const wasOn = lastTriggerByDoc.get(docKey) ?? false;
  lastTriggerByDoc.set(docKey, hasTrigger);

  // Edge: only act on transition off → on.
  if (!hasTrigger || wasOn) return;

  const target = currentTarget();
  if (!target) return;
  const installed = listInstalled(target);
  if (installed.length > 0) {
    await uninstallAllNow(`trigger fired in ${path.basename(doc.fileName)}`);
  } else {
    await installAllNow(`trigger fired in ${path.basename(doc.fileName)}`);
  }
}

async function manualToggle() {
  const target = currentTarget();
  if (!target) return;
  const installed = listInstalled(target);
  if (installed.length > 0) {
    await uninstallAllNow("manual toggle");
  } else {
    await installAllNow("manual toggle");
  }
}

async function installAllNow(reason: string) {
  const target = currentTarget();
  if (!target) return;
  if (skills.length === 0) {
    vscode.window.showInformationMessage("No skills indexed yet. Run Skills: Refresh Index.");
    return;
  }
  const result = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Installing ${skills.length} skills into ${target.skillsDir}`,
      cancellable: false
    },
    async () => installSkills(skills, target)
  );
  log(`${reason} — installed ${result.installed}, updated ${result.updated}, errors ${result.errors.length}`);
  if (result.errors.length > 0) {
    for (const e of result.errors.slice(0, 5)) log(`  error: ${e.id} — ${e.reason}`);
  }
  vscode.window.showInformationMessage(
    `Installed ${result.installed} new, updated ${result.updated}` +
    (result.errors.length > 0 ? `, ${result.errors.length} errors (see output)` : "") +
    `. Reload Kiro to pick them up.`
  );
  updateStatusBar();
}

async function uninstallAllNow(reason: string) {
  const target = currentTarget();
  if (!target) return;
  const result = uninstallAll(target);
  log(`${reason} — removed ${result.removed} skills from ${target.skillsDir}`);
  vscode.window.showInformationMessage(`Removed ${result.removed} skills.`);
  updateStatusBar();
}

function updateStatusBar() {
  const target = currentTarget();
  if (!target) {
    statusBar.text = "$(book) Skills";
    statusBar.tooltip = "Open a workspace to use Kiro Skills Loader.";
    return;
  }
  const installed = listInstalled(target);
  const scopeLabel = target.scope === "global" ? "global" : "workspace";
  if (installed.length > 0) {
    statusBar.text = `$(star-full) Skills: ${installed.length} (${scopeLabel})`;
    statusBar.tooltip = `${installed.length} skills installed in ${target.skillsDir}. Click to uninstall all.`;
  } else {
    statusBar.text = `$(book) Skills (${scopeLabel})`;
    statusBar.tooltip = `No skills installed in ${target.skillsDir}. Click to install ${skills.length} indexed skills.`;
  }
}

function log(msg: string) {
  const ts = new Date().toISOString();
  outputChannel.appendLine(`[${ts}] ${msg}`);
}
