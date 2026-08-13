const Course = require('../models/Course');
const Slot = require('../models/Slot');

// @desc    Get all published courses (or all courses for admin)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };
    const courses = await Course.find(filter).sort({ createdAt: -1 });

    // Fetch active slots for each course
    const coursesWithSlots = await Promise.all(
      courses.map(async (course) => {
        const slots = await Slot.find({ course: course._id, isActive: true });
        return {
          ...course.toObject(),
          slots,
        };
      })
    );

    res.json({ success: true, count: coursesWithSlots.length, data: coursesWithSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course with details and available slots
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const slots = await Slot.find({ course: course._id, isActive: true });
    res.json({ success: true, data: { ...course.toObject(), slots } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    await course.deleteOne();
    await Slot.deleteMany({ course: req.params.id });
    res.json({ success: true, message: 'Course and associated slots deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
