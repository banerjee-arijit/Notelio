const API_BASE = '/api';

export async function fetchNotes(search = '', tag = '') {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (tag) query.append('tag', tag);
    const res = await fetch(`${API_BASE}/notes?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return await res.json();
  } catch (err) {
    console.error('API fetchNotes error:', err);
    throw err;
  }
}

export async function fetchNoteById(id) {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch note');
    return await res.json();
  } catch (err) {
    console.error('API fetchNoteById error:', err);
    throw err;
  }
}

export async function createNote(noteData = {}) {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return await res.json();
  } catch (err) {
    console.error('API createNote error:', err);
    throw err;
  }
}

export async function updateNote(id, noteData) {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return await res.json();
  } catch (err) {
    console.error('API updateNote error:', err);
    throw err;
  }
}

export async function deleteNote(id) {
  try {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete note');
    return await res.json();
  } catch (err) {
    console.error('API deleteNote error:', err);
    throw err;
  }
}

export async function checkDBHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'error' };
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
}
