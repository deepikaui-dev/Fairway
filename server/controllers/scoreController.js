import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// GET /api/scores — get my latest 5 scores (reverse chronological)
export const getMyScores = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, score_date, stableford, notes, created_at, updated_at
     FROM scores WHERE user_id = $1
     ORDER BY score_date DESC LIMIT 5`,
    [req.user.id]
  );

  res.json({ success: true, data: result.rows });
});

// POST /api/scores — add a score
export const addScore = asyncHandler(async (req, res) => {
  const { scoreDate, stableford, notes } = req.body;
  const userId = req.user.id;

  // Validate
  if (!scoreDate) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }
  const score = parseInt(stableford, 10);
  if (isNaN(score) || score < 1 || score > 45) {
    return res.status(400).json({ success: false, message: 'Stableford score must be between 1 and 45' });
  }

  // Check duplicate date
  const existing = await query(
    'SELECT id FROM scores WHERE user_id = $1 AND score_date = $2',
    [userId, scoreDate]
  );
  if (existing.rows.length > 0) {
    return res.status(409).json({ success: false, message: 'A score already exists for this date' });
  }

  // Insert
  const result = await query(
    `INSERT INTO scores (user_id, score_date, stableford, notes)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, scoreDate, score, notes || null]
  );

  // Enforce 5-score limit: delete oldest beyond 5
  await query(
    `DELETE FROM scores WHERE id IN (
       SELECT id FROM scores WHERE user_id = $1
       ORDER BY score_date DESC
       OFFSET 5
     )`,
    [userId]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// PUT /api/scores/:id — edit a score
export const updateScore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { scoreDate, stableford, notes } = req.body;
  const userId = req.user.id;

  // Verify ownership
  const existing = await query('SELECT * FROM scores WHERE id = $1 AND user_id = $2', [id, userId]);
  if (existing.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Score not found' });
  }

  const score = parseInt(stableford, 10);
  if (isNaN(score) || score < 1 || score > 45) {
    return res.status(400).json({ success: false, message: 'Stableford score must be between 1 and 45' });
  }

  // Check duplicate date (excluding current record)
  if (scoreDate) {
    const dup = await query(
      'SELECT id FROM scores WHERE user_id = $1 AND score_date = $2 AND id != $3',
      [userId, scoreDate, id]
    );
    if (dup.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'A score already exists for this date' });
    }
  }

  const result = await query(
    `UPDATE scores SET score_date = COALESCE($1, score_date),
                       stableford = $2,
                       notes = $3
     WHERE id = $4 AND user_id = $5 RETURNING *`,
    [scoreDate, score, notes || null, id, userId]
  );

  res.json({ success: true, data: result.rows[0] });
});

// DELETE /api/scores/:id
export const deleteScore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query('DELETE FROM scores WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.user.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Score not found' });
  }

  res.json({ success: true, message: 'Score deleted' });
});
