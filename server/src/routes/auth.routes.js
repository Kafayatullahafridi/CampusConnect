import { Router } from 'express';
import { login, me, register, updateProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema, parseBody, profileSchema, registerSchema } from '../validators/auth.validators.js';

const router = Router();

router.post('/register', parseBody.bind(null, registerSchema), register);
router.post('/login', parseBody.bind(null, loginSchema), login);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, parseBody.bind(null, profileSchema), updateProfile);

export default router;
