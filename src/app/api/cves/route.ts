// Trigger redeploy: patch confirmed
import AdmZip from 'adm-zip';
import { Buffer } from 'buffer';
console.log("🧪 LIVE PATCH: ExploitDB crash guard active");
import { NextResponse } from 'next/server';
import { fetchJVNFeed } from "../../../lib/jvn";
import { fetchExploitDB } from "../../../lib/exploitdb";
import { fetchKEV, keywordMatchKEV } from "../../../lib/kev"; // ✅ PATCHED: keyword-aware KEV

const NVD_API_KEY = process.env.NVD_API_KEY;

function isString(field: unknown): field is string {
  return typeof field === 'string';
}

function isValidDate(date: unknown): date is string {
  return (
    typeof date === 'string' &&
    !isNaN(Date.parse(date)) &&
    new Date(date).getFullYear() <= 2025
  );
}

function inferSeverity(item: any): string {
  const score = item.cvss ?? item.cvssScore ?? item.cvssv3 ?? item.cvssv2;
  if (typeof score === 'number') {
    if (score >= 9) return 'CRITICAL';
    if (score >= 7) return 'HIGH';
    if (score >= 4) return 'MEDIUM';
    if (score > 0) return 'LOW';
  }

  const label = item.severity?.toUpperCase?.();
  if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(label)) return label;

  return 'UNKNOWN';
}

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

  // 🔹 KEV enrichment (preload)
  let kevMap = new Map<string, boolean>();
  let kevKeywordMatches = new Set<string>();
  try {
    const kevList = await fetchKEV();
    kevMap = new Map(kevList.map(entry => [entry.cveID, true]));
    kevKeywordMatches = keywordMatchKEV(kevList, query); // ✅ PATCHED: keyword match set
    console.log('🚨 KEV entries loaded:', kevMap.size);
    console.log('🔎 KEV keyword matches:', kevKeywordMatches.size);
  } catch (err) {
    console.error('❌ KEV fetch error:', err);
  }

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
        severity: item.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'UNKNOWN',
        published: item.cve.published || new Date().toISOString(),
        source: 'NVD',
        kev: kevMap.has(item.cve.id) || kevKeywordMatches.has(item.cve.id), // ✅ PATCHED
      })));
    } catch (err) {
      console.error(`❌ NVD page ${i + 1} error:`, err);
    }
  }
  // 🔹 CIRCL fallback — keyword or exact ID
  try {
    const circlUrl = isExactCveId
      ? `https://cve.circl.lu/api/cve/${encodeURIComponent(query)}`
      : `https://cve.circl.lu/api/search/${encodeURIComponent(query)}`;
    console.log(`🔁 CIRCL query: ${circlUrl}`);

    const circlRes = await fetch(circlUrl);
    console.log(`📡 CIRCL status: ${circlRes.status}`);

    if (circlRes.ok) {
      const data = await circlRes.json();
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        const rawDate = item.Published;
        const published = rawDate && !isNaN(Date.parse(rawDate)) ? rawDate : null;

        const description =
          item?.summary?.trim() ||
          item?.containers?.cna?.descriptions?.[0]?.value?.trim() ||
          'No description available from CIRCL.';

        const id = item.cveMetadata?.cveId || item.id;

        allResults.push({
          id,
          description,
          severity: inferSeverity(item),
          published,
          source: 'CIRCL',
          kev: kevMap.has(id) || kevKeywordMatches.has(id), // ✅ PATCHED
        });
      }

      console.log('🧩 CIRCL entries added:', items.length);
    }
  } catch (err) {
    console.error('❌ CIRCL error:', err);
  }

  // 🔹 JVN feed with manual keyword match (lint-cleaned)
  try {
    const jvnResults = await fetchJVNFeed();
    console.log('📰 JVN feed loaded:', jvnResults.length);

    const q = query.toLowerCase();
    const matchingJVNs = jvnResults.filter((item) =>
      [item.id, item.title, item.description, item.link]
        .filter(Boolean)
        .some((field) => isString(field) && field.toLowerCase().includes(q))
    );

    console.log('🔎 Matching JVN entries:', matchingJVNs.length);
    allResults.push(...matchingJVNs.map((item) => ({
      id: item.id,
      description: item.description,
      severity: inferSeverity(item),
      published: item.published,
      source: 'JVN',
      kev: kevMap.has(item.id) || kevKeywordMatches.has(item.id), // ✅ PATCHED
    })));
  } catch (err) {
    console.error('❌ JVN fetch error:', err);
  }

  // 🔹 ExploitDB with partial match
  let exploitResults = [];
  try {
    console.log('🧪 ExploitDB fallback active');
    exploitResults = await fetchExploitDB();
    console.log('💣 ExploitDB entries loaded:', exploitResults.length);
  } catch (err) {
    console.error('❌ ExploitDB fetch error:', err);
  }

  if (exploitResults.length > 0) {
    const q = query.toLowerCase();
    const matchingExploits = exploitResults.filter((item) =>
      [item.id, item.description, item.source, item.link]
        .filter(Boolean)
        .some((field) => isString(field) && field.toLowerCase().includes(q))
    );

    console.log('🔎 Matching ExploitDB entries:', matchingExploits.length);
    allResults.push(...matchingExploits.map((item) => ({
      id: item.id,
      description: item.description,
      severity: inferSeverity(item),
      published: isValidDate(item.date) ? item.date : "2000-01-01",
      source: 'EXPLOITDB',
      kev: kevMap.has(item.id) || kevKeywordMatches.has(item.id), // ✅ PATCHED
    })));
  }

  // 🔹 CVE.org GitHub release
  try {
    if (query.trim()) {
      const res = await fetch('https://github.com/globalcve/globalcve/releases/download/v1.0.0/cveorg.json');
      const cveorgData = await res.json();

      const q = query.toLowerCase();
      const matchingCveOrg = cveorgData.filter((item: any) =>
        [item.id, item.description]
          .filter(Boolean)
          .some((field) => isString(field) && field.toLowerCase().includes(q))
      );

      console.log('📁 Matching CVE.org entries:', matchingCveOrg.length);

      allResults.push(...matchingCveOrg.map((item: any) => ({
        id: item.id,
        description: item.description || 'No description available from CVE.org.',
        severity: inferSeverity(item),
        published: item.published || new Date().toISOString(),
        source: 'CVE.ORG',
        kev: kevMap.has(item.id) || kevKeywordMatches.has(item.id), // ✅ PATCHED
      })));
    }
  } catch (err) {
    console.error('❌ CVE.org fetch error:', err);
  }
  // 🔹 Archive ZIP with guard for missing year (patched)
  try {
    const yearMatch = !isExactCveId ? query.match(/^CVE-(\d{4})-/) : null;
    const year = yearMatch?.[1];

    if (year) {
      console.log(`📦 Fetching ${year}.json from cves.zip`);
      const zipRes = await fetch('https://github.com/globalcve/globalcve/releases/download/v1.0.1/cves.zip');
      const zipBuffer = Buffer.from(await zipRes.arrayBuffer());
      const zip = new AdmZip(zipBuffer);

      const entry = zip.getEntry(`cves/${year}.json`);
      if (entry) {
        const jsonString = entry.getData().toString('utf-8');
        const yearData = JSON.parse(jsonString);

        const q = query.toLowerCase();
        const matchingYearCVEs = yearData.filter((item: any) =>
          [item.id, item.description]
            .filter(Boolean)
            .some((field) => isString(field) && field.toLowerCase().includes(q))
        );

        console.log(`📁 Matching ${year} CVEs:`, matchingYearCVEs.length);

        allResults.push(...matchingYearCVEs.map((item: any) => ({
          id: item.id,
          description: item.description || 'No description available from archive.',
          severity: inferSeverity(item),
          published: item.published || new Date().toISOString(),
          source: 'ARCHIVE',
          kev: kevMap.has(item.id) || kevKeywordMatches.has(item.id), // ✅ PATCHED
        })));
      } else {
        console.warn(`⚠️ ${year}.json not found in cves.zip`);
      }
    }
  } catch (err) {
    console.error('❌ Archive CVE fetch error:', err);
  }

  // 🔹 Prioritize exact CVE ID match if applicable
  let results = isExactCveId
    ? allResults.filter((r) => r.id?.toUpperCase() === query.toUpperCase())
    : allResults;

  console.log('🎯 Exact match results:', results.length);

  // 🔹 Filter by severity
  if (severityFilter) {
    results = results.filter((cve) => cve.severity?.toUpperCase() === severityFilter);
  }

  // 🔹 Sort by publish date
  results = results.sort((a, b) => {
    const dateA = new Date(a.published).getTime();
    const dateB = new Date(b.published).getTime();
    return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  // 🔹 Apply pagination
  const startIndex = parseInt(searchParams.get('startIndex') || '0', 10);
  const paginatedResults = results.slice(startIndex, startIndex + 100);

  console.log(`🧠 Returning ${paginatedResults.length} CVEs`);
  return NextResponse.json({ query, results: paginatedResults });
}
