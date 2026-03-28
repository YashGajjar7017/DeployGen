/**
 * Admin Routes
 * Handles analytics, statistics, and admin operations
 */

import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import Analytics from '../models/Analytics.js';
import User from '../models/User.js';
import Configuration from '../models/Configuration.js';

const router = express.Router();

/**
 * Get analytics dashboard
 */
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const analytics = await Analytics.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const totalConfigs = await Configuration.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        premiumUsers,
        totalConfigs,
        analytics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get most downloaded apps
 */
router.get('/analytics/top-apps', protect, adminOnly, async (req, res) => {
  try {
    const topApps = await Analytics.aggregate([
      { $match: { type: 'app_downloaded' } },
      { $group: { _id: '$appName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      topApps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get active users
 */
router.get('/analytics/active-users', protect, adminOnly, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const activeUsers = await Analytics.aggregate([
      {
        $match: {
          userId: { $ne: null },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      },
      { $count: 'total' }
    ]);

    res.json({
      success: true,
      activeUsersInSevenDays: activeUsers[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
