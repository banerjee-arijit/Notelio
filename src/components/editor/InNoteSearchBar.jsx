import React from 'react';
import { Search, X } from 'lucide-react';

export default function InNoteSearchBar({
  query,
  matchCount,
  onChangeQuery,
  onClose
}) {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 sm:px-12 md:px-20 lg:px-32 mb-4 animate-in fade-in duration-150">
      <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-2xl shadow-lg">
        <Search className="w-4 h-4 text-[var(--text-muted)] ms-2 shrink-0" />
        <input
          type="text"
          autoFocus
          placeholder="Find text inside this note..."
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
        />
        {query && (
          <span className="text-[11px] font-medium text-[var(--text-muted)] me-2">
            {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          </span>
        )}
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
