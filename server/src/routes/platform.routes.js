import { Router } from 'express';
import { createAnnouncement, listAnnouncements, listNotifications, markNotificationRead } from '../controllers/platform.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
const announcementFields = (request, response, next) => {
  const { title, body, category, pinned, expiresAt } = request.body;
  if (typeof title !== 'string' || title.trim().length < 3 || typeof body !== 'string' || body.trim().length < 3) {
    return response.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Title and body are required.' } });
  }
  request.body = { title: title.trim(), body: body.trim(), category, pinned, expiresAt };
  return next();
};

router.get('/announcements', listAnnouncements);
router.post('/announcements', requireAuth, requireRole('admin', 'faculty'), announcementFields, createAnnouncement);
router.get('/notifications', requireAuth, listNotifications);
router.patch('/notifications/:id/read', requireAuth, markNotificationRead);

export default router;
