import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// POST /api/contact — Public route to submit a new contact message
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const result = await query(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
    [name, email, subject, message]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// GET /api/admin/contact-messages — Admin route to get all messages with their notes
export const getContactMessages = asyncHandler(async (req, res) => {
  // We'll fetch all messages, and their notes grouped as JSON arrays
  const result = await query(`
    SELECT 
      m.id, m.name, m.email, m.subject, m.message, m.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', n.id,
            'note_text', n.note_text,
            'created_at', n.created_at
          ) ORDER BY n.created_at DESC
        ) FILTER (WHERE n.id IS NOT NULL),
        '[]'
      ) as notes
    FROM contact_messages m
    LEFT JOIN contact_notes n ON m.id = n.contact_message_id
    GROUP BY m.id
    ORDER BY m.created_at DESC
  `);

  res.json({ success: true, data: result.rows });
});

// DELETE /api/admin/contact-messages/:id — Admin route to delete a message
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  res.json({ success: true, message: 'Message deleted successfully' });
});

// POST /api/admin/contact-messages/:id/notes — Admin route to add a note to a message
export const addContactNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { note_text } = req.body;

  if (!note_text) {
    return res.status(400).json({ success: false, message: 'Note text is required' });
  }

  const msgCheck = await query('SELECT id FROM contact_messages WHERE id = $1', [id]);
  if (msgCheck.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  const result = await query(
    'INSERT INTO contact_notes (contact_message_id, note_text) VALUES ($1, $2) RETURNING *',
    [id, note_text]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});
