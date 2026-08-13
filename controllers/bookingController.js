const Slot = require('../models/Slot');
const Application = require('../models/Application');
const Course = require('../models/Course');
const { sendBookingConfirmation } = require('../utils/emailService');

// @desc    Get all slots for a course or all courses
// @route   GET /api/bookings/slots
// @access  Public
const getSlots = async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = { isActive: true };
    if (courseId) filter.course = courseId;

    const slots = await Slot.find(filter).populate('course', 'title code feeMonthly level');
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new slot (Admin)
// @route   POST /api/bookings/slots
// @access  Private/Admin
const createSlot = async (req, res) => {
  try {
    const slot = await Slot.create(req.body);
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Submit Course Application & Slot Booking
// @route   POST /api/bookings/apply
// @access  Public
const applyForCourse = async (req, res) => {
  try {
    const { studentName, email, phone, age, experienceYears, courseId, slotId, specialNote } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Selected course not found' });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Selected timing slot not found' });
    }

    if (slot.bookedCount >= slot.maxCapacity) {
      return res.status(400).json({ success: false, message: 'Selected batch slot is already full. Please choose another timing.' });
    }

    // Create application record
    const application = await Application.create({
      studentName,
      email,
      phone,
      age: Number(age),
      experienceYears: Number(experienceYears || 0),
      course: courseId,
      slot: slotId,
      specialNote: specialNote || '',
      status: 'pending',
    });

    // Increment slot booked count
    slot.bookedCount += 1;
    await slot.save();

    // Trigger Email notification asynchronously
    sendBookingConfirmation(application, course, slot);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! A confirmation email has been dispatched.',
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/bookings/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('course', 'title code feeMonthly')
      .populate('slot', 'days startTime endTime batchName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (Admin)
// @route   PATCH /api/bookings/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('course', 'title')
      .populate('slot', 'days startTime endTime');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSlots,
  createSlot,
  applyForCourse,
  getApplications,
  updateApplicationStatus,
};
