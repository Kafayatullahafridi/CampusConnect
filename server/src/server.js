import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

const app = createApp();

async function startServer() {
  await connectDatabase(env.mongoUri);

  const server = app.listen(env.port, () => {
    console.info(`CampusConnect API listening on port ${env.port}.`);
  });

  const shutdown = async (signal) => {
    console.info(`${signal} received. Shutting down gracefully.`);
    server.close(async (error) => {
      if (error) {
        console.error('HTTP server shutdown failed:', error);
        process.exitCode = 1;
      }

      await disconnectDatabase();
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});
