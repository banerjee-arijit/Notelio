import React from 'react';
import {
  AlertDialog,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, noteTitle }) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-base font-bold text-[var(--text-primary)]">
                Delete Notebook
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-[var(--text-secondary)] mt-0.5">
                This action will permanently delete this note from PostgreSQL.
              </AlertDialogDescription>
            </div>
          </div>

          {noteTitle && (
            <div className="mt-2 p-3 bg-[var(--bg-secondary)] rounded-xl text-xs font-semibold text-[var(--text-primary)] truncate border border-[var(--border-color)]/50">
              "{noteTitle}"
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter variant="bare" className="pt-2">
          <AlertDialogClose asChild>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Cancel
            </button>
          </AlertDialogClose>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Notebook
          </button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
