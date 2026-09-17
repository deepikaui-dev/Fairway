import express from 'express';
import { 
  submitContactMessage, 
  getContactMessages, 
  deleteContactMessage, 
  addContactNote 
} from '../controllers/contactController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route to submit a form
router.post('/', submitContactMessage);

// Admin routes for managing messages
router.get('/admin/messages', protect, admin, getContactMessages);
router.delete('/admin/messages/:id', protect, admin, deleteContactMessage);
router.post('/admin/messages/:id/notes', protect, admin, addContactNote);

export default router;
