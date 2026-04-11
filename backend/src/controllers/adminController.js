/**
 * Admin Controller
 * Handles admin-specific operations like maintenance mode and app management
 */

import MaintenanceConfig from '../models/MaintenanceConfig.js';
import App from '../models/App.js';
import mongoose from 'mongoose';

/**
 * Get maintenance status
 * GET /api/admin/maintenance
 */
export const getMaintenanceStatus = async (req, res) => {
  try {
    let maintenance = await MaintenanceConfig.findOne();
    
    if (!maintenance) {
      // Create default maintenance config if it doesn't exist
      maintenance = await MaintenanceConfig.create({
        isEnabled: false,
        message: 'System is under scheduled maintenance',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
      });
    }

    res.json({
      success: true,
      ...maintenance.toObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update maintenance status
 * PUT /api/admin/maintenance
 */
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { isEnabled, message, startTime, endTime, reason } = req.body;

    let maintenance = await MaintenanceConfig.findOne();

    if (!maintenance) {
      maintenance = new MaintenanceConfig();
    }

    if (isEnabled !== undefined) maintenance.isEnabled = isEnabled;
    if (message) maintenance.message = message;
    if (startTime) maintenance.startTime = new Date(startTime);
    if (endTime) maintenance.endTime = new Date(endTime);
    if (reason) maintenance.reason = reason;
    if (req.user) maintenance.createdBy = req.user._id;

    await maintenance.save();

    res.json({
      success: true,
      ...maintenance.toObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all apps (admin)
 * GET /api/admin/apps
 */
export const getAllAppsAdmin = async (req, res) => {
  try {
    const apps = await App.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      apps,
      total: apps.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create new app
 * POST /api/admin/apps
 */
export const createApp = async (req, res) => {
  try {
    const { name, description, category, downloadUrl, currentVersion, size, icon, homepage, publisher } = req.body;

    // Validate required fields
    if (!name || !downloadUrl || !currentVersion || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, downloadUrl, currentVersion, category'
      });
    }

    // Check if app already exists
    const existingApp = await App.findOne({ name });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'An app with this name already exists'
      });
    }

    const app = new App({
      name,
      description,
      category,
      latestDownloadUrl: downloadUrl,
      currentVersion,
      size,
      icon,
      homepage,
      publisher,
      enabled: true,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      versions: [
        {
          version: currentVersion,
          downloadUrl,
          isLatest: true,
          releaseDate: new Date(),
        }
      ]
    });

    await app.save();

    res.status(201).json({
      success: true,
      message: 'App created successfully',
      app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update app
 * PUT /api/admin/apps/:id
 */
export const updateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, downloadUrl, currentVersion, size, icon, homepage, publisher, enabled } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid app ID'
      });
    }

    const app = await App.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(category && { category }),
          ...(downloadUrl && { latestDownloadUrl: downloadUrl }),
          ...(currentVersion && { currentVersion }),
          ...(size && { size }),
          ...(icon && { icon }),
          ...(homepage && { homepage }),
          ...(publisher && { publisher }),
          ...(enabled !== undefined && { enabled }),
          updatedAt: new Date(),
        }
      },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    res.json({
      success: true,
      message: 'App updated successfully',
      app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete app
 * DELETE /api/admin/apps/:id
 */
export const deleteApp = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid app ID'
      });
    }

    const app = await App.findByIdAndDelete(id);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    res.json({
      success: true,
      message: 'App deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
