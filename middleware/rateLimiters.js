import rateLimit from 'express-rate-limit';

// Generic API limiter applied to everything.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Tighter limiter for login/register to slow down brute-force/credential
// stuffing attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
  skipSuccessfulRequests: true,
});

// Limiter for public form submissions (bookings, applications, enquiries,
// newsletter) to prevent spam.
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this device. Please try again later.' },
});
