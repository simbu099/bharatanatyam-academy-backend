import express from 'express';
import {
  createPerformanceRequest,
  getPerformanceRequests,
  updatePerformanceStatus,
  deletePerformanceRequest,
} from '../controllers/performanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { performanceValidation } from '../middleware/validators.js';
import { formLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.route('/')
  .post(formLimiter, performanceValidation, createPerformanceRequest)
  .get(protect, adminOnly, getPerformanceRequests);

router.route('/:id')
  .put(protect, adminOnly, updatePerformanceStatus)
  .delete(protect, adminOnly, deletePerformanceRequest);

export default router;
