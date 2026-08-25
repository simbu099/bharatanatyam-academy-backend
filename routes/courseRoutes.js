import express from 'express';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, adminOnly, createCourse);

router.route('/:id')
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

export default router;