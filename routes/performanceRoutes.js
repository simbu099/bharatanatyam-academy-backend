import express from 'express';
import {
  createPerformanceRequest,
  getPerformanceRequests,
  deletePerformanceRequest,
} from '../controllers/performanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createPerformanceRequest)
  .get(protect, adminOnly, getPerformanceRequests);

router.route('/:id')
  .delete(protect, adminOnly, deletePerformanceRequest);

export default router;