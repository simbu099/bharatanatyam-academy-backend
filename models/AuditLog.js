import mongoose from 'mongoose';

// Records sensitive/destructive admin actions for accountability —
// who did what, when. Intentionally simple: one flat collection, no
// joins required to read the log.
const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. 'staff.create', 'theme.update'
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    performedByName: { type: String, required: true }, // denormalized so the log still reads
    performedByRole: { type: String, required: true }, // fine if the user account is later deleted
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

// Most-recent-first is the only access pattern we need.
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
