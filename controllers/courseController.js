import Course from '../models/Course.js';

// @desc    Get all active courses (or all courses if requested)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    let courses = await Course.find(filter);

    // DB காலியாக இருந்தால் Default Courses உருவாக்கும்
    if (courses.length === 0) {
      const defaultCourses = [
        { title: 'Bharatanatyam Foundation (Prarambhik)', level: 'Beginner', duration: '6 Months', fee: 3000, isActive: true },
        { title: 'Intermediate Nattuvangam & Nritta', level: 'Intermediate', duration: '1 Year', fee: 5000, isActive: true },
        { title: 'Advanced Abhinaya & Margam Showcase', level: 'Advanced', duration: '2 Years', fee: 8000, isActive: true }
      ];
      courses = await Course.insertMany(defaultCourses);
    }

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
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};