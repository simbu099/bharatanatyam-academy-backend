const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  toggleApproveReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getReviews).post(createReview);
router.patch('/:id/approve', protect, adminOnly, toggleApproveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
