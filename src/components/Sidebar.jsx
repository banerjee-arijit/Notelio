import React from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Tag as TagIcon, 
  Sun, 
  Moon, 
  Database, 
  FileText,
  X,
  SlidersHorizontal,
  FolderKanban
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  allTags,
  theme,
  onToggleTheme,
  dbStatus,
  isOpen,
  onCloseMobileSidebar
}) {
  const pinnedNotes = notes.filter(n => n.pinned);
  const unpinnedNotes = notes.filter(n => !n.pinned);

  const renderNoteItem = (note) => {
    const isActive = note.id === activeNoteId;
    const timeAgo = note.updated_at 
      ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true }) 
      : '';
    
    // Extract first line or summary if no title
    const displayTitle = note.title.trim() || 'Untitled Note';
    const previewContent = note.content
      ? note.content.replace(/^[#*\-`>\s]+/gm, '').slice(0, 70)
      : 'Empty note...';

    return (
      <button
        key={note.id}
        onClick={() => {
          onSelectNote(note.id);
          if (onCloseMobileSidebar) onCloseMobileSidebar();
        }}
        className={`w-full text-left p-3.5 rounded-lg transition-all duration-150 group relative flex flex-col gap-1 border border-transparent ${
          isActive 
            ? 'bg-[var(--accent-light)] border-[var(--border-color)] shadow-xs' 
            : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <span className={`font-semibold text-sm truncate ${isActive ? 'text-[var(--text-primary)]' : ''}`}>
            {displayTitle}
          </span>
          {note.pinned && (
            <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
          )}
        </div>

        <p className="text-xs line-clamp-2 text-[var(--text-secondary)] opacity-80 leading-relaxed font-normal">
          {previewContent}
        </p>

        <div className="flex items-center justify-between mt-1 pt-1 text-[10px] text-[var(--text-muted)] border-t border-[var(--border-color)]/30">
          <span>{timeAgo}</span>
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-1 overflow-hidden">
              {note.tags.slice(0, 2).map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[9px]">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Top Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--accent)] flex items-center justify-center text-[var(--bg-primary)]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-[var(--text-primary)] leading-none">
              Minimal <span className="font-light text-[var(--text-secondary)]">| Notes</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNewNote}
            title="Create New Note (Ctrl+N)"
            className="p-1.5 rounded-md bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity flex items-center gap-1 text-xs font-medium px-2.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
          {onCloseMobileSidebar && (
            <button 
              onClick={onCloseMobileSidebar} 
              className="p-1.5 md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search notes... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] pl-8 pr-3 py-2 rounded-md border border-transparent focus:border-[var(--border-color)] focus:outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tag Filters */}
      {allTags && allTags.length > 0 && (
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => onSelectTag('')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
              !selectedTag
                ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(selectedTag === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedTag === tag
                  ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <TagIcon className="w-2.5 h-2.5 opacity-70" />
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-10 px-4">
            <FileText className="w-8 h-8 mx-auto text-[var(--text-muted)] opacity-40 mb-2" />
            <p className="text-xs text-[var(--text-secondary)] font-medium">No notes found</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              {searchQuery ? 'Try another search term' : 'Click "New" to start writing'}
            </p>
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <Pin className="w-3 h-3 text-amber-500" />
                  <span>Pinned</span>
                </div>
                <div className="space-y-1">
                  {pinnedNotes.map(renderNoteItem)}
                </div>
              </div>
            )}

            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <div className="px-2 mb-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    <span>Notes</span>
                  </div>
                )}
                <div className="space-y-1">
                  {unpinnedNotes.map(renderNoteItem)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Status & Theme Bar */}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-sidebar)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg-secondary)] text-[10px] font-mono text-[var(--text-muted)]">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>PostgreSQL</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          title="Toggle Light/Dark Theme"
          className="p-2 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </aside>
  );
}
