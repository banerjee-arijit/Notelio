import React, { useState } from 'react';
import GridHeader from './grid/GridHeader';
import CreateNotebookCard from './grid/CreateNotebookCard';
import NotebookCard from './NotebookCard';

export default function NotebookGrid({
  notes,
  onSelectNote,
  onNewNote,
  theme,
  onToggleTheme,
  onTogglePin,
  onRenameNote,
  onDeleteNote
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (note.title || '').toLowerCase().includes(q);
    const contentMatch = (note.content || '').toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      {/* Grid Header */}
      <GridHeader
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Cards Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 sm:px-16 md:px-24 pb-16 pt-2">
        {filteredNotes.length === 0 && searchQuery ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p className="text-sm font-semibold">No notebooks match "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-bold text-[var(--text-primary)] hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CreateNotebookCard onNewNote={onNewNote} />

            {filteredNotes.map((note) => (
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
        )}
      </main>
    </div>
  );
}
