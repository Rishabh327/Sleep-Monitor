import jwt from 'jsonwebtoken';

// Generate JWT for a user id
export function signToken(userId) {
  const payload = { sub: userId };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

// Verify JWT and return payload or throw
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}


