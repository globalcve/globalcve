'use client';

import { useEffect } from 'react';

export default function LoadingSpinner() {
  useEffect(() => {
    console.log('🌀 LoadingSpinner rendered');
  }, []);

  return (
    <div className="flex items-center justify-center py-6">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-[#50fa7b]"></div>
      <span className="ml-4 text-[#8be9fd] text-sm">Searching CVEs…</span>
    </div>
  );
}
