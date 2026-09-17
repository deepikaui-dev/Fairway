import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { simulateDraw } from '../services/drawService.js';

// GET /api/admin/stats — admin dashboard stats
export const getAdminStats = asyncHandler(async (req, res) => {
  const usersRes = await query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user']);
  const subsRes = await query('SELECT COUNT(*) as count FROM subscriptions WHERE status = $1', ['active']);
  const poolsRes = await query(`SELECT COALESCE(SUM(total_prize_pool_cents), 0) as total FROM draws WHERE status = 'published'`);
  const charitiesRes = await query('SELECT COUNT(*) as count FROM charities WHERE active = true');

  res.json({
    success: true,
    data: {
      totalUsers: parseInt(usersRes.rows[0].count, 10),
      activeSubscribers: parseInt(subsRes.rows[0].count, 10),
      totalPrizePoolCents: parseInt(poolsRes.rows[0].total, 10),
      activeCharities: parseInt(charitiesRes.rows[0].count, 10),
    },
  });
});

// GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at,
            s.status as subscription_status, s.plan
     FROM users u
     LEFT JOIN subscriptions s ON s.user_id = u.id
     ORDER BY u.created_at DESC`
  );
  res.json({ success: true, data: result.rows });
});

// POST /api/admin/charities
export const createCharity = asyncHandler(async (req, res) => {
  const { name, description, image_url, category, website_url } = req.body;
  
  if (!name) return res.status(400).json({ success: false, message: 'Charity name is required' });

  const result = await query(
    `INSERT INTO charities (name, description, image_url, category, website_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, description, image_url, category, website_url]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

// PUT /api/admin/charities/:id
export const updateCharity = asyncHandler(async (req, res) => {
  const { name, description, image_url, category, website_url, active } = req.body;
  const { id } = req.params;

  const result = await query(
    `UPDATE charities SET 
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      image_url = COALESCE($3, image_url),
      category = COALESCE($4, category),
      website_url = COALESCE($5, website_url),
      active = COALESCE($6, active)
     WHERE id = $7 RETURNING *`,
    [name, description, image_url, category, website_url, active, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Charity not found' });
  }

  res.json({ success: true, data: result.rows[0] });
});


// POST /api/admin/draws/create
export const createDraw = asyncHandler(async (req, res) => {
  const { month, year, date } = req.body;

  if (!month || !year || !date) {
    return res.status(400).json({ success: false, message: 'Month, year, and date are required' });
  }

  const existing = await query('SELECT id FROM draws WHERE draw_month = $1 AND draw_year = $2', [month, year]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ success: false, message: 'A draw for this month/year already exists' });
  }

  const result = await query(
    `INSERT INTO draws (draw_month, draw_year, draw_date, created_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [month, year, date, req.user.id]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// POST /api/admin/draws/:id/simulate
export const runDrawSimulation = asyncHandler(async (req, res) => {
  const drawId = req.params.id;

  const drawRes = await query('SELECT status FROM draws WHERE id = $1', [drawId]);
  if (drawRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Draw not found' });
  if (drawRes.rows[0].status === 'published') {
    return res.status(400).json({ success: false, message: 'Cannot simulate a published draw' });
  }

  try {
    const simulationResult = await simulateDraw(drawId);
    res.json({ success: true, message: 'Simulation complete', data: simulationResult });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/admin/draws/:id/publish
export const publishDraw = asyncHandler(async (req, res) => {
  const drawId = req.params.id;

  const drawRes = await query('SELECT status FROM draws WHERE id = $1', [drawId]);
  if (drawRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Draw not found' });
  if (drawRes.rows[0].status !== 'simulated') {
    return res.status(400).json({ success: false, message: 'Draw must be simulated before publishing' });
  }

  const result = await query(
    `UPDATE draws SET status = 'published', published_at = NOW() WHERE id = $1 RETURNING *`,
    [drawId]
  );

  res.json({ success: true, message: 'Draw published', data: result.rows[0] });
});

// GET /api/admin/winners
export const getWinners = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT w.*, u.email, u.full_name, d.draw_month, d.draw_year,
            wp.file_url, wp.uploaded_at
     FROM winners w
     JOIN users u ON u.id = w.user_id
     JOIN draws d ON d.id = w.draw_id
     LEFT JOIN winner_proofs wp ON wp.winner_id = w.id
     ORDER BY w.created_at DESC`
  );
  res.json({ success: true, data: result.rows });
});

// PUT /api/admin/winners/:id
export const updateWinnerStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const { id } = req.params;

  if (!['pending', 'verified', 'rejected', 'paid'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const result = await query(
    `UPDATE winners SET 
      status = $1,
      admin_notes = COALESCE($2, admin_notes),
      verified_by = CASE WHEN $1 IN ('verified', 'rejected', 'paid') THEN $3 ELSE verified_by END,
      verified_at = CASE WHEN $1 IN ('verified', 'rejected') AND verified_at IS NULL THEN NOW() ELSE verified_at END,
      paid_at = CASE WHEN $1 = 'paid' AND paid_at IS NULL THEN NOW() ELSE paid_at END
     WHERE id = $4 RETURNING *`,
    [status, adminNotes, req.user.id, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Winner not found' });
  }

  res.json({ success: true, data: result.rows[0] });
});
