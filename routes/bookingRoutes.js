import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createBooking)
  .get(protect, adminOnly, getBookings);

router.route('/:id')
  .put(protect, adminOnly, updateBookingStatus)
  .delete(protect, adminOnly, deleteBooking);

export default router;