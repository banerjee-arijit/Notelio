import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Pin } from 'lucide-react';

export default function ContextMenu({ x, y, note, onClose, onRename, onTogglePin, onDelete }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!note) return null;

  // Adjust positioning to stay within viewport
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const menuW = 170;
  const menuH = 130;

  const posX = x + menuW > screenW ? screenW - menuW - 10 : x;
  const posY = y + menuH > screenH ? screenH - menuH - 10 : y;

  return (
    <div
      ref={menuRef}
      style={{ left: `${posX}px`, top: `${posY}px` }}
      className="fixed z-50 w-44 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={() => {
          onRename(note.id);
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Edit2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Rename</span>
      </button>

      <button
        onClick={() => {
          onTogglePin(note.id);
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-amber-500 text-amber-500' : 'text-[var(--text-secondary)]'}`} />
        <span>{note.pinned ? 'Unpin Notebook' : 'Pin Notebook'}</span>
      </button>

      <div className="my-1 border-t border-[var(--border-color)]/50" />

      <button
        onClick={() => {
          onDelete(note.id);
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </div>
  );
}
