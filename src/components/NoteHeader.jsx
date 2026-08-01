import React, { useState } from 'react';
import { 
  Pin, 
  Trash2, 
  Eye, 
  Edit3, 
  Maximize2, 
  Minimize2, 
  Check, 
  Copy, 
  Plus, 
  X,
  Download,
  ArrowLeft
} from 'lucide-react';

export default function NoteHeader({
  note,
  isSaving,
  isFocusMode,
  onToggleFocusMode,
  isPreviewMode,
  onTogglePreviewMode,
  onTogglePin,
  onDeleteNote,
  onAddTag,
  onRemoveTag,
  onBackToGrid
}) {
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagPopover, setShowTagPopover] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const handleAddTagSubmit = (e) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim().replace(/^#/, '');
    if (cleanTag && (!note.tags || !note.tags.includes(cleanTag))) {
      onAddTag(cleanTag);
      setNewTagInput('');
    }
  };

  const handleCopyMarkdown = () => {
    if (note.content) {
      navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    const filename = `${(note.title || 'note').toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    const blob = new Blob([note.content || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 px-4 md:px-8 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)] sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
      {/* Left section: Back to Notebooks & Auto-save status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToGrid}
          title="Back to Notebooks (Esc)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-xs font-medium text-[var(--text-primary)] transition-colors border border-[var(--border-color)] shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Notebooks</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Pin Toggle */}
          <button
            onClick={onTogglePin}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
            className={`p-1.5 rounded-md transition-colors ${
              note.pinned 
                ? 'bg-amber-500/10 text-amber-500' 
                : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Pin className={`w-4 h-4 ${note.pinned ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Auto-save Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="hidden sm:inline font-mono text-[11px]">
              {isSaving ? 'Saving to Postgres...' : 'Saved to Postgres'}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Tags & Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Tags */}
        <div className="relative">
          <div className="hidden lg:flex items-center gap-1.5">
            {note.tags && note.tags.map((t) => (
              <span 
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]/60"
              >
                #{t}
                <button
                  onClick={() => onRemoveTag(t)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            <button
              onClick={() => setShowTagPopover(!showTagPopover)}
              className="p-1 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              title="Add Tag"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tag Popover */}
          {showTagPopover && (
            <div className="absolute right-0 top-8 z-50 w-48 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-lg">
              <form onSubmit={handleAddTagSubmit} className="flex gap-1">
                <input
                  type="text"
                  placeholder="New tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)] px-2 py-1 rounded border border-transparent focus:border-[var(--border-color)] focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="p-1 rounded bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-medium">
                  Add
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Preview / Edit Mode Toggle */}
        <button
          onClick={onTogglePreviewMode}
          title={isPreviewMode ? 'Switch to Edit Mode' : 'Switch to Preview Mode'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors border border-[var(--border-color)]"
        >
          {isPreviewMode ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </>
          )}
        </button>

        {/* Copy Markdown */}
        <button
          onClick={handleCopyMarkdown}
          title="Copy note content"
          className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Download Markdown */}
        <button
          onClick={handleExportMarkdown}
          title="Export as Markdown (.md)"
          className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? 'Exit Focus Mode' : 'Distraction-Free Focus Mode'}
          className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Delete Note */}
        <button
          onClick={onDeleteNote}
          title="Delete note"
          className="p-1.5 rounded-md hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
