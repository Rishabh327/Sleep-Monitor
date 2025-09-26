import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String }, // optional for OAuth users
    googleId: { type: String, index: true },
    preferences: {
      preferredSleepDurationHours: { type: Number, default: 8 },
      remindersEnabled: { type: Boolean, default: false },
      reminderTime: { type: String, default: '21:30' }, // HH:mm
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    },
  },
  { timestamps: true }
);

// Hash password before save if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hashed
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);


