import { SleepLog } from '../models/SleepLog.js';
import { BotSession } from '../models/BotSession.js';
import { analyzeSleepLogs } from '../services/analysisService.js';
import { buildWellnessPrompt, getGeminiAdvice } from '../services/geminiService.js';

// Handle a chat message to the Wellness Bot
export async function askWellnessBot(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Load recent logs for context
    const to = new Date();
    const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
    const logs = await SleepLog.find({ userId: req.user._id, sleepStart: { $gte: from, $lte: to } })
      .sort({ sleepStart: -1 })
      .limit(7);

    const analysis = analyzeSleepLogs(logs);
    const prompt = buildWellnessPrompt(logs, analysis) + `\n\nUser says: ${message}`;
    const advice = await getGeminiAdvice(prompt);

    // Save to bot session history
    const session = await BotSession.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          history: { $each: [{ role: 'user', content: message }, { role: 'assistant', content: advice }] },
        },
      },
      { upsert: true, new: true }
    );

    res.json({ reply: advice, analysis, history: session.history.slice(-20) });
  } catch (err) {
    next(err);
  }
}

// Get recent chat history
export async function getBotHistory(req, res, next) {
  try {
    const session = await BotSession.findOne({ userId: req.user._id });
    res.json({ history: session?.history?.slice(-50) || [] });
  } catch (err) {
    next(err);
  }
}


