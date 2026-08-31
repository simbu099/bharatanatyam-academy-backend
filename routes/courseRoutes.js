import express from 'express';
import {
  getCourses,
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, adminOnly, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, requireRole('admin', 'teacher'), getMyCourses);

router.route('/')
  .get(getCourses)
  .post(protect, adminOnly, createCourse);

router.route('/:id')
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

export default router;