/**
 * MaintenanceConfig Model
 * Handles system maintenance mode settings
 */

import mongoose from 'mongoose';

const maintenanceConfigSchema = new mongoose.Schema({
  isEnabled: {
    type: Boolean,
    default: false,
    index: true,
  },
  message: {
    type: String,
    default: 'System is under scheduled maintenance',
  },
  startTime: {
    type: Date,
    default: new Date(),
  },
  endTime: {
    type: Date,
    default: new Date(Date.now() + 3600000), // 1 hour from now
  },
  reason: {
    type: String,
    default: 'Scheduled maintenance',
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const MaintenanceConfig = mongoose.model('MaintenanceConfig', maintenanceConfigSchema);

export default MaintenanceConfig;
