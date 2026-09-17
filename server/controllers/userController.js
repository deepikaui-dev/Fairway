import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// GET /api/users/profile — full user profile with subscription + charity
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userResult = await query(
    `SELECT u.id, u.email, u.full_name, u.role, u.created_at,
            s.id as subscription_id, s.plan, s.status as subscription_status,
            s.charity_percentage, s.renewal_date, s.monthly_amount_cents,
            c.id as charity_id, c.name as charity_name, c.image_url as charity_image
     FROM users u
     LEFT JOIN subscriptions s ON s.user_id = u.id
     LEFT JOIN charities c ON c.id = s.selected_charity_id
     WHERE u.id = $1`,
    [userId]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const row = userResult.rows[0];
  res.json({
    success: true,
    data: {
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
      createdAt: row.created_at,
      subscription: row.subscription_id ? {
        id: row.subscription_id,
        plan: row.plan,
        status: row.subscription_status,
        charityPercentage: row.charity_percentage,
        renewalDate: row.renewal_date,
        monthlyAmountCents: row.monthly_amount_cents,
      } : null,
      charity: row.charity_id ? {
        id: row.charity_id,
        name: row.charity_name,
        imageUrl: row.charity_image,
      } : null,
    },
  });
});

// PUT /api/users/profile — update name
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { fullName } = req.body;

  if (!fullName || fullName.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Full name is required' });
  }

  await query('UPDATE users SET full_name = $1 WHERE id = $2', [fullName.trim(), userId]);
  res.json({ success: true, message: 'Profile updated' });
});
