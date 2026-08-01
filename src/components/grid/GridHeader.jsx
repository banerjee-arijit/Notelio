import React from 'react';
import { Search, X, Sun, Moon } from 'lucide-react';

export default function GridHeader({
  searchQuery,
  onChangeSearch,
  theme,
  onToggleTheme
}) {
  return (
    <header className="px-8 sm:px-16 md:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
      <span className="font-extrabold text-2xl tracking-tight text-[var(--text-primary)]">
        Notelio
      </span>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search notebooks..."
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)]/70 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] pl-9 pr-8 py-2.5 rounded-2xl outline-none focus:border-[var(--text-muted)] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="p-2.5 rounded-2xl bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-color)]/70 shadow-xs hover:scale-105 active:scale-95 duration-150 shrink-0"
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
}
