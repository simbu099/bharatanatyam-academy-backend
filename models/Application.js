import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
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
      required: false,
    },
    courseName: {
      type: String,
      required: true,
    },
    selectedSlot: {
      type: String,
      default: 'General Batch',
    },
    age: {
      type: Number,
      required: false,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'enrolled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;
