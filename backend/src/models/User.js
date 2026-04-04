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
  // Email verification fields
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpiry: {
    type: Date,
    select: false
  },
  // User profile fields
  phone: {
    type: String,
    default: null
  },
  avatarUrl: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  country: {
    type: String,
    default: null
  },
  // Activity tracking
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  // Preferences
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  // Admin flag
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

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = async function() {
  const crypto = await import('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await this.save();
  return verificationToken;
};

// Method to verify email token
userSchema.methods.verifyEmailToken = async function(token) {
  const crypto = await import('crypto');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  if (this.emailVerificationToken !== hashedToken) {
    return false;
  }
  
  if (this.emailVerificationExpiry < Date.now()) {
    return false;
  }
  
  this.emailVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpiry = undefined;
  await this.save();
  return true;
};

const User = mongoose.model('User', userSchema);
export default User;
