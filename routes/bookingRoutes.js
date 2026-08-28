import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/bookings & POST /api/bookings
router.route('/')
  .post(createBooking)
  .get(protect, adminOnly, getBookings);

// Admin Dashboard-க்காக /applications route
router.get('/applications', protect, adminOnly, getBookings);

// ID அடிப்படையிலான operations
router.route('/:id')
  .put(protect, adminOnly, updateBookingStatus)
  .delete(protect, adminOnly, deleteBooking);

export default router;