import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'faculty', 'organizer', 'admin'], default: 'student' },
  identification: { type: String, trim: true, maxlength: 100 },
  isSuspended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model('User', userSchema);
