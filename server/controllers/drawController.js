import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { simulateDraw } from '../services/drawService.js';

// GET /api/draws — list all published draws
export const listDraws = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, draw_month, draw_year, draw_date, status,
            total_prize_pool_cents, winning_numbers, eligible_entries,
            match5_pool_cents, match4_pool_cents, match3_pool_cents,
            published_at, created_at
     FROM draws WHERE status = 'published'
     ORDER BY draw_date DESC LIMIT 12`
  );
  res.json({ success: true, data: result.rows });
});

// GET /api/draws/upcoming — next upcoming draw
export const getUpcomingDraw = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT * FROM draws WHERE draw_date >= CURRENT_DATE AND status != 'published'
     ORDER BY draw_date ASC LIMIT 1`
  );

  if (result.rows.length === 0) {
    return res.json({ success: true, data: null });
  }

  res.json({ success: true, data: result.rows[0] });
});

// GET /api/draws/:id — draw detail with entries and winners
export const getDrawDetail = asyncHandler(async (req, res) => {
  const drawRes = await query('SELECT * FROM draws WHERE id = $1', [req.params.id]);
  if (drawRes.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Draw not found' });
  }

  const draw = drawRes.rows[0];

  // Get winners for this draw
  const winnersRes = await query(
    `SELECT w.*, u.email, u.full_name
     FROM winners w JOIN users u ON u.id = w.user_id
     WHERE w.draw_id = $1 ORDER BY w.match_tier DESC`,
    [req.params.id]
  );

  res.json({
    success: true,
    data: {
      ...draw,
      winners: winnersRes.rows,
    },
  });
});

// GET /api/draws/my-entries — my draw entries
export const getMyEntries = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT de.*, d.draw_month, d.draw_year, d.draw_date, d.status as draw_status,
            d.winning_numbers, d.total_prize_pool_cents
     FROM draw_entries de
     JOIN draws d ON d.id = de.draw_id
     WHERE de.user_id = $1
     ORDER BY d.draw_date DESC`,
    [req.user.id]
  );

  res.json({ success: true, data: result.rows });
});
