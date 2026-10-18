import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import donationRoutes from './routes/donation.routes.js';
import lostFoundRoutes from './routes/lost-found.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';
import eventRoutes from './routes/event.routes.js';
import platformRoutes from './routes/platform.routes.js';
import adminRoutes from './routes/admin.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/lost-and-found', lostFoundRoutes);
  app.use('/api/volunteering', volunteerRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api', platformRoutes);
  app.use('/api/admin', adminRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
