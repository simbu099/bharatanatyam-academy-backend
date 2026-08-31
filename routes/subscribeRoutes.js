import express from 'express';
import { subscribeNewsletter, getSubscribers } from '../controllers/subscribeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { subscribeValidation } from '../middleware/validators.js';
import { formLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.route('/')
  .post(formLimiter, subscribeValidation, subscribeNewsletter)
  .get(protect, adminOnly, getSubscribers);

export default router;
