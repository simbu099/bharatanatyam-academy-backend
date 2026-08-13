const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getCourses).post(protect, adminOnly, createCourse);
router.route('/:id').get(getCourseById).put(protect, adminOnly, updateCourse).delete(protect, adminOnly, deleteCourse);

module.exports = router;
