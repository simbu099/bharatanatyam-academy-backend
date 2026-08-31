import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course selection is required'],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      default: null,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Reuse existing model instance if available
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;