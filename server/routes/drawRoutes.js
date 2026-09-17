import express from 'express';
import { listDraws, getUpcomingDraw, getDrawDetail, getMyEntries } from '../controllers/drawController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/upcoming', getUpcomingDraw);
router.get('/my-entries', protect, getMyEntries);
router.get('/:id', getDrawDetail);
router.get('/', listDraws);

export default router;
