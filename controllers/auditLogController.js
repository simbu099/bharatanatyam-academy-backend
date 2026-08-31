import AuditLog from '../models/AuditLog.js';

// @desc    Get recent audit log entries (most recent first)
// @route   GET /api/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
