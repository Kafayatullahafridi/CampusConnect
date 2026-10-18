import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { createToken, publicUser } from '../utils/auth.js';

export async function register(request, response, next) {
  try {
    const { name, email, password, identification } = request.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return response.status(409).json({
        success: false,
        error: { code: 'EMAIL_IN_USE', message: 'An account with this email already exists.' }
      });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, identification });
    return response.status(201).json({ success: true, data: { user: publicUser(user), token: createToken(user) } });
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = user && !user.isSuspended && await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return response.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' }
      });
    }
    return response.json({ success: true, data: { user: publicUser(user), token: createToken(user) } });
  } catch (error) {
    return next(error);
  }
}

export function me(request, response) {
  return response.json({ success: true, data: { user: publicUser(request.user) } });
}

export async function updateProfile(request, response, next) {
  try {
    const user = await User.findByIdAndUpdate(request.user._id, request.body, { new: true, runValidators: true });
    return response.json({ success: true, data: { user: publicUser(user) } });
  } catch (error) {
    return next(error);
  }
}
