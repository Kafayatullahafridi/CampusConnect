import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  date: { type: Date, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
lostFoundSchema.index({ owner: 1, type: 1, title: 1, date: 1 }, { unique: true });
lostFoundSchema.pre('save', function (next) { this.updatedAt = new Date(); next(); });
export const LostFound = mongoose.model('LostFound', lostFoundSchema);
