import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getDashboardStats);

export default router;