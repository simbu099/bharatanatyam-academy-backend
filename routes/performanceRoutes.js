const express = require('express');
const router = express.Router();
const {
  createPerformanceRequest,
  getPerformanceRequests,
  updatePerformanceRequestStatus,
} = require('../controllers/performanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').post(createPerformanceRequest).get(protect, adminOnly, getPerformanceRequests);
router.patch('/:id/status', protect, adminOnly, updatePerformanceRequestStatus);

module.exports = router;
