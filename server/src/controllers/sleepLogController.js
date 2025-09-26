import { validationResult } from 'express-validator';
import { SleepLog } from '../models/SleepLog.js';

// Create a new sleep log
export async function createSleepLog(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = {
      userId: req.user._id,
      sleepStart: new Date(req.body.sleepStart),
      sleepEnd: new Date(req.body.sleepEnd),
      mood: req.body.mood,
      caffeine: req.body.caffeine,
      disturbances: req.body.disturbances,
      notes: req.body.notes || '',
    };
    const log = await SleepLog.create(payload);
    res.status(201).json({ log });
  } catch (err) {
    next(err);
  }
}

// Get logs with optional range
export async function getSleepLogs(req, res, next) {
  try {
    const { from, to } = req.query;
    const filter = { userId: req.user._id };
    if (from || to) {
      filter.sleepStart = {};
      if (from) filter.sleepStart.$gte = new Date(from);
      if (to) filter.sleepStart.$lte = new Date(to);
    }
    const logs = await SleepLog.find(filter).sort({ sleepStart: -1 });
    res.json({ logs });
  } catch (err) {
    next(err);
  }
}

// Update a log
export async function updateSleepLog(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const update = { ...req.body };
    if (update.sleepStart) update.sleepStart = new Date(update.sleepStart);
    if (update.sleepEnd) update.sleepEnd = new Date(update.sleepEnd);
    const log = await SleepLog.findOneAndUpdate({ _id: id, userId: req.user._id }, update, { new: true });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ log });
  } catch (err) {
    next(err);
  }
}

// Delete a log
export async function deleteSleepLog(req, res, next) {
  try {
    const { id } = req.params;
    const result = await SleepLog.deleteOne({ _id: id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Log not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}


