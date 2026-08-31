import Application from '../models/Application.js';
import Course from '../models/Course.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// @desc    Submit a course application (save to DB, then email)
// @route   POST /api/applications
// @access  Public
export const createApplication = async (req, res) => {
  try {
    const {
      studentName,
      email,
      phone,
      courseId,
      courseName,
      selectedSlot,
      age,
      experience,
      notes,
    } = req.body;

    const application = await Application.create({
      studentName,
      email,
      phone,
      course: courseId || undefined,
      courseName,
      selectedSlot: selectedSlot || 'General Batch',
      age: age || undefined,
      experienceYears: experience || 0,
      notes: notes || '',
    });

    // Email is best-effort: the application is already safely stored, so a
    // failed email must never lose or block the submission.
    try {
      await sendBookingConfirmation(
        { studentName, email, phone, age, notes, courseName, selectedSlot },
        null,
        null
      );
    } catch (mailError) {
      console.error('Application email sending failed, but application was saved:', mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application,
    });
  } catch (error) {
    console.error('Create Application Error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit application',
    });
  }
};

// @desc    Get applications for students in courses assigned to the
//          logged-in teacher (admins should use GET /api/applications
//          instead, which returns everything).
// @route   GET /api/applications/my
// @access  Private (admin, teacher)
export const getMyApplications = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const applications = await Application.find().populate('course').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: applications.length, data: applications });
    }

    const myCourseIds = await Course.find({ teacher: req.user._id }).distinct('_id');
    const applications = await Application.find({ course: { $in: myCourseIds } })
      .populate('course')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('course').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an application's status
// @route   PUT /api/applications/:id
// @access  Private/Admin
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
