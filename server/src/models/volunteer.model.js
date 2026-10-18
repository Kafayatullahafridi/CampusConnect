import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true, maxlength: 200 },
  capacity: { type: Number, required: true, min: 1 },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
volunteerSchema.pre('save', function (next) { this.updatedAt = new Date(); next(); });
export const VolunteerOpportunity = mongoose.model('VolunteerOpportunity', volunteerSchema);
