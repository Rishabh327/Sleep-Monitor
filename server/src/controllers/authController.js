import { validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

// Register a new user with email/password
export async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences } });
  } catch (err) {
    next(err);
  }
}

// Login existing user
export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences } });
  } catch (err) {
    next(err);
  }
}

// Profile get/update
export async function getProfile(req, res, next) {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const { preferredSleepDurationHours, remindersEnabled, reminderTime, theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'preferences.preferredSleepDurationHours': preferredSleepDurationHours,
          'preferences.remindersEnabled': remindersEnabled,
          'preferences.reminderTime': reminderTime,
          'preferences.theme': theme,
        },
      },
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// Google OAuth handlers will be implemented using Passport strategy in routes


