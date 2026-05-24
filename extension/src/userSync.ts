import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface SyncResult {
  copied: number;
  skipped: number;
  skillsRoot: string;
  userRoot: string;
}

/** Resolve the user-level skills folder. Default: ~/.kiroskills */
export function resolveUserRoot(setting?: string): string {
  const raw = (setting && setting.trim()) || "~/.kiroskills";
  if (raw.startsWith("~")) {
    return path.join(os.homedir(), raw.slice(1).replace(/^[\\/]+/, ""));
  }
  return raw;
}

/**
 * Mirror every skill folder (any folder containing SKILL.md) from
 * `workspaceRoot` into `userRoot`, preserving the relative hierarchy.
 * Existing destinations are left alone — this never deletes user content.
 */
export function syncWorkspaceToUser(workspaceRoot: string, userRoot: string): SyncResult {
  const result: SyncResult = { copied: 0, skipped: 0, skillsRoot: workspaceRoot, userRoot };
  if (!fs.existsSync(workspaceRoot)) {
    return result;
  }
  fs.mkdirSync(userRoot, { recursive: true });

  // Find all skill folders (folders containing SKILL.md) under workspaceRoot.
  const skillFolders: string[] = [];
  walkForSkills(workspaceRoot, skillFolders);

  for (const src of skillFolders) {
    const rel = path.relative(workspaceRoot, src);
    const dest = path.join(userRoot, rel);
    if (fs.existsSync(dest)) {
      result.skipped++;
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    copyDir(src, dest);
    result.copied++;
  }
  return result;
}

function walkForSkills(dir: string, out: string[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  if (entries.some(e => e.isFile() && e.name === "SKILL.md")) {
    out.push(dir);
    // Don't recurse into companion folders, but allow nested skill folders
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith(".")) {
        const sub = path.join(dir, e.name);
        if (containsSkillMd(sub)) walkForSkills(sub, out);
      }
    }
    return;
  }
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      walkForSkills(path.join(dir, e.name), out);
    }
  }
}

function containsSkillMd(dir: string): boolean {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some(e => e.isFile() && e.name === "SKILL.md")) return true;
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith(".")) {
        if (containsSkillMd(path.join(dir, e.name))) return true;
      }
    }
  } catch { /* ignore */ }
  return false;
}

/** Recursive directory copy. Skips files that already exist at the destination. */
function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      if (!fs.existsSync(d)) {
        fs.copyFileSync(s, d);
      }
    }
  }
}
