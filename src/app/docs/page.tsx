import React from 'react';

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#282a36] text-[#f8f8f2] p-8">
      <h1 className="text-4xl font-bold text-[#50fa7b] mb-4">GlobalCVE API Docs</h1>
      <p className="text-lg text-[#8be9fd] mb-8">
        This page documents how to query CVE data, filter by severity, and integrate with your tools.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#ff79c6] mb-2">🚀 Getting Started</h2>
        <p>
          Our API supports RESTful endpoints for CVE search, filtering, and metadata enrichment.
          Authentication is optional for public queries.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#bd93f9] mb-2">🔍 Example Endpoint</h2>
        <pre className="bg-[#44475a] p-4 rounded-md text-sm overflow-x-auto">
          GET /api/cves?query=openssl&severity=high
        </pre>
        <p className="text-sm text-[#6272a4] mt-2">
          Returns CVEs matching "openssl" with high severity.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[#f1fa8c] mb-2">📦 Coming Soon</h2>
        <ul className="list-disc list-inside">
          <li>Rate limiting and caching</li>
          <li>Vendor-specific filters</li>
          <li>Export formats (JSON, CSV)</li>
        </ul>
      </section>
    </main>
  );
}
