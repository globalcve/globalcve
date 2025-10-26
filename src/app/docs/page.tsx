import React from 'react';

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#282a36] text-[#f8f8f2] p-8">
      <h1 className="text-4xl font-bold text-[#50fa7b] mb-4">GlobalCVE API Docs</h1>
      <p className="text-lg text-[#8be9fd] mb-8">
        This page documents how to query CVE data, filter by severity, and integrate with your tools.
      </p>

      <section className="mb-12 space-y-4 text-sm">
        <h2 className="text-2xl font-semibold text-[#ff79c6]">🚀 Getting Started</h2>
        <p>
          Our API supports RESTful endpoints for CVE search, filtering, and metadata enrichment. Authentication is optional for public queries.
        </p>

        <h3 className="text-lg font-semibold text-yellow-400">⚠️ API Usage Notice</h3>
        <p>
          The GlobalCVE API is designed for <strong>local deployment only</strong>. Due to strict security settings and rate-limit concerns on the public site (<a href="https://globalcve.xyz" className="underline text-blue-300">globalcve.xyz</a>), direct API access is <strong>not available</strong> from the hosted frontend.
        </p>

        <h3 className="text-lg font-semibold text-green-400">✅ How to Use the API</h3>
        <ul className="list-disc list-inside">
          <li>Clone the repository</li>
          <li>Run the project locally (<code>npm run dev</code>)</li>
          <li>Access the API via <code>http://localhost:3000/api/cves?query=...</code></li>
        </ul>

        <h3 className="text-lg font-semibold text-purple-400">🔐 Why This Matters</h3>
        <p>
          GlobalCVE prioritizes security and performance. Hosting the API publicly would expose it to abuse, scraping, and potential denial-of-service risks. For contributors and developers, local deployment offers:
        </p>
        <ul className="list-disc list-inside">
          <li>Full access to all query parameters</li>
          <li>Reliable testing and debugging</li>
          <li>No external throttling or middleware interference</li>
          <li>Easy to deploy in a Docker container</li>
        </ul>

        <hr className="my-4 border-gray-600" />
        <p>
          📌 This note applies to both the <a href="https://github.com/globalcve/globalcve-site" className="underline text-blue-300">GitHub API documentation</a> and the <a href="https://globalcve.xyz/docs" className="underline text-blue-300">live site docs</a>. Please ensure you run the API locally for full functionality.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#bd93f9] mb-2">🔍 Example Endpoint</h2>
        <pre className="bg-[#44475a] p-4 rounded-md text-sm overflow-x-auto">
          GET /api/cves?query=openssl&amp;severity=high
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
