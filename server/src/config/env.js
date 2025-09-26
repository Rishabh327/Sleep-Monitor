import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

// Provide dev-safe defaults to reduce setup friction
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017';
}
if (!process.env.MONGO_DB_NAME) {
  process.env.MONGO_DB_NAME = 'sleep_monitor';
}
if (!process.env.JWT_SECRET) {
  // Ephemeral dev secret; replace in production via .env
  process.env.JWT_SECRET = 'dev_only_replace_in_production_' + Math.random().toString(36).slice(2);
}

// Set the API key for the chatbot
if (!process.env.GEMINI_API_KEY) {
  process.env.GEMINI_API_KEY = 'sk-bf725748416143d88b7ea444d68f0c90';
}

export default process.env;


