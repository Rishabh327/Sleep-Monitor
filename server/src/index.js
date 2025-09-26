import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/env.js';
import { connectToDatabase } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import sleepLogRoutes from './routes/sleepLogRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import botRoutes from './routes/botRoutes.js';
import exportRoutes from './routes/exportRoutes.js';

// Initialize Express app
const app = express();

// Security and middleware
app.use(helmet());
const isProd = process.env.NODE_ENV === 'production';
const defaultDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const envOrigins = process.env.CLIENT_URL?.split(',').map((s) => s.trim()).filter(Boolean);
const allowedOrigins = envOrigins?.length ? envOrigins : defaultDevOrigins;
app.use(
  cors({
    origin: isProd ? allowedOrigins : true, // allow all in dev
    credentials: true,
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/sleeplogs', sleepLogRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/export', exportRoutes);

// 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });


