import mongoose from 'mongoose';

const sleepLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sleepStart: { type: Date, required: true },
    sleepEnd: { type: Date, required: true },
    mood: { type: String, enum: ['very_bad', 'bad', 'neutral', 'good', 'very_good'], default: 'neutral' },
    caffeine: { type: Number, default: 0 }, // mg
    disturbances: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SleepLog = mongoose.model('SleepLog', sleepLogSchema);


