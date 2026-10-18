import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

export async function requireAuth(request, response, next) {
  const header = request.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Authentication is required.' }
    });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || user.isSuspended) {
      return response.status(401).json({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'The account is unavailable.' }
      });
    }
    request.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return response.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'The authentication token is invalid or expired.' }
      });
    }
    return next(error);
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' }
      });
    }
    return next();
  };
}
