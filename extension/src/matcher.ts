import { SkillRecord } from "./types";

/**
 * Build the searchable haystack for a skill: id, category, frontmatter
 * keywords/description/name, and a small slice of the body.
 */
function haystack(s: SkillRecord): string {
  const parts: string[] = [];
  parts.push(s.id);
  parts.push(...s.category);
  if (typeof s.frontmatter.name === "string") parts.push(s.frontmatter.name);
  if (typeof s.frontmatter.description === "string") parts.push(s.frontmatter.description);
  if (Array.isArray(s.frontmatter.keywords)) parts.push(...(s.frontmatter.keywords as string[]));
  // first 800 chars of body
  parts.push(s.body.slice(0, 800));
  return parts.join(" \n ").toLowerCase();
}

const STOPWORDS = new Set([
  "the","a","an","and","or","but","of","to","for","with","in","on","at","by",
  "is","are","be","this","that","it","as","from","into","i","you","we","they"
]);

/** Tokenize a free-text query into searchable terms. */
export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

export interface ScoredSkill {
  skill: SkillRecord;
  score: number;
  hits: string[];
}

/**
 * Score skills against a tokenized query. Token in id/keywords scores higher
 * than token in body. Returns sorted descending by score.
 */
export function scoreSkills(skills: SkillRecord[], tokens: string[]): ScoredSkill[] {
  if (tokens.length === 0) return [];
  const results: ScoredSkill[] = [];
  for (const skill of skills) {
    const hay = haystack(skill);
    const idLower = skill.id.toLowerCase();
    const keywordSet = new Set(
      (Array.isArray(skill.frontmatter.keywords) ? (skill.frontmatter.keywords as string[]) : [])
        .map(k => k.toLowerCase())
    );
    let score = 0;
    const hits: string[] = [];
    for (const t of tokens) {
      let weight = 0;
      if (idLower.includes(t)) weight += 3;
      if (keywordSet.has(t)) weight += 4;
      if (typeof skill.frontmatter.description === "string" &&
          skill.frontmatter.description.toLowerCase().includes(t)) {
        weight += 2;
      }
      if (weight === 0 && hay.includes(t)) weight = 1;
      if (weight > 0) {
        score += weight;
        hits.push(t);
      }
    }
    if (score > 0) {
      results.push({ skill, score, hits });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
