import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true, maxlength: 60 },
  message: { type: String, required: true, maxlength: 500 },
  readAt: Date
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
