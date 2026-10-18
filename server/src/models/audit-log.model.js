import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, maxlength: 100 },
  targetType: { type: String, required: true, maxlength: 60 },
  targetId: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
