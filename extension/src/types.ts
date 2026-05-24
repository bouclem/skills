export interface SkillFrontmatter {
  name?: string;
  description?: string;
  keywords?: string[];
  [key: string]: unknown;
}

export interface CompanionFile {
  /** Folder type: references, examples, etc. Empty string for loose siblings. */
  category: string;
  /** File path relative to the skill folder. */
  relPath: string;
  /** Absolute file path. */
  absPath: string;
}

export interface SkillRecord {
  /** Unique slug (e.g. "001-csharp-pro"). */
  id: string;
  /** Absolute path to SKILL.md. */
  skillPath: string;
  /** Absolute path to the skill folder. */
  folderPath: string;
  /** Path segments under SKILLS/ (e.g. ["LANGUAGES", "CSHARP"]). */
  category: string[];
  /** Parsed YAML frontmatter (best-effort). */
  frontmatter: SkillFrontmatter;
  /** Plain body of SKILL.md (frontmatter stripped). */
  body: string;
  /** Companion files discovered next to SKILL.md. */
  companions: CompanionFile[];
}
