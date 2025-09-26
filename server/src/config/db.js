import mongoose from 'mongoose';

// Connect to MongoDB using the provided connection string
export async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || 'sleep_monitor',
  });
  console.log('Connected to MongoDB');
}


