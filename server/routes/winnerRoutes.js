import express from 'express';
import multer from 'multer';
import { getMyWinnings, uploadProof } from '../controllers/winnerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Local file storage for proofs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});
const upload = multer({ storage: storage });

router.get('/me', protect, getMyWinnings);
router.post('/:id/proof', protect, upload.single('proofFile'), uploadProof);

export default router;
