import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  createStaffUser,
  getStaffUsers,
  setStaffActiveStatus,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidation, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin-only: create a teacher or additional admin account. Never exposed
// as a public self-service role selector.
router.post('/create-staff', protect, adminOnly, registerValidation, createStaffUser);
router.get('/staff', protect, adminOnly, getStaffUsers);
router.put('/staff/:id/status', protect, adminOnly, setStaffActiveStatus);

export default router;
