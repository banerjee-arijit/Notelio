import React from "react";
import { Plus, Sun, Moon } from "lucide-react";
import NotebookCard from "./NotebookCard";

export default function NotebookGrid({
  notes,
  onSelectNote,
  onNewNote,
  theme,
  onToggleTheme,
  onTogglePin,
  onRenameNote,
  onDeleteNote,
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      {/* Top Header: Notelio Text Title & Theme Toggle (NO ICON LOGO) */}
      <header className="px-8 sm:px-16 md:px-24 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Notelio Title */}
        <span className="text-2xl tracking-tight text-[var(--text-primary)]">
          Notelio
        </span>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="p-2.5 rounded-2xl bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-color)]/70 shadow-xs hover:scale-105 active:scale-95 duration-150"
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-amber-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-700" />
          )}
        </button>
      </header>

      {/* Main Cards Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 sm:px-16 md:px-24 pb-16 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Always present: Create Notebook Card */}
          <div
            onClick={onNewNote}
            className="group flex flex-col items-center justify-center min-h-[195px] p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] hover:border-[var(--text-secondary)] bg-[var(--bg-card)]/40 hover:bg-[var(--bg-card)] transition-all duration-300 cursor-pointer text-center hover:-translate-y-1 hover:shadow-lg active:scale-98"
          >
            <div className="w-11 h-11 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:scale-110 transition-all mb-3 border border-[var(--border-color)]/60">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-[var(--text-primary)] tracking-tight">
              New Notebook
            </span>
            <span className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
              Create a fresh page...
            </span>
          </div>

          {/* Notebook Cards */}
          {notes.map((note) => (
            <NotebookCard
              key={note.id}
              note={note}
              onClick={() => onSelectNote(note.id)}
              onTogglePin={() => onTogglePin(note.id)}
              onRename={(id) => onRenameNote(id)}
              onDelete={(id) => onDeleteNote(id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
