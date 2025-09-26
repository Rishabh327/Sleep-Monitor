import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

// Authenticate requests using Bearer token or cookie token
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.replace('Bearer ', '')
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
}


