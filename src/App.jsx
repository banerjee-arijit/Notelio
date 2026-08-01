import React, { useState, useEffect, useRef, useMemo } from 'react';
import NotebookGrid from './components/NotebookGrid';
import Editor from './components/Editor';
import DeleteModal from './components/DeleteModal';
import RenameModal from './components/RenameModal';
import { 
  fetchNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  checkDBHealth 
} from './lib/api';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'editor'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Modals & Animation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [noteToRenameId, setNoteToRenameId] = useState(null);

  const saveTimeoutRef = useRef(null);

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load initial notes & health check
  useEffect(() => {
    async function loadData() {
      try {
        await checkDBHealth();
        const fetched = await fetchNotes();
        setNotes(fetched);
      } catch (err) {
        console.error('Failed to initialize app from Postgres backend:', err);
      }
    }
    loadData();
  }, []);

  // Current active note object
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Handle selecting a note card
  const handleSelectNote = (id) => {
    setActiveNoteId(id);
    setViewMode('editor');
  };

  // Handle creating new notebook
  const handleNewNote = async () => {
    const newNoteData = {
      title: '',
      content: '',
      pinned: false,
      tags: [],
    };
    try {
      const created = await createNote(newNoteData);
      setNotes((prev) => [created, ...prev]);
      setActiveNoteId(created.id);
      setViewMode('editor');
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  // Trigger debounced auto-save to Postgres
  const triggerAutoSave = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateNote(updatedNote.id, {
          title: updatedNote.title,
          content: updatedNote.content,
          pinned: updatedNote.pinned,
          tags: updatedNote.tags,
        });
      } catch (err) {
        console.error('Auto-save error:', err);
      }
    }, 600);
  };

  // Change Title
  const handleTitleChange = (newTitle) => {
    if (!activeNote) return;
    const updated = { ...activeNote, title: newTitle, updated_at: new Date().toISOString() };
    triggerAutoSave(updated);
  };

  // Rename Note from Modal
  const handleRenameNoteSubmit = (newTitle) => {
    if (!noteToRenameId) return;
    const targetNote = notes.find((n) => n.id === noteToRenameId);
    if (!targetNote) return;
    const updated = { ...targetNote, title: newTitle, updated_at: new Date().toISOString() };
    triggerAutoSave(updated);
    setShowRenameModal(false);
    setNoteToRenameId(null);
  };

  // Change Content
  const handleContentChange = (newContent) => {
    if (!activeNote) return;
    const updated = { ...activeNote, content: newContent, updated_at: new Date().toISOString() };
    triggerAutoSave(updated);
  };

  // Toggle Pin
  const handleTogglePin = async (targetId) => {
    const idToPin = targetId || activeNoteId;
    const targetNote = notes.find((n) => n.id === idToPin);
    if (!targetNote) return;

    const updated = { ...targetNote, pinned: !targetNote.pinned, updated_at: new Date().toISOString() };
    triggerAutoSave(updated);
  };

  // Prompt Rename
  const promptRenameNote = (id) => {
    setNoteToRenameId(id);
    setShowRenameModal(true);
  };

  // Prompt Delete
  const promptDeleteNote = (id) => {
    setNoteToDeleteId(id || activeNoteId);
    setShowDeleteModal(true);
  };

  // Delete Note Action with smooth exit animation
  const handleConfirmDelete = async () => {
    if (!noteToDeleteId) return;
    const targetId = noteToDeleteId;
    setShowDeleteModal(false);
    setNoteToDeleteId(null);

    // Trigger shrink animation
    setDeletingNoteId(targetId);

    setTimeout(async () => {
      try {
        await deleteNote(targetId);
        const remaining = notes.filter((n) => n.id !== targetId);
        setNotes(remaining);
        if (activeNoteId === targetId) {
          setActiveNoteId(null);
          setViewMode('grid');
        }
      } catch (err) {
        console.error('Failed to delete note:', err);
      } finally {
        setDeletingNoteId(null);
      }
    }, 300);
  };

  // Keyboard Shortcuts (Esc to grid)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && viewMode === 'editor') {
        e.preventDefault();
        setViewMode('grid');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const targetDeleteNoteObj = notes.find((n) => n.id === noteToDeleteId);
  const targetRenameNoteObj = notes.find((n) => n.id === noteToRenameId);

  return (
    <div className="min-h-screen w-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased overflow-x-hidden">
      {viewMode === 'grid' || !activeNote ? (
        <NotebookGrid
          notes={notes}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onTogglePin={handleTogglePin}
          onRenameNote={promptRenameNote}
          onDeleteNote={promptDeleteNote}
          deletingNoteId={deletingNoteId}
        />
      ) : (
        <Editor
          title={activeNote.title}
          content={activeNote.content}
          onChangeTitle={handleTitleChange}
          onChangeContent={handleContentChange}
          onBackToGrid={() => setViewMode('grid')}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      )}

      {/* Rename Modal */}
      <RenameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onSave={handleRenameNoteSubmit}
        initialTitle={targetRenameNoteObj?.title}
      />

      {/* Delete Confirmation AlertDialog */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        noteTitle={targetDeleteNoteObj?.title}
      />
    </div>
  );
}
