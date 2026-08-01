import React from 'react';
import { Plus } from 'lucide-react';

export default function CreateNotebookCard({ onNewNote }) {
  return (
    <div
      onClick={onNewNote}
      className="group flex flex-col items-center justify-center min-h-[195px] p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-[var(--text-secondary)] bg-[var(--bg-card)]/40 hover:bg-[var(--bg-card)] transition-all duration-300 cursor-pointer text-center hover:-translate-y-1 hover:shadow-lg active:scale-98"
    >
      <div className="w-11 h-11 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:scale-110 transition-all mb-3 border border-[var(--border-color)]/60">
        <Plus className="w-5 h-5" />
      </div>
      <span className="font-bold text-sm text-[var(--text-primary)] tracking-tight">New Notebook</span>
      <span className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">Create a fresh page...</span>
    </div>
  );
}
