import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  capacity: { type: Number, required: true, min: 1 },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
eventSchema.pre('save', function (next) { this.updatedAt = new Date(); next(); });
export const Event = mongoose.model('Event', eventSchema);
