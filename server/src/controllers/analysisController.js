import { SleepLog } from '../models/SleepLog.js';
import { analyzeSleepLogs } from '../services/analysisService.js';

// Get analysis for a date range, default last 7 days
export async function getAnalysis(req, res, next) {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

    const logs = await SleepLog.find({ userId: req.user._id, sleepStart: { $gte: from, $lte: to } }).sort({ sleepStart: -1 });
    const analysis = analyzeSleepLogs(logs);
    res.json({ analysis, logs });
  } catch (err) {
    next(err);
  }
}


