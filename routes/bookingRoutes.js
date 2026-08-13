const express = require('express');
const router = express.Router();
const {
  getSlots,
  createSlot,
  applyForCourse,
  getApplications,
  updateApplicationStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/slots', getSlots);
router.post('/slots', protect, adminOnly, createSlot);

router.post('/apply', applyForCourse);

router.get('/applications', protect, adminOnly, getApplications);
router.patch('/applications/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;
