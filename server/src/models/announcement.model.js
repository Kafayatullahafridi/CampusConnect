import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  body: { type: String, required: true, trim: true, maxlength: 10000 },
  category: { type: String, enum: ['general', 'academic', 'safety', 'opportunity'], default: 'general' },
  pinned: { type: Boolean, default: false },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: Date
}, { timestamps: true });

announcementSchema.index({ pinned: -1, createdAt: -1 });
export const Announcement = mongoose.model('Announcement', announcementSchema);
