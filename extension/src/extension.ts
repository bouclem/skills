import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { scanSkills } from "./scanner";
import { scoreSkills, tokenize } from "./matcher";
import {
  purgeGeneratedSteering,
  removeSteering,
  steeringFileName,
  writeSteering,
  SteeringOptions
} from "./steering";
import { SkillsTreeProvider } from "./tree";
import { SkillRecord } from "./types";

let skills: SkillRecord[] = [];
let treeProvider: SkillsTreeProvider;
let activeIds = new Set<string>();
let outputChannel: vscode.OutputChannel;
let statusBar: vscode.StatusBarItem;
/** Tracks the last toggle decision per document so we don't flap on every keystroke. */
const lastDecisionByDoc = new Map<string, { hadTrigger: boolean; activated: Set<string> }>();

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Kiro Skills");
  treeProvider = new SkillsTreeProvider();

  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.command = "kiroSkills.toggleForActiveFile";
  statusBar.text = "$(book) Skills";
  statusBar.tooltip = "Toggle skills for the active file (uses the same matching as auto-activation).";
  statusBar.show();

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("kiroSkills.tree", treeProvider),
    outputChannel,
    statusBar
  );

  // Initial scan
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

  // Re-scan on config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("kiroSkills")) {
        void refreshIndex();
      }
    })
  );

  // Auto-toggle on trigger word: only fires when configured trigger word is present.
  // Subscribes to active editor changes, document opens, and text edits (debounced).
  const reactToDoc = (doc: vscode.TextDocument | undefined) => {
    if (doc) void autoToggleForDocument(doc);
    updateStatusBar();
  };
  const debounceTimers = new Map<string, NodeJS.Timeout>();
  const debouncedReact = (doc: vscode.TextDocument) => {
    const key = doc.uri.toString();
    const existing = debounceTimers.get(key);
    if (existing) clearTimeout(existing);
    debounceTimers.set(key, setTimeout(() => {
      debounceTimers.delete(key);
      reactToDoc(doc);
    }, 400));
  };
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => reactToDoc(editor?.document)),
    vscode.workspace.onDidOpenTextDocument(doc => reactToDoc(doc)),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (vscode.window.activeTextEditor?.document === e.document) {
        debouncedReact(e.document);
      }
    }),
    vscode.workspace.onDidCloseTextDocument(doc => {
      lastDecisionByDoc.delete(doc.uri.toString());
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
    vscode.commands.registerCommand("kiroSkills.activateSkill", async (skill?: SkillRecord) => {
      const target = skill ?? await pickSkill();
      if (!target) return;
      const w = workspaceRoot(); if (!w) return;
      const fp = writeSteering(w, target, currentSteeringOpts());
      activeIds.add(target.id);
      treeProvider.setActive(activeIds);
      log(`Activated: ${target.id} → ${path.basename(fp)}`);
      vscode.window.showInformationMessage(`Activated skill: ${target.id}`);
    }),
    vscode.commands.registerCommand("kiroSkills.deactivateSkill", async (skill?: SkillRecord) => {
      const target = skill ?? await pickSkill();
      if (!target) return;
      const w = workspaceRoot(); if (!w) return;
      removeSteering(w, target);
      activeIds.delete(target.id);
      treeProvider.setActive(activeIds);
      log(`Deactivated: ${target.id}`);
    }),
    vscode.commands.registerCommand("kiroSkills.regenerateSteering", async () => {
      const w = workspaceRoot(); if (!w) return;
      const removed = purgeGeneratedSteering(w);
      const opts = currentSteeringOpts();
      let written = 0;
      for (const id of activeIds) {
        const s = skills.find(x => x.id === id);
        if (s) { writeSteering(w, s, opts); written++; }
      }
      vscode.window.showInformationMessage(
        `Steering regenerated. Removed ${removed}, wrote ${written}.`
      );
    }),
    vscode.commands.registerCommand("kiroSkills.toggleForActiveFile", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor.");
        return;
      }
      void manualToggleForDocument(editor.document);
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
    })
  );
}

export function deactivate() { /* nothing */ }

// ---------- helpers ----------

function workspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function currentSteeringOpts(): SteeringOptions {
  const cfg = vscode.workspace.getConfiguration("kiroSkills");
  return {
    inclusion: cfg.get("steeringInclusion", "fileMatch") as SteeringOptions["inclusion"],
    maxChars: cfg.get("maxKeywordChars", 6000)
  };
}

async function refreshIndex(showToast = false) {
  const w = workspaceRoot();
  if (!w) return;
  const cfg = vscode.workspace.getConfiguration("kiroSkills");
  const rel = cfg.get<string>("skillsRoot", "SKILLS");
  const companions = cfg.get<string[]>("companionFolders", []);
  const root = path.join(w, rel);
  skills = scanSkills(root, companions);
  treeProvider.setSkills(skills);
  // reload active set from existing generated steering files
  activeIds = readActiveFromDisk(w);
  treeProvider.setActive(activeIds);
  log(`Indexed ${skills.length} skills under ${rel}`);
  if (showToast) {
    vscode.window.showInformationMessage(`Indexed ${skills.length} skills.`);
  }
}

function readActiveFromDisk(workspace: string): Set<string> {
  const dir = path.join(workspace, ".kiro", "steering");
  const set = new Set<string>();
  if (!fs.existsSync(dir)) return set;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith("skill--") && name.endsWith(".md")) {
      // filename: skill--<category>--<id>.md
      const stem = name.slice("skill--".length, -".md".length);
      const lastSep = stem.lastIndexOf("--");
      if (lastSep > 0) set.add(stem.slice(lastSep + 2));
    }
  }
  return set;
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

// ---------- auto-toggle (trigger word gated) ----------

const AUTO_LIMIT = 5;
const AUTO_THRESHOLD = 4;

/**
 * Build a regex that matches the trigger word as a whole word, case-sensitive.
 * Trigger word can be any non-empty string of word characters.
 */
function triggerRegex(word: string): RegExp | null {
  const trimmed = word.trim();
  if (!trimmed) return null;
  // Escape regex metacharacters
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![A-Za-z0-9_])${escaped}(?![A-Za-z0-9_])`);
}

/**
 * Auto-toggle behavior:
 *  - If the trigger word is present and the matched skills are NOT yet active,
 *    activate them.
 *  - If the trigger word is present and they ARE active (per our last decision
 *    for this doc), deactivate them.
 *  - If the trigger word is absent, do nothing — manual state is preserved.
 */
async function autoToggleForDocument(doc: vscode.TextDocument) {
  const cfg = vscode.workspace.getConfiguration("kiroSkills");
  if (!cfg.get<boolean>("autoSteering", true)) return;
  if (skills.length === 0) return;
  if (doc.uri.scheme !== "file") return;

  const w = workspaceRoot(); if (!w) return;
  if (!doc.uri.fsPath.startsWith(w)) return;
  if (/SKILL\.md$/i.test(doc.uri.fsPath)) return;

  const triggerWord = cfg.get<string>("triggerWord", "SKILLS");
  const re = triggerRegex(triggerWord);
  if (!re) return;

  const text = doc.getText();
  const hasTrigger = re.test(text);
  const docKey = doc.uri.toString();
  const last = lastDecisionByDoc.get(docKey);

  if (!hasTrigger) {
    // Trigger removed — record state but don't change anything.
    if (last) {
      lastDecisionByDoc.set(docKey, { ...last, hadTrigger: false });
    }
    return;
  }

  // Trigger is present.
  // Edge-trigger: only act on transitions (off→on). If the trigger was already
  // present last time we checked, do nothing — typing more should not flap state.
  if (last && last.hadTrigger) {
    return;
  }

  // Transition off→on. If we already activated for this doc previously and
  // those activations are still in place, this re-trigger means "deactivate".
  if (last && last.activated.size > 0) {
    let removed = 0;
    for (const id of last.activated) {
      if (activeIds.has(id)) {
        const s = skills.find(x => x.id === id);
        if (s) {
          removeSteering(w, s);
          activeIds.delete(id);
          removed++;
        }
      }
    }
    if (removed > 0) {
      log(`Auto-deactivated ${removed} skills for ${path.basename(doc.fileName)}`);
    }
    treeProvider.setActive(activeIds);
    lastDecisionByDoc.set(docKey, { hadTrigger: true, activated: new Set() });
    updateStatusBar();
    return;
  }

  // Otherwise — trigger present but nothing activated yet for this doc → activate.
  const tokens = collectSignals(doc);
  if (tokens.length === 0) return;
  const ranked = scoreSkills(skills, tokens).slice(0, AUTO_LIMIT);
  if (ranked.length === 0) return;

  const opts = currentSteeringOpts();
  const justActivated = new Set<string>();
  for (const r of ranked) {
    if (r.score < AUTO_THRESHOLD) continue;
    if (activeIds.has(r.skill.id)) continue;
    writeSteering(w, r.skill, opts);
    activeIds.add(r.skill.id);
    justActivated.add(r.skill.id);
    log(`Auto-activated: ${r.skill.id} (score=${r.score}, hits=${r.hits.join(",")})`);
  }
  if (justActivated.size > 0) {
    treeProvider.setActive(activeIds);
  }
  lastDecisionByDoc.set(docKey, { hadTrigger: true, activated: justActivated });
  updateStatusBar();
}

/**
 * Manual toggle from the status bar / command palette. Ignores the trigger
 * word and just flips state for the current document's matched skills.
 */
async function manualToggleForDocument(doc: vscode.TextDocument) {
  if (skills.length === 0) {
    vscode.window.showInformationMessage("No skills indexed yet.");
    return;
  }
  const w = workspaceRoot(); if (!w) return;
  const docKey = doc.uri.toString();
  const last = lastDecisionByDoc.get(docKey);
  const opts = currentSteeringOpts();

  // If we have an existing activation for this doc, toggle OFF.
  if (last && last.activated.size > 0) {
    let removed = 0;
    for (const id of last.activated) {
      const s = skills.find(x => x.id === id);
      if (s && activeIds.has(id)) {
        removeSteering(w, s);
        activeIds.delete(id);
        removed++;
      }
    }
    treeProvider.setActive(activeIds);
    lastDecisionByDoc.set(docKey, { hadTrigger: !!last?.hadTrigger, activated: new Set() });
    updateStatusBar();
    vscode.window.showInformationMessage(`Deactivated ${removed} skills.`);
    return;
  }

  // Otherwise compute matches and activate
  const tokens = collectSignals(doc);
  const ranked = scoreSkills(skills, tokens).slice(0, AUTO_LIMIT);
  if (ranked.length === 0) {
    vscode.window.showInformationMessage("No matching skills for this file.");
    return;
  }
  const justActivated = new Set<string>();
  for (const r of ranked) {
    if (r.score < AUTO_THRESHOLD) continue;
    if (activeIds.has(r.skill.id)) continue;
    writeSteering(w, r.skill, opts);
    activeIds.add(r.skill.id);
    justActivated.add(r.skill.id);
  }
  if (justActivated.size === 0) {
    vscode.window.showInformationMessage("No matching skills met the activation threshold.");
    return;
  }
  treeProvider.setActive(activeIds);
  lastDecisionByDoc.set(docKey, { hadTrigger: !!last?.hadTrigger, activated: justActivated });
  updateStatusBar();
  vscode.window.showInformationMessage(
    `Activated ${justActivated.size} skills: ${[...justActivated].join(", ")}`
  );
}

function updateStatusBar() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    statusBar.text = "$(book) Skills";
    return;
  }
  const last = lastDecisionByDoc.get(editor.document.uri.toString());
  const n = last?.activated.size ?? 0;
  if (n > 0) {
    statusBar.text = `$(star-full) Skills: ${n}`;
    statusBar.tooltip = `${n} skills active for this file. Click to deactivate.`;
  } else {
    statusBar.text = "$(book) Skills";
    statusBar.tooltip = "No skills active for this file. Click to activate matches.";
  }
}

/**
 * Build query tokens from a document: file extension, file name, and a small
 * sample of the content. This drives auto-detection like Kiro steering rules.
 */
function collectSignals(doc: vscode.TextDocument): string[] {
  const tokens = new Set<string>();
  const ext = path.extname(doc.fileName).replace(/^\./, "").toLowerCase();
  if (ext) {
    // Map common extensions to skill keywords
    const expand: Record<string, string[]> = {
      py: ["python"],
      ipynb: ["python", "jupyter"],
      js: ["javascript"], mjs: ["javascript"], cjs: ["javascript"],
      ts: ["typescript"], tsx: ["typescript", "react"],
      jsx: ["javascript", "react"],
      html: ["html", "web", "frontend"],
      css: ["css"], scss: ["scss"], sass: ["sass"],
      java: ["java"],
      kt: ["kotlin"], kts: ["kotlin"],
      rs: ["rust"],
      go: ["go", "golang"],
      cs: ["csharp", "dotnet"],
      cpp: ["cpp"], cc: ["cpp"], cxx: ["cpp"], hpp: ["cpp"], h: ["cpp"],
      rb: ["ruby"],
      php: ["php"],
      swift: ["swift"],
      ex: ["elixir"], exs: ["elixir"],
      hs: ["haskell"],
      scala: ["scala"], sbt: ["scala"],
      jl: ["julia"],
      lua: ["lua"],
      sh: ["bash"], bash: ["bash"], zsh: ["bash"], ps1: ["powershell"],
      sql: ["sql", "database"],
      yaml: ["yaml"], yml: ["yaml"],
      tf: ["terraform"],
      vue: ["vue"], svelte: ["svelte"],
      dart: ["dart", "flutter"],
      xaml: ["xaml", "maui"]
    };
    for (const t of (expand[ext] ?? [ext])) tokens.add(t);
  }
  for (const t of tokenize(path.basename(doc.fileName, path.extname(doc.fileName)))) tokens.add(t);
  // Sample first 4000 chars to keep it cheap
  const sample = doc.getText().slice(0, 4000);
  for (const t of tokenize(sample)) tokens.add(t);
  return [...tokens];
}

function log(msg: string) {
  const ts = new Date().toISOString();
  outputChannel.appendLine(`[${ts}] ${msg}`);
}
