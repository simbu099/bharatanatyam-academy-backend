import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/stats மற்றும் /api/stats/dashboard ஆகிய இரண்டிற்கும் வேலை செய்யும்
router.get('/', protect, adminOnly, getDashboardStats);
router.get('/dashboard', protect, adminOnly, getDashboardStats);

export default router;