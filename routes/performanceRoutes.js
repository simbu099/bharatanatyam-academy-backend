import express from 'express';
import {
  createPerformanceRequest,
  getPerformanceRequests,
  updatePerformanceStatus,
  deletePerformanceRequest,
} from '../controllers/performanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base Path: /api/performance OR /api/performance-requests
router.route('/')
  .post(createPerformanceRequest)
  .get(protect, adminOnly, getPerformanceRequests);

// Supporting BOTH /:id and /:id/status routes
router.route('/:id/status')
  .put(protect, adminOnly, updatePerformanceStatus)
  .patch(protect, adminOnly, updatePerformanceStatus);

router.route('/:id')
  .put(protect, adminOnly, updatePerformanceStatus)
  .delete(protect, adminOnly, deletePerformanceRequest);

export default router;