import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { bookingValidation } from '../middleware/validators.js';
import { formLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.route('/')
  .post(formLimiter, bookingValidation, createBooking)
  .get(protect, adminOnly, getBookings);

router.route('/:id')
  .put(protect, adminOnly, updateBookingStatus)
  .delete(protect, adminOnly, deleteBooking);

export default router;
