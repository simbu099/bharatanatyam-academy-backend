import express from 'express';
import {
  createApplication,
  getApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect, adminOnly, requireRole } from '../middleware/authMiddleware.js';
import { applicationValidation } from '../middleware/validators.js';
import { formLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.get('/my', protect, requireRole('admin', 'teacher'), getMyApplications);

router.route('/')
  .post(formLimiter, applicationValidation, createApplication)
  .get(protect, adminOnly, getApplications);

router.route('/:id')
  .put(protect, adminOnly, updateApplicationStatus)
  .delete(protect, adminOnly, deleteApplication);

export default router;
