/**
 * User Model
 * Handles user accounts, authentication, and subscriptions
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: {
    type: Date,
    default: null
  },
  totalDownloads: {
    type: Number,
    default: 0
  },
  totalTokensGenerated: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to check if premium is still valid
userSchema.methods.isPremiumValid = function() {
  return this.isPremium && this.premiumExpiry && this.premiumExpiry > new Date();
};

const User = mongoose.model('User', userSchema);
export default User;
