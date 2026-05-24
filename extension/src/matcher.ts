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
 *
 * Deterministic: ties are broken by category path then id, so the same input
 * always yields the same order — never random.
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
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ca = a.skill.category.join("/");
    const cb = b.skill.category.join("/");
    if (ca !== cb) return ca.localeCompare(cb);
    return a.skill.id.localeCompare(b.skill.id);
  });
  return results;
}

/**
 * Apply the "minimum N per tech area" policy to a ranked list.
 * Tech area = the skill's top-level category (LANGUAGES, WEB, AI, etc.).
 * Within each area, take the top scoring skills, padded up to `perAreaMin`
 * if the area has more candidates available. Areas with only 1 skill total
 * still contribute that 1.
 *
 * Result is rank-preserving: skills are emitted in their original score order,
 * but additional skills are pulled in to satisfy the per-area minimum.
 */
export function enforceAreaMinimum(
  ranked: ScoredSkill[],
  allSkills: SkillRecord[],
  tokens: string[],
  perAreaMin: number
): ScoredSkill[] {
  if (perAreaMin <= 1 || ranked.length === 0) return ranked;

  const areasInRanked = new Set<string>();
  for (const r of ranked) {
    areasInRanked.add(r.skill.category[0] ?? "");
  }

  // For each area present in the ranked list, ensure we have >= perAreaMin
  // entries from that area. If short, pull more candidates from allSkills,
  // re-scored against the same tokens, and append.
  const result: ScoredSkill[] = [...ranked];
  const presentIds = new Set(result.map(r => r.skill.folderPath));

  for (const area of areasInRanked) {
    const have = result.filter(r => (r.skill.category[0] ?? "") === area).length;
    if (have >= perAreaMin) continue;
    // Score ALL skills in this area against tokens (even score=0) so we have
    // something to fall back on when nothing matched directly.
    const areaSkills = allSkills.filter(s => (s.category[0] ?? "") === area && !presentIds.has(s.folderPath));
    if (areaSkills.length === 0) continue;
    const areaRanked = scoreAreaFallback(areaSkills, tokens);
    const need = perAreaMin - have;
    for (const r of areaRanked.slice(0, need)) {
      result.push(r);
      presentIds.add(r.skill.folderPath);
    }
  }

  // Re-sort the final list deterministically by score then category/id.
  result.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ca = a.skill.category.join("/");
    const cb = b.skill.category.join("/");
    if (ca !== cb) return ca.localeCompare(cb);
    return a.skill.id.localeCompare(b.skill.id);
  });
  return result;
}

/** Score skills with a relaxed floor — any skill in the area is allowed. */
function scoreAreaFallback(skills: SkillRecord[], tokens: string[]): ScoredSkill[] {
  const out: ScoredSkill[] = [];
  for (const skill of skills) {
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
      if (weight > 0) { score += weight; hits.push(t); }
    }
    // Use an id-based tiebreaker so the fallback is deterministic even at score=0.
    out.push({ skill, score, hits });
  }
  out.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.skill.id.localeCompare(b.skill.id);
  });
  return out;
}
