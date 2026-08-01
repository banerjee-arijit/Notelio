import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let dbClient = null;
let dbType = 'pglite';

async function initDB() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    try {
      const pool = new pg.Pool({ connectionString });
      await pool.query('SELECT 1');
      console.log('Connected to external PostgreSQL database via DATABASE_URL');
      dbClient = {
        query: (text, params) => pool.query(text, params),
      };
      dbType = 'postgres';
    } catch (err) {
      console.warn('External PostgreSQL connection failed, falling back to PGlite embedded Postgres:', err.message);
    }
  }

  if (!dbClient) {
    try {
      const pglite = new PGlite('./.pgdata');
      await pglite.waitReady;
      console.log('Embedded PostgreSQL (PGlite) initialized successfully!');
      dbClient = {
        query: async (text, params) => {
          const res = await pglite.query(text, params);
          return { rows: res.rows };
        }
      };
      dbType = 'pglite';
    } catch (err) {
      console.error('Failed to initialize PGlite:', err);
      process.exit(1);
    }
  }

  // Create Notes Table
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(64) PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      pinned BOOLEAN DEFAULT FALSE,
      tags TEXT DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if empty, seed default initial notes
  const existing = await dbClient.query(`SELECT COUNT(*) as count FROM notes`);
  if (parseInt(existing.rows[0].count, 10) === 0) {
    const welcomeNote = {
      id: 'welcome-note-1',
      title: 'Welcome to Notelio',
      content: `Welcome to <b>Notelio</b>! A minimalist, distraction-free notebook app.<br><br>Features:<br><ul><li>Card Grid home view</li><li>Direct visual rich formatting</li><li>Notion-style automatic selection toolbar</li><li>PostgreSQL storage</li></ul>`,
      pinned: true,
      tags: JSON.stringify(['guide', 'welcome']),
    };

    await dbClient.query(
      `INSERT INTO notes (id, title, content, pinned, tags, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [welcomeNote.id, welcomeNote.title, welcomeNote.content, welcomeNote.pinned, welcomeNote.tags]
    );
  }
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbType, database: 'PostgreSQL', app: 'Notelio' });
});

// GET all notes
app.get('/api/notes', async (req, res) => {
  try {
    const { search, tag } = req.query;
    let queryText = `SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC`;
    let params = [];

    if (search) {
      queryText = `SELECT * FROM notes WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY pinned DESC, updated_at DESC`;
      params = [`%${search}%`];
    }

    const result = await dbClient.query(queryText, params);
    let notes = result.rows.map(row => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || [])
    }));

    if (tag) {
      notes = notes.filter(n => n.tags.includes(tag));
    }

    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes from PostgreSQL' });
  }
});

// GET single note
app.get('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbClient.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const row = result.rows[0];
    const note = {
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || [])
    };
    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST create new note
app.post('/api/notes', async (req, res) => {
  try {
    const { id, title = '', content = '', pinned = false, tags = [] } = req.body;
    const noteId = id || 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const tagsStr = JSON.stringify(tags);

    await dbClient.query(
      `INSERT INTO notes (id, title, content, pinned, tags, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [noteId, title, content, pinned, tagsStr]
    );

    const created = await dbClient.query(`SELECT * FROM notes WHERE id = $1`, [noteId]);
    const row = created.rows[0];
    res.status(201).json({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || [])
    });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Failed to create note in PostgreSQL' });
  }
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, pinned, tags } = req.body;

    const existing = await dbClient.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const current = existing.rows[0];
    const newTitle = title !== undefined ? title : current.title;
    const newContent = content !== undefined ? content : current.content;
    const newPinned = pinned !== undefined ? pinned : current.pinned;
    const newTagsStr = tags !== undefined ? JSON.stringify(tags) : (typeof current.tags === 'string' ? current.tags : JSON.stringify(current.tags || []));

    await dbClient.query(
      `UPDATE notes SET title = $1, content = $2, pinned = $3, tags = $4, updated_at = NOW() WHERE id = $5`,
      [newTitle, newContent, newPinned, newTagsStr, id]
    );

    const updated = await dbClient.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    const row = updated.rows[0];
    res.json({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || [])
    });
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Failed to update note in PostgreSQL' });
  }
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbClient.query(`DELETE FROM notes WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Failed to delete note from PostgreSQL' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT} [Notelio PostgreSQL Engine]`);
  });
}).catch(err => {
  console.error('Database initialization error:', err);
});
