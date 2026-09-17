import express from 'express';
import { getMyScores, addScore, updateScore, deleteScore } from '../controllers/scoreController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware: optionally, verify active subscription before allowing score entry.
// For now, we just require authentication as per basic protect.

router.route('/')
  .get(protect, getMyScores)
  .post(protect, addScore);

router.route('/:id')
  .put(protect, updateScore)
  .delete(protect, deleteScore);

export default router;
