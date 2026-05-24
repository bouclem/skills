import * as fs from "fs";
import * as path from "path";
import { parseFrontmatter } from "./frontmatter";
import { CompanionFile, SkillRecord } from "./types";

/**
 * Recursively find every SKILL.md under `root` and build a SkillRecord for each.
 * Supports arbitrary depth — works for SKILLS/AI/AGENTS/001-foo/SKILL.md
 * as well as single-level layouts.
 */
export function scanSkills(root: string, companionFolders: string[]): SkillRecord[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  const records: SkillRecord[] = [];
  walk(root, root, records, companionFolders);
  return records;
}

/**
 * Scan multiple roots (e.g. workspace SKILLS/ + user ~/.kiroskills) and merge
 * results. When the same skill id exists in more than one root, the first
 * occurrence wins — pass workspace root first to give it priority.
 */
export function scanSkillsMulti(roots: string[], companionFolders: string[]): SkillRecord[] {
  const seen = new Set<string>();
  const out: SkillRecord[] = [];
  for (const root of roots) {
    if (!root) continue;
    const records = scanSkills(root, companionFolders);
    for (const r of records) {
      // Dedup by category path + id, so two skills with the same id under
      // different categories are kept distinct.
      const key = [...r.category, r.id].join("/");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

function walk(current: string, root: string, out: SkillRecord[], companionFolders: string[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(current, { withFileTypes: true });
  } catch {
    return;
  }
  // If this folder is itself a skill, record it and stop descending into companions.
  const skillFile = entries.find(e => e.isFile() && e.name === "SKILL.md");
  if (skillFile) {
    const record = buildRecord(current, root, companionFolders);
    if (record) {
      out.push(record);
    }
    // Still descend into non-companion subfolders, in case a skill nests another
    // (rare, but supported).
    for (const e of entries) {
      if (e.isDirectory() && !companionFolders.includes(e.name) && !e.name.startsWith(".")) {
        // only descend if it likely contains another skill
        const sub = path.join(current, e.name);
        if (containsSkillMd(sub)) {
          walk(sub, root, out, companionFolders);
        }
      }
    }
    return;
  }
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      walk(path.join(current, e.name), root, out, companionFolders);
    }
  }
}

function containsSkillMd(dir: string): boolean {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some(e => e.isFile() && e.name === "SKILL.md")) {
      return true;
    }
    for (const e of entries) {
      if (e.isDirectory() && !e.name.startsWith(".")) {
        if (containsSkillMd(path.join(dir, e.name))) {
          return true;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}

function buildRecord(folder: string, root: string, companionFolders: string[]): SkillRecord | null {
  const skillPath = path.join(folder, "SKILL.md");
  let raw: string;
  try {
    raw = fs.readFileSync(skillPath, "utf8");
  } catch {
    return null;
  }
  const { fm, body } = parseFrontmatter(raw);
  const rel = path.relative(root, folder);
  const segments = rel.split(path.sep);
  const id = segments[segments.length - 1];
  const category = segments.slice(0, -1);

  const companions = collectCompanions(folder, companionFolders);

  return {
    id,
    skillPath,
    folderPath: folder,
    category,
    frontmatter: fm,
    body,
    companions
  };
}

function collectCompanions(folder: string, companionFolders: string[]): CompanionFile[] {
  const result: CompanionFile[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(folder, { withFileTypes: true });
  } catch {
    return result;
  }
  for (const e of entries) {
    if (e.isDirectory() && companionFolders.includes(e.name)) {
      collectFiles(path.join(folder, e.name), folder, e.name, result);
    } else if (e.isFile() && e.name !== "SKILL.md" && /\.(md|txt|json|yaml|yml|py|js|ts|sh|ps1)$/i.test(e.name)) {
      // loose siblings (README, supporting files)
      result.push({
        category: "",
        relPath: e.name,
        absPath: path.join(folder, e.name)
      });
    }
  }
  return result;
}

function collectFiles(dir: string, base: string, category: string, out: CompanionFile[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      collectFiles(abs, base, category, out);
    } else if (e.isFile()) {
      out.push({
        category,
        relPath: path.relative(base, abs),
        absPath: abs
      });
    }
  }
}
