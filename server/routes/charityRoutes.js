import express from 'express';
import { listCharities, getCharity } from '../controllers/charityController.js';

const router = express.Router();

router.get('/', listCharities);
router.get('/:id', getCharity);

export default router;
