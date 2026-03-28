/**
 * Configuration Model
 * Stores generated app installation configurations with tokens
 */

import mongoose from 'mongoose';
import crypto from 'crypto';

const configurationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Allow guest users
  },
  token: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  tokenHash: {
    type: String,
    required: true,
    select: false
  },
  downloadLink: {
    type: String,
    unique: true,
    required: true
  },
  selectedApps: [{
    appId: String,
    appName: String,
    version: String
  }],
  totalFileSize: String,
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete expired configs
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: Date,
  usedIp: String,
  downloadCount: {
    type: Number,
    default: 0
  },
  isOneTimeUse: {
    type: Boolean,
    default: true
  },
  configName: {
    type: String,
    default: null // Optional name for saving configs
  },
  description: String,
  scriptUrl: {
    type: String,
    default: null // URL to download PowerShell script
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

// Static method to generate secure token
configurationSchema.statics.generateToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

// Instance method to hash token
configurationSchema.methods.hashToken = function(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Instance method to verify token
configurationSchema.methods.verifyToken = function(token) {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return hash === this.tokenHash && !this.isUsed && new Date() < this.expiresAt;
};

const Configuration = mongoose.model('Configuration', configurationSchema);
export default Configuration;
