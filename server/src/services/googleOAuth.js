import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';

let initialized = false;

export function setupGoogleStrategy() {
  if (initialized) return;
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth not configured. Missing GOOGLE_CLIENT_ID/SECRET.');
    initialized = true;
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }
          
          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });
          if (!user) {
            user = await User.create({
              name: profile.displayName || 'Google User',
              email,
              googleId: profile.id,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          done(null, { id: user._id.toString() });
        } catch (err) {
          console.error('Google OAuth error:', err);
          done(err);
        }
      }
    )
  );
  initialized = true;
}


