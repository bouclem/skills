import { SkillFrontmatter } from "./types";

/**
 * Minimal YAML frontmatter parser. Avoids a dependency on js-yaml for the
 * narrow subset we need (scalars, inline lists, multi-line lists).
 */
export function parseFrontmatter(raw: string): { fm: SkillFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { fm: {}, body: raw };
  }
  const block = match[1];
  const body = raw.slice(match[0].length);
  const fm: SkillFrontmatter = {};

  const lines = block.split(/\r?\n/);
  let currentListKey: string | null = null;
  let currentList: string[] = [];

  const flushList = () => {
    if (currentListKey) {
      fm[currentListKey] = currentList;
      currentListKey = null;
      currentList = [];
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    // multi-line list item
    if (currentListKey && /^\s*-\s+/.test(line)) {
      currentList.push(line.replace(/^\s*-\s+/, "").trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    // key: value
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) {
      continue;
    }
    flushList();
    const key = kv[1].trim();
    const valueRaw = kv[2].trim();
    if (valueRaw === "" || valueRaw === "|" || valueRaw === ">") {
      // start of a list or block scalar — treat as list start
      currentListKey = key;
      currentList = [];
      continue;
    }
    // inline list: [a, b, c]
    if (valueRaw.startsWith("[") && valueRaw.endsWith("]")) {
      const items = valueRaw
        .slice(1, -1)
        .split(",")
        .map(s => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      fm[key] = items;
      continue;
    }
    // scalar
    fm[key] = valueRaw.replace(/^["']|["']$/g, "");
  }
  flushList();

  // Normalize keywords: accept "keywords", "tags", or comma-separated string
  if (typeof fm.keywords === "string") {
    fm.keywords = (fm.keywords as string)
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }

  return { fm, body };
}
