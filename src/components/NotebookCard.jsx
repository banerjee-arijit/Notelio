import React from 'react';
import { Pin, ArrowUpRight, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPopup,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

export default function NotebookCard({ note, onClick, onTogglePin, onRename, onDelete }) {
  const timeAgo = note.updated_at
    ? formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })
    : '';

  const displayTitle = note.title.trim() || 'Untitled Notebook';
  const previewContent = note.content
    ? note.content.replace(/<[^>]+>/g, '').replace(/^[#*\-`>\s]+/gm, '').slice(0, 120)
    : 'Empty notebook...';

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onClick={onClick}
          style={{ boxShadow: 'var(--shadow-card)' }}
          className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer min-h-[195px] bg-[var(--bg-card)] hover:-translate-y-1 hover:shadow-xl ${
            note.pinned
              ? 'border-amber-500/50'
              : 'border-[var(--border-color)]/70 hover:border-[var(--text-muted)]/40'
          }`}
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h3 className="font-bold text-base text-[var(--text-primary)] line-clamp-2 leading-snug flex-1 group-hover:text-[var(--text-primary)] tracking-tight">
                {displayTitle}
              </h3>

              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={onTogglePin}
                  title={note.pinned ? 'Unpin notebook' : 'Pin notebook'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    note.pinned
                      ? 'text-amber-500 bg-amber-500/10'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-500' : ''}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed font-normal opacity-85">
              {previewContent}
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)]/30 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
            <span>{timeAgo}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-primary)]" />
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuPopup className="w-48">
        <ContextMenuItem onClick={() => onRename(note.id)}>
          <Edit2 className="w-3.5 h-3.5 me-2" />
          <span>Rename</span>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => onTogglePin(note.id)}>
          <Pin className={`w-3.5 h-3.5 me-2 ${note.pinned ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{note.pinned ? 'Unpin Notebook' : 'Pin Notebook'}</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive" onClick={() => onDelete(note.id)}>
          <Trash2 className="w-3.5 h-3.5 me-2 text-red-500" />
          <span className="text-red-500">Delete</span>
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  );
}
