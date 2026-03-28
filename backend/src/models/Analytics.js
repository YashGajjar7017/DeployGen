/**
 * Analytics Model
 * Tracks downloads, installations, and user activity
 */

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['token_generated', 'config_accessed', 'app_downloaded', 'installation_started', 'installation_completed', 'installation_failed'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  configurationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Configuration',
    default: null
  },
  appId: String,
  appName: String,
  userIp: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: String,
  downloadSize: String,
  downloadTime: Number, // in seconds
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: 2592000 } // Auto-delete after 30 days
  }
}, { timestamps: true });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
