import { query } from '../db.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// GET /api/winners/me — my winnings
export const getMyWinnings = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT w.*, d.draw_month, d.draw_year, d.draw_date, d.winning_numbers,
            de.ticket_numbers,
            wp.file_url as proof_url, wp.uploaded_at as proof_uploaded_at
     FROM winners w
     JOIN draws d ON d.id = w.draw_id
     JOIN draw_entries de ON de.id = w.draw_entry_id
     LEFT JOIN winner_proofs wp ON wp.winner_id = w.id
     WHERE w.user_id = $1
     ORDER BY d.draw_date DESC`,
    [req.user.id]
  );

  // Compute totals
  const totalWon = result.rows.reduce((sum, r) => sum + parseInt(r.prize_amount_cents, 10), 0);
  const pendingAmount = result.rows
    .filter(r => r.status === 'pending' || r.status === 'verified')
    .reduce((sum, r) => sum + parseInt(r.prize_amount_cents, 10), 0);

  res.json({
    success: true,
    data: {
      wins: result.rows,
      totalWonCents: totalWon,
      pendingCents: pendingAmount,
    },
  });
});

// POST /api/winners/:id/proof — upload proof (uses multer in route)
export const uploadProof = asyncHandler(async (req, res) => {
  const winnerId = req.params.id;

  // Verify ownership
  const winnerRes = await query(
    'SELECT * FROM winners WHERE id = $1 AND user_id = $2',
    [winnerId, req.user.id]
  );
  if (winnerRes.rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Winner record not found' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  // Upsert proof
  await query(
    `INSERT INTO winner_proofs (winner_id, file_url, original_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (winner_id) DO UPDATE SET file_url = $2, original_name = $3, uploaded_at = NOW()`,
    [winnerId, fileUrl, req.file.originalname]
  );

  res.json({ success: true, message: 'Proof uploaded', data: { fileUrl } });
});
