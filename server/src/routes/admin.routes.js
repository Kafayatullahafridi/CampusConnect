import { Router } from 'express';
import { listAuditLogs, listUsers, suspendUser } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/users', listUsers);
router.patch('/users/:id/suspension', suspendUser);
router.get('/audit-logs', listAuditLogs);
export default router;
