import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#50fa7b]"></div>
      <span className="ml-4 text-[#8be9fd] text-sm">Searching CVEs…</span>
    </div>
  );
}
