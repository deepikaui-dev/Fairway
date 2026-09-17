import express from 'express';
import { 
  getAdminStats, 
  getUsers, 
  createCharity, updateCharity, 
  createDraw, runDrawSimulation, publishDraw,
  getWinners, updateWinnerStatus
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require user to be authenticated AND have admin role
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);

router.post('/charities', createCharity);
router.put('/charities/:id', updateCharity);

router.post('/draws/create', createDraw);
router.post('/draws/:id/simulate', runDrawSimulation);
router.post('/draws/:id/publish', publishDraw);

router.get('/winners', getWinners);
router.put('/winners/:id', updateWinnerStatus);

export default router;
