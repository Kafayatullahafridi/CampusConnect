import { getDatabaseState } from '../config/database.js';

export function getHealth(_request, response) {
  const database = getDatabaseState();
  const isReady = database === 'connected';

  response.status(isReady ? 200 : 503).json({
    success: isReady,
    data: {
      service: 'campusconnect-api',
      status: isReady ? 'ok' : 'degraded',
      database
    }
  });
}
