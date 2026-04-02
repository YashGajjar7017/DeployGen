/**
 * Configuration Controller
 * Handles token generation, configuration retrieval, and setup
 */

import Configuration from '../models/Configuration.js';
import Analytics from '../models/Analytics.js';
import { generateSecureToken, hashToken, generateDownloadLink, getTokenExpiry } from '../utils/token.js';
import { getAppById, getAllApps } from '../config/apps.js';

/**
 * Generate configuration and token
 * POST /api/config/generate
 */
export const generateConfig = async (req, res) => {
  try {
    const { selectedAppIds, configName, description } = req.body;

    if (!selectedAppIds || selectedAppIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one app'
      });
    }

    // Validate app selections
    let selectedApps = [];
    let totalSize = 0;
    const userIsPremium = req.user ? req.user.isPremiumValid() : false;
    const allAvailableApps = userIsPremium ? getAllApps(true) : getAllApps(false);

    for (const appId of selectedAppIds) {
      const app = allAvailableApps.find(a => a.id === appId);
      if (!app) {
        return res.status(400).json({
          success: false,
          message: `App not found or not available: ${appId}`
        });
      }
      selectedApps.push({
        appId: app.id,
        appName: app.name,
        version: app.version
      });
      totalSize += parseInt(app.fileSize) || 50;
    }

    // Generate secure token
    const token = generateSecureToken();
    const tokenHash = hashToken(token);
    const downloadLink = generateDownloadLink(token);
    const expiresAt = getTokenExpiry();

    // Create configuration with timeout handling
    let config;
    try {
      config = await Promise.race([
        Configuration.create({
          userId: req.user ? req.user._id : null,
          token: token.substring(0, 20),
          tokenHash,
          downloadLink,
          selectedApps,
          totalFileSize: `~${totalSize}MB`,
          expiresAt,
          isOneTimeUse: true,
          configName,
          description
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database operation timeout - MongoDB may be unavailable')), 15000)
        )
      ]);
    } catch (dbError) {
      console.error('Configuration create error:', dbError.message);
      
      if (dbError.message.includes('timeout')) {
        return res.status(503).json({
          success: false,
          message: 'Database temporarily unavailable. Please try again in a few moments.',
          code: 'DB_TIMEOUT'
        });
      }
      
      throw dbError;
    }

    // Update user stats (non-critical)
    if (req.user) {
      req.user.updateOne({ $inc: { totalTokensGenerated: 1 } }).catch(err => {
        console.error('User update error:', err.message);
      });
    }

    // Log analytics (non-critical)
    Analytics.create({
      type: 'token_generated',
      userId: req.user ? req.user._id : null,
      configurationId: config._id,
      userIp: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { appCount: selectedAppIds.length }
    }).catch(err => {
      console.error('Analytics create error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Configuration generated successfully',
      config: {
        id: config._id,
        tokenPreview: token.substring(0, 10) + '***',
        fullToken: token,
        downloadLink,
        expiresAt,
        selectedAppsCount: selectedApps.length,
        totalFileSize: config.totalFileSize
      }
    });
  } catch (error) {
    console.error('Generate config error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate configuration. Please check your MongoDB connection and try again.',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        tip: 'Ensure MongoDB is running and accessible. Check .env MONGODB_URI setting.'
      })
    });
  }
};

/**
 * Get configuration by token
 * GET /api/config/:token
 */
export const getConfig = async (req, res) => {
  try {
    const { token } = req.params;

    const config = await Configuration.findOne({
      token: token.substring(0, 20)
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    // Check if token is expired
    if (new Date() > config.expiresAt) {
      return res.status(410).json({
        success: false,
        message: 'Configuration has expired'
      });
    }

    // Check one-time use
    if (config.isOneTimeUse && config.isUsed) {
      return res.status(410).json({
        success: false,
        message: 'This configuration has already been used'
      });
    }

    // Get full app details
    const appsWithDetails = config.selectedApps.map(app => {
      const fullApp = getAppById(app.appId);
      return {
        ...app,
        downloadUrl: fullApp?.downloadUrl,
        silentInstallCmd: fullApp?.silentInstallCmd
      };
    });

    // Mark as used
    config.isUsed = true;
    config.usedAt = new Date();
    config.usedIp = req.ip;
    config.downloadCount += 1;
    await config.save();

    // Log analytics
    await Analytics.create({
      type: 'config_accessed',
      configurationId: config._id,
      userIp: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { appCount: config.selectedApps.length }
    });

    res.status(200).json({
      success: true,
      config: {
        selectedApps: appsWithDetails,
        totalFileSize: config.totalFileSize,
        generatedAt: config.createdAt,
        expiresAt: config.expiresAt
      }
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch configuration'
    });
  }
};

/**
 * Get user's configurations
 * GET /api/config/user/history
 */
export const getUserConfigs = async (req, res) => {
  try {
    const configs = await Configuration.find({
      userId: req.user._id
    }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      configs: configs.map(config => ({
        id: config._id,
        configName: config.configName,
        selectedAppsCount: config.selectedApps.length,
        totalFileSize: config.totalFileSize,
        createdAt: config.createdAt,
        downloadCount: config.downloadCount,
        isExpired: new Date() > config.expiresAt
      }))
    });
  } catch (error) {
    console.error('Get user configs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch configurations'
    });
  }
};

/**
 * Delete configuration
 * DELETE /api/config/:id
 */
export const deleteConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await Configuration.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Configuration deleted successfully'
    });
  } catch (error) {
    console.error('Delete config error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete configuration'
    });
  }
};
