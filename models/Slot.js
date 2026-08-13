const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    days: {
      type: String,
      required: true, // e.g., 'Mon & Wed', 'Tue & Thu', 'Sat & Sun'
    },
    startTime: {
      type: String,
      required: true, // e.g., '07:00 AM'
    },
    endTime: {
      type: String,
      required: true, // e.g., '08:30 AM'
    },
    batchName: {
      type: String,
      default: 'Morning Prarambhik Batch',
    },
    maxCapacity: {
      type: Number,
      default: 15,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
