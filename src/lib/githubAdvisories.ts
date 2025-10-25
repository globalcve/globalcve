export type GitHubAdvisory = {
  id: string;
  aliases?: string[];
  summary?: string;
  details?: string;
  affected?: { package?: { name?: string } }[];
};

const BASE_URL = "https://raw.githubusercontent.com/github/advisory-database/main/advisories";

/**
 * Loads GitHub advisories from a given category and year
 */
export async function fetchGitHubAdvisories(category: "github-reviewed" | "unreviewed", year: string): Promise<GitHubAdvisory[]> {
  const advisories: GitHubAdvisory[] = [];

  try {
    const indexUrl = `${BASE_URL}/${category}/${year}/index.json`;
    const indexRes = await fetch(indexUrl);
    if (!indexRes.ok) return advisories;

    const ghsaIds: string[] = await indexRes.json();
    for (const ghsaId of ghsaIds) {
      const fileUrl = `${BASE_URL}/${category}/${year}/${ghsaId}/${ghsaId}.json`;
      try {
        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) continue;

        const advisory = await fileRes.json();
        if (advisory && typeof advisory === 'object' && advisory.id) {
          advisories.push(advisory);
        }
      } catch {
        console.warn(`⚠️ Failed to fetch ${fileUrl}`);
      }
    }
  } catch (err) {
    console.error(`❌ Advisory fetch error for ${category}/${year}:`, err);
  }

  return advisories;
}

/**
 * Loads multiple years and merges results
 */
export async function fetchAllGitHubAdvisories(): Promise<GitHubAdvisory[]> {
  const years = ["2023", "2024", "2025"];
  const reviewed = await Promise.all(years.map(y => fetchGitHubAdvisories("github-reviewed", y)));
  const unreviewed = await Promise.all(years.map(y => fetchGitHubAdvisories("unreviewed", y)));
  return [...reviewed.flat(), ...unreviewed.flat()];
}

/**
 * Returns a Set of CVE IDs matched by keyword across GitHub advisories
 */
export function keywordMatchGitHub(advisories: GitHubAdvisory[], query: string): Set<string> {
  const q = query.toLowerCase();
  return new Set(
    advisories
      .filter((adv) =>
        [adv.summary, adv.details, ...(Array.isArray(adv.affected) ? adv.affected.map(a => a.package?.name) : [])]
          .filter((field): field is string => typeof field === 'string')
          .some((field) => field.toLowerCase().includes(q))
      )
      .flatMap((adv) => adv.aliases || [])
  );
}

/**
 * Builds a Map of alias → true for fast lookup
 */
export function mapGitHubAliases(advisories: GitHubAdvisory[]): Map<string, boolean> {
  return new Map(advisories.flatMap((adv) => (adv.aliases || []).map((id) => [id, true])));
}
