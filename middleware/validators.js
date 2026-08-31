import { body, validationResult } from 'express-validator';

// Runs after a chain of express-validator rules; returns a clean 400
// response instead of leaking library internals to the client.
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('phone').optional().trim(),
  handleValidation,
];

export const loginValidation = [
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

export const bookingValidation = [
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('courseId').notEmpty().withMessage('Course is required'),
  body('age').optional().isInt({ min: 3, max: 100 }).withMessage('Please provide a valid age'),
  handleValidation,
];

export const applicationValidation = [
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('courseName').trim().notEmpty().withMessage('Course is required'),
  handleValidation,
];

export const performanceValidation = [
  body('organizerName').trim().notEmpty().withMessage('Organizer name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('eventDate').notEmpty().withMessage('Event date is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  handleValidation,
];

export const subscribeValidation = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  handleValidation,
];

export const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 3 }).withMessage('Please write a short comment'),
  handleValidation,
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  handleValidation,
];

export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  handleValidation,
];
