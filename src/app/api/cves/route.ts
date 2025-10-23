import { NextResponse } from 'next/server';
import { fetchJVNFeed } from "../../lib/jvn";
import { fetchExploitDB } from "../../../lib/exploitdb";

const NVD_API_KEY = process.env.NVD_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const severityFilter = searchParams.get('severity')?.toUpperCase();
  const sortOrder = searchParams.get('sort') || 'newest';
  const isExactCveId = /^CVE-\d{4}-\d{4,}$/.test(query);

  const allResults: any[] = [];

  console.log('🔍 Query:', query);
  console.log('🔐 API key loaded:', !!NVD_API_KEY);
  console.log('⚠️ Severity filter:', severityFilter);
  console.log('🔎 Exact CVE ID match mode:', isExactCveId);
  console.log('📅 Sort order:', sortOrder);

  // 🔹 Fetch from NVD (5 pages)
  for (let i = 0; i < 5; i++) {
    const startIndex = i * 100;
    const pageUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(query)}&resultsPerPage=100&startIndex=${startIndex}`;

    console.log(`🌐 NVD page ${i + 1}: ${pageUrl}`);

    try {
      const pageRes = await fetch(pageUrl, {
        headers: NVD_API_KEY ? { 'apiKey': NVD_API_KEY } : {},
      });

      console.log(`📡 NVD page ${i + 1} status: ${pageRes.status}`);

      if (!pageRes.ok) continue;

      const pageData = await pageRes.json();
      allResults.push(...(pageData.vulnerabilities || []).map((item: any) => ({
        id: item.cve.id,
        description: item.cve.descriptions?.[0]?.value || 'No description',
        severity: item.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'Unknown',
        published: item.cve.published || new Date().toISOString(),
        source: 'NVD',
      })));
    } catch (err) {
      console.error(`❌ NVD page ${i + 1} error:`, err);
    }
  }

  // 🔹 Fetch from CIRCL
  const circlSearchUrl = `https://cve.circl.lu/api/search/${encodeURIComponent(query)}`;
  console.log(`🌐 CIRCL search: ${circlSearchUrl}`);

  try {
    const circlRes = await fetch(circlSearchUrl);
    console.log(`📡 CIRCL search status: ${circlRes.status}`);

    if (circlRes.ok) {
      const circlData = await circlRes.json();
      allResults.push(...circlData.map((item: any) => ({
        id: item.id,
        description: item.summary?.trim() || 'No description available from CIRCL.',
        severity: item.cvss >= 9 ? 'CRITICAL' :
                  item.cvss >= 7 ? 'HIGH' :
                  item.cvss >= 4 ? 'MEDIUM' :
                  item.cvss > 0 ? 'LOW' : 'HIGH',
        published: item.Published && !isNaN(Date.parse(item.Published))
          ? new Date(item.Published) > new Date()
            ? new Date().toISOString()
            : item.Published
          : new Date().toISOString(),
        source: 'CIRCL',
      })));
    } else if (isExactCveId) {
      const circlIdUrl = `https://cve.circl.lu/api/cve/${encodeURIComponent(query)}`;
      console.log(`🔁 CIRCL fallback: ${circlIdUrl}`);

      const circlIdRes = await fetch(circlIdUrl);
      console.log(`📡 CIRCL fallback status: ${circlIdRes.status}`);

      if (circlIdRes.ok) {
        const item = await circlIdRes.json();
        console.log('🧩 CIRCL fallback raw:', item);

        const fallbackPublished = item.Published && !isNaN(Date.parse(item.Published))
          ? new Date(item.Published) > new Date()
            ? new Date().toISOString()
            : item.Published
          : new Date().toISOString();

        const fallbackDescription =
          item?.containers?.cna?.descriptions?.[0]?.value?.trim() ||
          'No description available from CIRCL.';

        allResults.push({
          id: item.cveMetadata?.cveId || item.id,
          description: fallbackDescription,
          severity: item.cvss >= 9 ? 'CRITICAL' :
                    item.cvss >= 7 ? 'HIGH' :
                    item.cvss >= 4 ? 'MEDIUM' :
                    item.cvss > 0 ? 'LOW' : 'HIGH',
          published: fallbackPublished,
          source: 'CIRCL',
        });
      }
    }
  } catch (err) {
    console.error('❌ CIRCL error:', err);
  }

  // 🔹 Fetch from JVN RSS
  try {
    const jvnResults = await fetchJVNFeed();
    console.log('📰 JVN feed loaded:', jvnResults.length);

    const matchingJVNs = jvnResults.filter((item) =>
      item.id === query ||
      item.id?.includes(query) ||
      item.title?.includes(query) ||
      item.description?.includes(query)
    );

    console.log('🔎 Matching JVN entries:', matchingJVNs);
    allResults.push(...matchingJVNs);
  } catch (err) {
    console.error('❌ JVN fetch error:', err);
  }

  // 🔹 Fetch from ExploitDB CSV
  try {
    const exploitResults = await fetchExploitDB();
    console.log('💣 ExploitDB entries loaded:', exploitResults.length);

    const q = query.toLowerCase();
    const matchingExploits = exploitResults.filter((item) =>
      item.id?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.source?.toLowerCase().includes(q)
    );

    console.log('🔎 Matching ExploitDB entries:', matchingExploits);
    allResults.push(...matchingExploits);
  } catch (err) {
    console.error('❌ ExploitDB fetch error:', err);
  }

  // 🔹 Fetch from CVE.org GitHub Release
  try {
    if (query.trim()) {
      const res = await fetch('https://github.com/globalcve/globalcve/releases/download/v1.0.0/cveorg.json');
      const cveorgData = await res.json();

      const q = query.toLowerCase();
      const matchingCveOrg = cveorgData.filter((item: any) =>
        item.id?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );

      console.log('📁 Matching CVE.org entries:', matchingCveOrg.length);

      allResults.push(...matchingCveOrg.map((item: any) => ({
        id: item.id,
        description: item.description || 'No description available from CVE.org.',
        severity: 'Unknown',
        published: item.published || new Date().toISOString(),
        source: 'CVE.org',
      })));
    }
  } catch (err) {
    console.error('❌ CVE.org fetch error:', err);
  }

  // 🔹 Filter by severity
  let results = allResults;

  if (severityFilter) {
    results = results.filter((cve) => cve.severity?.toUpperCase() === severityFilter);
  }

  // 🔹 Sort by publish date
  results = results.sort((a, b) => {
    const dateA = new Date(a.published).getTime();
    const dateB = new Date(b.published).getTime();
    return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  // 🔹 Limit to top 5
  results = results.slice(0, 5);

  console.log(`🧠 Returning ${results.length} CVEs`);
  return NextResponse.json({ query, results });
}
