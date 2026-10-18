import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  quantity: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['available', 'claimed', 'cancelled'], default: 'available' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
donationSchema.pre('save', function (next) { this.updatedAt = new Date(); next(); });
export const Donation = mongoose.model('Donation', donationSchema);
