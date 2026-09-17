import { query } from '../db.js';

/**
 * Draw service — handles the core draw algorithm
 * Uses integer cents for all money calculations to avoid float errors
 */

/**
 * Generate N unique random numbers between min and max (inclusive)
 */
export function generateRandomNumbers(count, min, max) {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Count how many numbers in `ticket` match `winning`
 */
export function countMatches(ticket, winning) {
  const winSet = new Set(winning);
  return ticket.filter((n) => winSet.has(n)).length;
}

/**
 * Calculate prize pools from the total pool
 *   5-match → 40%, 4-match → 35%, 3-match → 25%
 * All values in cents (integers)
 */
export function calculatePools(totalCents, rolloverCents = 0) {
  const match5 = Math.floor(totalCents * 0.4) + rolloverCents;
  const match4 = Math.floor(totalCents * 0.35);
  const match3 = Math.floor(totalCents * 0.25);
  return { match5, match4, match3 };
}

/**
 * Run a draw simulation
 * 1. Get all active subscribers
 * 2. Generate a ticket (5 random numbers 1-45) for each
 * 3. Generate winning numbers
 * 4. Compare & find winners
 * 5. Calculate prizes
 */
export async function simulateDraw(drawId) {
  // Get the draw record
  const drawRes = await query('SELECT * FROM draws WHERE id = $1', [drawId]);
  if (drawRes.rows.length === 0) throw new Error('Draw not found');
  const draw = drawRes.rows[0];

  // Get all active subscribers
  const subsRes = await query(
    `SELECT s.user_id FROM subscriptions s WHERE s.status = 'active'`
  );
  const subscribers = subsRes.rows;

  if (subscribers.length === 0) {
    throw new Error('No active subscribers for this draw');
  }

  // Generate winning numbers (5 unique numbers from 1-45)
  const winningNumbers = generateRandomNumbers(5, 1, 45);

  // Calculate prize pool: $25 per active subscriber (2500 cents)
  const prizePerSub = 2500; // cents
  const totalPool = subscribers.length * prizePerSub;

  // Get previous rollover (unclaimed 5-match from previous draws)
  const rolloverRes = await query(
    `SELECT COALESCE(SUM(jackpot_rollover_cents), 0) as rollover
     FROM draws WHERE status = 'published' AND id != $1
     AND draw_date < (SELECT draw_date FROM draws WHERE id = $1)`,
    [drawId]
  );
  const rollover = parseInt(rolloverRes.rows[0].rollover, 10) || 0;

  const pools = calculatePools(totalPool, rollover);

  // Clear old entries for this draw (if re-simulating)
  await query('DELETE FROM draw_entries WHERE draw_id = $1', [drawId]);
  await query('DELETE FROM winners WHERE draw_id = $1', [drawId]);

  // Generate tickets for each subscriber and check matches
  const winners = { 5: [], 4: [], 3: [] };

  for (const sub of subscribers) {
    const ticket = generateRandomNumbers(5, 1, 45);
    const matches = countMatches(ticket, winningNumbers);

    const entryRes = await query(
      `INSERT INTO draw_entries (draw_id, user_id, ticket_numbers, matches)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [drawId, sub.user_id, ticket, matches]
    );

    if (matches >= 3) {
      winners[matches].push({
        userId: sub.user_id,
        entryId: entryRes.rows[0].id,
        matches,
      });
    }
  }

  // Calculate individual prize amounts (split equally within tier)
  let jackpotRollover = 0;

  // 5-match winners
  if (winners[5].length > 0) {
    const perWinner = Math.floor(pools.match5 / winners[5].length);
    for (const w of winners[5]) {
      await query(
        `INSERT INTO winners (draw_id, draw_entry_id, user_id, match_tier, prize_amount_cents)
         VALUES ($1, $2, $3, 5, $4)`,
        [drawId, w.entryId, w.userId, perWinner]
      );
    }
  } else {
    // Jackpot rolls over
    jackpotRollover = pools.match5;
  }

  // 4-match winners (no rollover)
  if (winners[4].length > 0) {
    const perWinner = Math.floor(pools.match4 / winners[4].length);
    for (const w of winners[4]) {
      await query(
        `INSERT INTO winners (draw_id, draw_entry_id, user_id, match_tier, prize_amount_cents)
         VALUES ($1, $2, $3, 4, $4)`,
        [drawId, w.entryId, w.userId, perWinner]
      );
    }
  }

  // 3-match winners (no rollover)
  if (winners[3].length > 0) {
    const perWinner = Math.floor(pools.match3 / winners[3].length);
    for (const w of winners[3]) {
      await query(
        `INSERT INTO winners (draw_id, draw_entry_id, user_id, match_tier, prize_amount_cents)
         VALUES ($1, $2, $3, 3, $4)`,
        [drawId, w.entryId, w.userId, perWinner]
      );
    }
  }

  // Update draw record
  await query(
    `UPDATE draws SET
       status = 'simulated',
       winning_numbers = $1,
       total_prize_pool_cents = $2,
       match5_pool_cents = $3,
       match4_pool_cents = $4,
       match3_pool_cents = $5,
       jackpot_rollover_cents = $6,
       eligible_entries = $7,
       simulated_at = NOW()
     WHERE id = $8`,
    [winningNumbers, totalPool, pools.match5, pools.match4, pools.match3,
     jackpotRollover, subscribers.length, drawId]
  );

  return {
    winningNumbers,
    totalPool,
    pools,
    jackpotRollover,
    eligibleEntries: subscribers.length,
    winners: {
      match5: winners[5].length,
      match4: winners[4].length,
      match3: winners[3].length,
    },
  };
}
