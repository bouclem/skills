import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { SkillRecord } from "./types";

/**
 * Kiro discovers skills by scanning specific folders:
 *   global:    ~/.kiro/skills/<skill-name>/SKILL.md
 *   workspace: <ws>/.kiro/skills/<skill-name>/SKILL.md
 *
 * Skills live in a flat layout (no category nesting). The frontmatter `name`
 * field must match the folder name. This module copies skills from the
 * deep-nested SKILLS/ tree into the flat Kiro layout.
 */

export type Scope = "global" | "workspace";

export interface InstallTarget {
  scope: Scope;
  /** Absolute path to <root>/.kiro/skills */
  skillsDir: string;
  /** Absolute path to the manifest file we use to track installs. */
  manifestPath: string;
}

export interface InstallResult {
  installed: number;
  updated: number;
  skipped: number;
  errors: { id: string; reason: string }[];
}

interface Manifest {
  version: 1;
  installed: Record<string, { source: string; installedAt: string }>;
}

const MANIFEST_FILE = "kiro-skills-loader.manifest.json";

export function resolveTarget(scope: Scope, workspaceRoot?: string): InstallTarget | null {
  if (scope === "workspace") {
    if (!workspaceRoot) return null;
    const skillsDir = path.join(workspaceRoot, ".kiro", "skills");
    return { scope, skillsDir, manifestPath: path.join(skillsDir, MANIFEST_FILE) };
  }
  const skillsDir = path.join(os.homedir(), ".kiro", "skills");
  return { scope, skillsDir, manifestPath: path.join(skillsDir, MANIFEST_FILE) };
}

/**
 * Sanitize a name to satisfy Kiro's spec: lowercase, [a-z0-9-]+, max 64 chars.
 * Folder names like "001-python-pro" already pass; this is mostly a safety net.
 */
export function sanitizeName(raw: string): string {
  let s = raw.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (s.length > 64) s = s.slice(0, 64).replace(/-+$/g, "");
  if (!s) s = "skill";
  return s;
}

function readManifest(target: InstallTarget): Manifest {
  if (!fs.existsSync(target.manifestPath)) {
    return { version: 1, installed: {} };
  }
  try {
    const raw = fs.readFileSync(target.manifestPath, "utf8");
    const parsed = JSON.parse(raw) as Manifest;
    if (parsed.version === 1 && parsed.installed) return parsed;
  } catch { /* fall through */ }
  return { version: 1, installed: {} };
}

function writeManifest(target: InstallTarget, manifest: Manifest) {
  fs.mkdirSync(target.skillsDir, { recursive: true });
  fs.writeFileSync(target.manifestPath, JSON.stringify(manifest, null, 2), "utf8");
}

/**
 * Install (or refresh) the given skills into the Kiro skills folder.
 * - Flat layout: each skill becomes a top-level subfolder named after its id.
 * - Frontmatter `name:` is rewritten to match the folder if missing or wrong.
 * - Companion files are copied alongside.
 * - Existing installs are updated; only files newer in source are overwritten.
 * - Tracked via a manifest so uninstall is clean.
 */
export function installSkills(skills: SkillRecord[], target: InstallTarget): InstallResult {
  fs.mkdirSync(target.skillsDir, { recursive: true });
  const manifest = readManifest(target);
  const result: InstallResult = { installed: 0, updated: 0, skipped: 0, errors: [] };

  // Collect intended folder names; resolve collisions deterministically.
  const usedNames = new Set<string>();
  const plan: { skill: SkillRecord; folderName: string }[] = [];

  // Sort skills deterministically to make collision resolution stable.
  const sorted = [...skills].sort((a, b) => {
    const ca = a.category.join("/");
    const cb = b.category.join("/");
    if (ca !== cb) return ca.localeCompare(cb);
    return a.id.localeCompare(b.id);
  });

  for (const s of sorted) {
    let base = sanitizeName(s.id);
    let name = base;
    let n = 2;
    while (usedNames.has(name)) {
      const suffix = `-${n}`;
      name = (base + suffix).slice(0, 64);
      n++;
    }
    usedNames.add(name);
    plan.push({ skill: s, folderName: name });
  }

  for (const item of plan) {
    try {
      const dest = path.join(target.skillsDir, item.folderName);
      const wasInstalled = !!manifest.installed[item.folderName];
      copySkillFolder(item.skill, dest, item.folderName);
      manifest.installed[item.folderName] = {
        source: item.skill.folderPath,
        installedAt: new Date().toISOString()
      };
      if (wasInstalled) result.updated++;
      else result.installed++;
    } catch (err) {
      result.errors.push({
        id: item.skill.id,
        reason: (err as Error).message
      });
    }
  }

  writeManifest(target, manifest);
  return result;
}

/**
 * Remove every skill the manifest claims we installed. Untracked content in
 * the skills folder is left alone (the user might have other skills there).
 */
export function uninstallAll(target: InstallTarget): { removed: number } {
  if (!fs.existsSync(target.skillsDir)) return { removed: 0 };
  const manifest = readManifest(target);
  let removed = 0;
  for (const folderName of Object.keys(manifest.installed)) {
    const dest = path.join(target.skillsDir, folderName);
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
      removed++;
    }
    delete manifest.installed[folderName];
  }
  writeManifest(target, manifest);
  return { removed };
}

export function listInstalled(target: InstallTarget): string[] {
  const manifest = readManifest(target);
  return Object.keys(manifest.installed).sort();
}

// --- internal ---

function copySkillFolder(skill: SkillRecord, dest: string, folderName: string) {
  fs.mkdirSync(dest, { recursive: true });

  // Copy SKILL.md, fixing frontmatter `name` and `description` if needed.
  const srcSkillMd = path.join(skill.folderPath, "SKILL.md");
  const raw = fs.readFileSync(srcSkillMd, "utf8");
  const fixed = ensureFrontmatter(raw, folderName, skill);
  fs.writeFileSync(path.join(dest, "SKILL.md"), fixed, "utf8");

  // Copy companion files. CompanionFile.relPath is relative to the SKILL FOLDER
  // (e.g. "references/foo.md" or "config.json" for loose siblings). We just
  // mirror that structure under the destination.
  for (const c of skill.companions) {
    const finalTarget = path.join(dest, c.relPath);
    fs.mkdirSync(path.dirname(finalTarget), { recursive: true });
    fs.copyFileSync(c.absPath, finalTarget);
  }
}

/**
 * Ensure the skill has a YAML frontmatter block with `name` matching
 * `folderName` and a non-empty `description`. Preserves any existing fields.
 *
 * If frontmatter is missing or invalid, prepend a minimal one. We only modify
 * the COPY going into ~/.kiro/skills — the source SKILL.md is never touched.
 */
function ensureFrontmatter(raw: string, folderName: string, skill: SkillRecord): string {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const desc = pickDescription(skill);

  if (!match) {
    const block = renderFrontmatterBlock({ name: folderName, description: desc });
    return block + raw;
  }

  const block = match[1];
  const body = raw.slice(match[0].length);

  // Re-emit frontmatter with corrected name + description, keeping unknown keys.
  const lines = block.split(/\r?\n/);
  const kept: string[] = [];
  let hasName = false;
  let hasDesc = false;
  for (const line of lines) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) { kept.push(line); continue; }
    const k = m[1];
    if (k === "name") {
      kept.push(`name: ${folderName}`);
      hasName = true;
      continue;
    }
    if (k === "description") {
      // Keep whatever description is already there — don't re-quote, that
      // produces "\"...\"" if the source was already quoted. Only synthesize
      // a description when the field is empty.
      const inline = m[2].trim();
      if (inline) {
        kept.push(line);
      } else {
        kept.push(`description: ${escapeScalar(desc)}`);
      }
      hasDesc = true;
      continue;
    }
    kept.push(line);
  }
  if (!hasName) kept.unshift(`name: ${folderName}`);
  if (!hasDesc) kept.push(`description: ${escapeScalar(desc)}`);

  return `---\n${kept.join("\n")}\n---\n${body}`;
}

function renderFrontmatterBlock(fm: { name: string; description: string }): string {
  return `---\nname: ${fm.name}\ndescription: ${escapeScalar(fm.description)}\n---\n\n`;
}

function escapeScalar(v: string): string {
  // YAML scalar safety: if value contains : or # or starts with quoting chars, wrap in double quotes.
  const needsQuote = /[:#\n]|^[\s"'>!|*&]/.test(v);
  if (!needsQuote) return v;
  return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
}

function pickDescription(skill: SkillRecord): string {
  const fm = skill.frontmatter;
  if (typeof fm.description === "string" && fm.description.trim()) return fm.description.trim().slice(0, 1000);
  // Fall back to first non-empty sentence of body, capped to 200 chars.
  const firstPara = skill.body.split(/\r?\n\r?\n/).map(s => s.trim()).find(Boolean) ?? "";
  const cleaned = firstPara.replace(/^#+\s*/, "").replace(/\s+/g, " ");
  return (cleaned.slice(0, 300) || `Skill ${skill.id}`).slice(0, 1000);
}
