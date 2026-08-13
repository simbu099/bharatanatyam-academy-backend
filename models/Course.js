const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Prarambhik (Beginner)',
        'Madhyama (Intermediate)',
        'Uttama (Advanced)',
        'Nattuvangam & Rhythm',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    slotsAvailable: {
      type: Number,
      default: 10,
    },
    schedule: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);