import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function createToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

export function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    identification: user.identification ?? null,
    isSuspended: user.isSuspended
  };
}
