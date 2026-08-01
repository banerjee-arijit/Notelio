const API_BASE = import.meta.env.VITE_API_URL || '/api';
const LOCAL_STORAGE_KEY = 'notelio_notes';

// Helper: Get local storage notes
function getLocalNotes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initialSeed = [
        {
          id: 'welcome-note-1',
          title: 'Welcome to Notelio',
          content: `Welcome to <b>Notelio</b>! A minimalist, distraction-free notebook app.<br><br>Features:<br><ul><li>Card Grid home view</li><li>Direct visual rich formatting</li><li>Notion-style automatic selection toolbar</li><li>Auto-save persistence</li></ul>`,
          pinned: true,
          tags: ['guide', 'welcome'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Helper: Save local storage notes
function saveLocalNotes(notes) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
}

export async function fetchNotes(search = '', tag = '') {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (tag) query.append('tag', tag);
    const res = await fetch(`${API_BASE}/notes?${query.toString()}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using LocalStorage fallback:', err.message);
    let notes = getLocalNotes();
    if (search) {
      const q = search.toLowerCase();
      notes = notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    if (tag) {
      notes = notes.filter(n => n.tags && n.tags.includes(tag));
    }
    return notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.updated_at) - new Date(a.updated_at));
  }
}

export async function fetchNoteById(id) {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using LocalStorage fallback for fetchNoteById');
    const notes = getLocalNotes();
    const note = notes.find(n => n.id === id);
    if (!note) throw new Error('Note not found');
    return note;
  }
}

export async function createNote(noteData = {}) {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using LocalStorage fallback for createNote');
    const notes = getLocalNotes();
    const newNote = {
      id: noteData.id || 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: noteData.title || '',
      content: noteData.content || '',
      pinned: noteData.pinned || false,
      tags: noteData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveLocalNotes(notes);
    return newNote;
  }
}

export async function updateNote(id, noteData) {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using LocalStorage fallback for updateNote');
    let notes = getLocalNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...noteData,
        updated_at: new Date().toISOString(),
      };
      saveLocalNotes(notes);
      return notes[index];
    }
    throw new Error('Note not found locally');
  }
}

export async function deleteNote(id) {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using LocalStorage fallback for deleteNote');
    let notes = getLocalNotes();
    notes = notes.filter(n => n.id !== id);
    saveLocalNotes(notes);
    return { success: true, id };
  }
}

export async function checkDBHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'offline', local: true };
    return await res.json();
  } catch {
    return { status: 'offline', local: true };
  }
}
