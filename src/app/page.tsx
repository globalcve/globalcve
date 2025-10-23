'use client';

import { useState } from 'react';
import CveCard from './components/CveCard';
import LoadingSpinner from './components/LoadingSpinner';

export default function Home() {
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(0);

  const fetchResults = async (reset = false) => {
    setLoading(true);
    setHasSearched(true);
    const currentPage = reset ? 0 : page;
    const res = await fetch(
      `/api/cves?query=${encodeURIComponent(query)}&severity=${severity}&sort=${sortOrder}&startIndex=${currentPage * 100}`
    );
    const data = await res.json();
    const newResults = data.results || [];
    setResults(reset ? newResults : [...results, ...newResults]);
    setPage(currentPage + 1);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#282a36] text-[#f8f8f2] flex flex-col items-center justify-center p-6 space-y-2">
      <nav className="w-full bg-[#44475a] text-[#f8f8f2] py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#50fa7b]">GlobalCVE</h1>
        <ul className="flex space-x-6 text-sm">
          <li><a href="/" className="hover:underline text-[#8be9fd]">Home</a></li>
          <li><a href="#search" className="hover:underline text-[#ff79c6]">Search</a></li>
          <li><a href="/docs" className="hover:underline text-[#bd93f9]">API Docs</a></li>
          <li><a href="https://github.com/globalcve" className="hover:underline text-[#f1fa8c]">GitHub</a></li>
        </ul>
      </nav>

      <img src="/globalcve-logo.png" alt="GlobalCVE Logo" className="w-64 h-64" />
      <h1 className="text-5xl font-bold text-[#50fa7b]">GlobalCVE</h1>
      <p className="text-lg max-w-xl text-center text-[#8be9fd]">
        A unified, open-source hub for global vulnerability intelligence. Built for clarity, collaboration, and security.
      </p>

      <section className="mt-12 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-[#f8f8f2]">
        {/* Feature cards go here */}
      </section>

      <section className="mt-16 max-w-4xl w-full text-center">
        <h2 className="text-3xl font-bold text-[#ff79c6] mb-6">Built by the community</h2>
        <div className="bg-[#44475a] p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-[#50fa7b] mb-2">JESSE-EG-LY @ GlobalCVE</h3>
          <p>
            Founder and lead architect of GlobalCVE. Building a unified, open-source hub for vulnerability intelligence.
          </p>
        </div>
        <p className="mt-6">
          Want to contribute? <a href="https://github.com/globalcve" className="text-[#ff79c6] underline">Join us on GitHub</a>
        </p>
      </section>

      <section className="mt-16 max-w-4xl w-full text-center" id="search">
        <h2 className="text-3xl font-bold text-[#50fa7b] mb-4">Search CVEs</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by CVE ID, keyword, or vendor..."
            className="w-full md:w-2/3 px-4 py-2 rounded-md bg-[#44475a] text-[#f8f8f2] placeholder-[#6272a4] border border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#50fa7b]"
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="px-4 py-2 rounded-md bg-[#44475a] text-[#f8f8f2] border border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#ff79c6]"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="px-4 py-2 rounded-md bg-[#44475a] text-[#f8f8f2] border border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#8be9fd]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button
            onClick={() => {
              setPage(0);
              fetchResults(true);
            }}
            className="px-4 py-2 bg-[#50fa7b] text-[#282a36] rounded-md font-semibold hover:bg-[#8be9fd]"
          >
            Search
          </button>
        </div>
        <p className="mt-2 text-sm text-[#6272a4]">Powered by GlobalCVE API (NVD live).</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {loading ? (
            <LoadingSpinner />
          ) : results.length > 0 ? (
            <>
              {(results as any[]).map((cve) => (
                <CveCard key={cve.id} {...cve} />
              ))}
              <div className="col-span-2 text-center mt-4">
                <button
                  onClick={() => fetchResults()}
                  className="px-4 py-2 bg-[#ff79c6] text-[#282a36] rounded-md font-semibold hover:bg-[#bd93f9]"
                >
                  Load More
                </button>
              </div>
            </>
          ) : hasSearched ? (
            <p className="text-sm text-[#6272a4] mt-4 col-span-2">
              No CVEs found for that query. Try a different keyword or check back later.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-16 max-w-4xl w-full text-center">
        <h2 className="text-3xl font-bold text-[#8be9fd] mb-6">Recent CVE Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Static CVE cards */}
        </div>
        <p className="mt-6 text-sm">
          Data sourced from Microsoft’s October 2025 Patch Tuesday updates. Full integration coming soon.
        </p>
      </section>

      <footer className="mt-16 w-full border-t border-[#44475a] pt-6 text-center text-sm text-[#6272a4]">
        <p>© 2025 GlobalCVE. All rights reserved.</p>
        <p className="mt-1">
          Built with ❤️ by <span className="text-[#50fa7b] font-semibold">JESSE-EG-LY</span> —
          <a href="https://github.com/globalcve" className="text-[#ff79c6] underline ml-1">GitHub</a>
        </p>
      </footer>
    </main>
  );
}
