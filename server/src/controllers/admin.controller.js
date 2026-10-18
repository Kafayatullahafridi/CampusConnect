import { User } from '../models/user.model.js';
import { AuditLog } from '../models/audit-log.model.js';

export async function listUsers(_request, response, next) {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(500);
    return response.json({ success: true, data: { users } });
  } catch (error) { return next(error); }
}

export async function suspendUser(request, response, next) {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, { isSuspended: request.body.suspended !== false }, { new: true }).select('-passwordHash');
    if (!user) return response.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found.' } });
    await AuditLog.create({ actor: request.user._id, action: user.isSuspended ? 'suspend_user' : 'reactivate_user', targetType: 'User', targetId: user.id });
    return response.json({ success: true, data: { user } });
  } catch (error) { return next(error); }
}

export async function listAuditLogs(_request, response, next) {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200).populate('actor', 'name email');
    return response.json({ success: true, data: { logs } });
  } catch (error) { return next(error); }
}
