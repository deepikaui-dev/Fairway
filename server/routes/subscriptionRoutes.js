import express from 'express';
import { getMySubscription, createSubscription, cancelSubscription, updateCharity } from '../controllers/subscriptionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMySubscription);
router.post('/create', protect, createSubscription);
router.post('/cancel', protect, cancelSubscription);
router.put('/charity', protect, updateCharity);

export default router;
