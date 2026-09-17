import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// GET /api/charities — list active charities (public)
export const listCharities = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  let sql = 'SELECT * FROM charities WHERE active = true';
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }
  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }

  sql += ' ORDER BY name ASC';
  const result = await query(sql, params);
  res.json({ success: true, data: result.rows });
});

// GET /api/charities/:id — single charity detail (public)
export const getCharity = asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM charities WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Charity not found' });
  }
  res.json({ success: true, data: result.rows[0] });
});
