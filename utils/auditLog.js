import AuditLog from '../models/AuditLog.js';

/**
 * Record a sensitive admin action. Never throws — a logging failure
 * should never block the actual admin action from completing.
 *
 * @param {import('express').Request} req - must have req.user set (protect middleware)
 * @param {string} action - short machine-readable action id, e.g. 'staff.create'
 * @param {string} details - human-readable summary, e.g. 'Created teacher account for jane@example.com'
 */
export const logAudit = async (req, action, details = '') => {
  try {
    if (!req.user) return;
    await AuditLog.create({
      action,
      performedBy: req.user._id,
      performedByName: req.user.name || req.user.username || req.user.email,
      performedByRole: req.user.role,
      details,
    });
  } catch (error) {
    console.error('[Audit Log Error]:', error.message);
  }
};
