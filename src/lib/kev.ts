export type KEVEntry = {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  dueDate: string;
  notes: string;
};

const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

/**
 * Fetches the latest KEV catalog from CISA
 */
export async function fetchKEV(): Promise<KEVEntry[]> {
  try {
    const res = await fetch(KEV_URL);
    if (!res.ok) throw new Error(`KEV fetch failed: ${res.status}`);
    const data = await res.json();
    return data.vulnerabilities || [];
  } catch (err) {
    console.error("❌ KEV fetch error:", err);
    return [];
  }
}

/**
 * Keyword search across KEV entries
 */
export function searchKEV(kevList: KEVEntry[], query: string): KEVEntry[] {
  const q = query.toLowerCase();
  return kevList.filter((item) =>
    [item.cveID, item.vendorProject, item.product, item.vulnerabilityName, item.notes]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  );
}

/**
 * Returns a Set of CVE IDs matched by vendorProject or product keywords
 */
export function keywordMatchKEV(kevList: KEVEntry[], query: string): Set<string> {
  const q = query.toLowerCase();
  return new Set(
    kevList
      .filter((entry) =>
        [entry.vendorProject, entry.product]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      )
      .map((entry) => entry.cveID)
  );
}
