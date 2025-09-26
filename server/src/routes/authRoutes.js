import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import { register, login, getProfile, updatePreferences } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { setupGoogleStrategy } from '../services/googleOAuth.js';
import { signToken } from '../utils/jwt.js';

// Initialize router and Google OAuth strategy once
setupGoogleStrategy();
const router = express.Router();

// Registration
router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

// Login
router.post(
  '/login',
  [body('email').isEmail(), body('password').isString().isLength({ min: 6 })],
  login
);

// Profile
router.get('/me', requireAuth, getProfile);
router.put('/preferences', requireAuth, updatePreferences);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = signToken(req.user.id);
    // Redirect to frontend with token in URL params
    const redirectBase = process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173';
    const url = new URL('/oauth-success', redirectBase);
    url.searchParams.set('token', token);
    res.redirect(url.toString());
  }
);

export default router;


