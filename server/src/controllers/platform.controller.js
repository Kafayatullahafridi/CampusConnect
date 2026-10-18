import { Announcement } from '../models/announcement.model.js';
import { Notification } from '../models/notification.model.js';

export async function listAnnouncements(request, response, next) {
  try {
    const filter = { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }] };
    const announcements = await Announcement.find(filter).sort({ pinned: -1, createdAt: -1 }).limit(100).populate('publishedBy', 'name role');
    return response.json({ success: true, data: { announcements } });
  } catch (error) { return next(error); }
}

export async function createAnnouncement(request, response, next) {
  try {
    const announcement = await Announcement.create({ ...request.body, publishedBy: request.user._id });
    return response.status(201).json({ success: true, data: { announcement } });
  } catch (error) { return next(error); }
}

export async function listNotifications(request, response, next) {
  try {
    const notifications = await Notification.find({ recipient: request.user._id }).sort({ createdAt: -1 }).limit(50);
    return response.json({ success: true, data: { notifications } });
  } catch (error) { return next(error); }
}

export async function markNotificationRead(request, response, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: request.params.id, recipient: request.user._id },
      { readAt: new Date() },
      { new: true }
    );
    if (!notification) return response.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found.' } });
    return response.json({ success: true, data: { notification } });
  } catch (error) { return next(error); }
}
