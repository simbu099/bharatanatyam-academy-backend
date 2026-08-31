import Course from '../models/Course.js';
import { logAudit } from '../utils/auditLog.js';

// @desc    Get all active courses (or all courses if requested)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const courses = await Course.find(filter).sort({ createdAt: 1 });

    // Note: if no courses exist yet, run `npm run seed` in the backend to
    // populate real course data instead of silently inserting placeholder
    // documents that don't match the required schema fields.
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get courses relevant to the logged-in staff member.
//          Admins see every course; teachers see only courses assigned
//          to them.
// @route   GET /api/courses/my
// @access  Private (admin, teacher)
export const getMyCourses = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { teacher: req.user._id };
    const courses = await Course.find(filter).populate('teacher', 'name username email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    await logAudit(req, 'course.delete', `Deleted course "${course.title}"`);
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};