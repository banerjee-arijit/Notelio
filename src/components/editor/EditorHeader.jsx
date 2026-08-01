import React from 'react';
import { ArrowLeft, Search, Sun, Moon } from 'lucide-react';

export default function EditorHeader({
  onBackToGrid,
  showSearch,
  onToggleSearch,
  theme,
  onToggleTheme
}) {
  return (
    <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-6 flex items-center justify-between max-w-4xl mx-auto w-full">
      <button
        onClick={onBackToGrid}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:scale-95 duration-150"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Notebooks</span>
      </button>

      <div className="flex items-center gap-2">
        {/* In-Note Search Button */}
        <button
          onClick={onToggleSearch}
          title="Search inside notebook (Ctrl+F)"
          className={`p-1.5 rounded-md transition-colors active:scale-95 duration-150 flex items-center gap-1 text-xs ${
            showSearch
              ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors active:scale-95 duration-150"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </div>
  );
}
