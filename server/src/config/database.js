import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  mongoose.connection.on('connected', () => {
    console.info('MongoDB connection established.');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

export function getDatabaseState() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] ?? 'unknown';
}
