import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// @desc    Create a new booking & send confirmation email
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { studentName, email, phone, courseId, slotId, age, notes } = req.body;

    const newBooking = await Booking.create({
      studentName,
      email,
      phone,
      course: courseId,
      slot: slotId,
      age,
      notes,
    });

    let slot = null;
    if (slotId) {
      slot = await Slot.findById(slotId);
      if (slot) {
        slot.bookedCount = (slot.bookedCount || 0) + 1;
        await slot.save();
      }
    }

    // Send Mail Trigger
    try {
      await sendBookingConfirmation({ studentName, email, phone, age, notes }, null, slot);
    } catch (mailError) {
      console.error('Email sending failed, but booking was saved:', mailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created and confirmation email queued!',
      data: newBooking,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('course').populate('slot').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};