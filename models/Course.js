import mongoose from 'mongoose';

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
    level: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
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
    // Optional modular syllabus breakdown shown in an accordion on the
    // public Courses page. Each entry is a named topic with a short
    // description of what it covers.
    syllabus: [
      {
        topic: { type: String, required: true },
        details: { type: String, required: true },
        _id: false,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    // Optional teacher assignment: which staff account (role: 'teacher')
    // is responsible for this course. Left null means unassigned /
    // handled directly by an admin.
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;