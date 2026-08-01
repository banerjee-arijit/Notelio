import React, { useState, useEffect } from 'react';
import { Edit2, X, Check } from 'lucide-react';

export default function RenameModal({ isOpen, onClose, onSave, initialTitle }) {
  const [title, setTitle] = useState(initialTitle || '');

  useEffect(() => {
    setTitle(initialTitle || '');
  }, [initialTitle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)]/80 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] flex items-center justify-center border border-[var(--border-color)]/60">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Rename Notebook</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Enter a new title for this notebook.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Notebook title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] focus:border-[var(--text-primary)] focus:outline-none transition-all font-medium"
            autoFocus
          />

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 active:scale-95 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
