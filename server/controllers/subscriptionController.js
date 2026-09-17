import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// GET /api/subscriptions/me — my subscription
export const getMySubscription = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT s.*, c.name as charity_name, c.image_url as charity_image, c.category as charity_category
     FROM subscriptions s
     LEFT JOIN charities c ON c.id = s.selected_charity_id
     WHERE s.user_id = $1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.json({ success: true, data: null });
  }

  const row = result.rows[0];
  res.json({
    success: true,
    data: {
      id: row.id,
      plan: row.plan,
      status: row.status,
      charityPercentage: row.charity_percentage,
      renewalDate: row.renewal_date,
      monthlyAmountCents: row.monthly_amount_cents,
      charity: row.selected_charity_id ? {
        id: row.selected_charity_id,
        name: row.charity_name,
        imageUrl: row.charity_image,
        category: row.charity_category,
      } : null,
      createdAt: row.created_at,
    },
  });
});

// POST /api/subscriptions/create — create subscription (simplified without Stripe for now)
export const createSubscription = asyncHandler(async (req, res) => {
  const { plan, charityId, charityPercentage } = req.body;
  const userId = req.user.id;

  if (!plan || !['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ success: false, message: 'Plan must be monthly or yearly' });
  }

  const pct = parseInt(charityPercentage, 10) || 10;
  if (pct < 10 || pct > 100) {
    return res.status(400).json({ success: false, message: 'Charity percentage must be 10-100' });
  }

  // Verify charity exists
  if (charityId) {
    const charityCheck = await query('SELECT id FROM charities WHERE id = $1 AND active = true', [charityId]);
    if (charityCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected charity not found or inactive' });
    }
  }

  const monthlyAmount = plan === 'monthly' ? 25000 : 20833; // $250.00 or ~$208.33/mo (yearly)
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + (plan === 'monthly' ? 1 : 12));

  // Upsert subscription
  const result = await query(
    `INSERT INTO subscriptions (user_id, plan, status, selected_charity_id, charity_percentage, renewal_date, monthly_amount_cents)
     VALUES ($1, $2, 'active', $3, $4, $5, $6)
     ON CONFLICT (user_id)
     DO UPDATE SET plan = $2, status = 'active', selected_charity_id = $3,
                   charity_percentage = $4, renewal_date = $5, monthly_amount_cents = $6
     RETURNING *`,
    [userId, plan, charityId || null, pct, renewalDate, monthlyAmount]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

// POST /api/subscriptions/cancel
export const cancelSubscription = asyncHandler(async (req, res) => {
  const result = await query(
    `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active' RETURNING id`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ success: false, message: 'No active subscription to cancel' });
  }

  res.json({ success: true, message: 'Subscription cancelled' });
});

// PUT /api/subscriptions/charity — update charity selection and percentage
export const updateCharity = asyncHandler(async (req, res) => {
  const { charityId, charityPercentage } = req.body;
  const userId = req.user.id;

  const pct = parseInt(charityPercentage, 10) || 10;
  if (pct < 10 || pct > 100) {
    return res.status(400).json({ success: false, message: 'Charity percentage must be 10-100' });
  }

  if (charityId) {
    const charityCheck = await query('SELECT id FROM charities WHERE id = $1 AND active = true', [charityId]);
    if (charityCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Charity not found or inactive' });
    }
  }

  // UPSERT: create subscription row if it doesn't exist, otherwise update the charity fields only
  const result = await query(
    `INSERT INTO subscriptions (user_id, plan, status, selected_charity_id, charity_percentage, monthly_amount_cents, renewal_date)
     VALUES ($1, 'monthly', 'inactive', $2, $3, 0, NOW() + INTERVAL '1 month')
     ON CONFLICT (user_id)
     DO UPDATE SET selected_charity_id = $2, charity_percentage = $3
     RETURNING *`,
    [userId, charityId || null, pct]
  );

  res.json({ success: true, data: result.rows[0] });
});

