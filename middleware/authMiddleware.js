import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account not found' });
      }
      if (!req.user.isActive) {
        return res.status(403).json({ success: false, message: 'This account has been disabled' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
};

// Restrict a route to one or more roles, e.g. requireRole('admin', 'teacher')
export const requireRole = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
};

// Kept for backward compatibility with existing routes.
export const adminOnly = requireRole('admin');
