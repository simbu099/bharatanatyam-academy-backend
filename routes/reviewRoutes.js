import express from 'express';
import {
  getReviews,
  getAllReviewsForAdmin,
  createReview,
  approveReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { reviewValidation } from '../middleware/validators.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, reviewValidation, createReview);

router.get('/admin', protect, adminOnly, getAllReviewsForAdmin);
router.put('/:id/approve', protect, adminOnly, approveReview);

router.route('/:id')
  .delete(protect, adminOnly, deleteReview);

export default router;
