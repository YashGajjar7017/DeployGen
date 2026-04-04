/**
 * App Controller
 * Handles app listing, filtering, and information with MongoDB support
 * Falls back to apps.json if database is not available
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import App from '../models/App.js';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appsPath = path.join(__dirname, '../../apps.json');
let APPS_DATABASE = [];

const loadApps = () => {
  try {
    const data = fs.readFileSync(appsPath, 'utf8');
    APPS_DATABASE = JSON.parse(data);
    console.log(`✓ Loaded ${APPS_DATABASE.length} apps from apps.json`);
  } catch (error) {
    console.error('⚠️  Failed to load apps.json:', error.message);
    APPS_DATABASE = [];
  }
};

loadApps();

// Check if MongoDB is available
const isMongoDBAvailable = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get all available apps
 * GET /api/apps
 */
export const getAllAppsHandler = async (req, res) => {
  try {
    const userIsPremium = req.user ? req.user.isPremiumValid() : false;
    
    let apps;

    // Try MongoDB first
    if (isMongoDBAvailable()) {
      try {
        const query = { enabled: true };
        if (!userIsPremium) {
          query.premium = false;
        }
        
        apps = await App.find(query).sort('name');
        
        return res.status(200).json({
          success: true,
          count: apps.length,
          source: 'mongodb',
          apps
        });
      } catch (dbError) {
        console.warn('MongoDB query failed, falling back to JSON:', dbError.message);
      }
    }

    // Fallback to apps.json
    apps = userIsPremium ? APPS_DATABASE : APPS_DATABASE.filter(app => !app.premium);

    res.status(200).json({
      success: true,
      count: apps.length,
      source: 'json',
      warning: isMongoDBAvailable() ? null : 'Using JSON fallback - MongoDB not available',
      apps
    });
  } catch (error) {
    console.error('Get apps error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch apps'
    });
  }
};

/**
 * Get single app with version history
 * GET /api/apps/:slug
 */
export const getAppDetailHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    if (isMongoDBAvailable()) {
      try {
        const app = await App.findOne(
          { slug, enabled: true },
          { versions: { $slice: -10 } } // Last 10 versions
        );

        if (!app) {
          return res.status(404).json({
            success: false,
            message: 'App not found'
          });
        }

        return res.status(200).json({
          success: true,
          source: 'mongodb',
          app
        });
      } catch (dbError) {
        console.warn('MongoDB query failed, trying JSON fallback:', dbError.message);
      }
    }

    // Fallback to apps.json
    const app = APPS_DATABASE.find(a => a.id === slug || a.name.toLowerCase().replace(/\s+/g, '-') === slug);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    res.status(200).json({
      success: true,
      source: 'json',
      app
    });
  } catch (error) {
    console.error('Get app detail error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch app'
    });
  }
};

/**
 * Get app versions
 * GET /api/apps/:slug/versions
 */
export const getAppVersionsHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!isMongoDBAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Version history is only available when MongoDB is connected'
      });
    }

    const app = await App.findOne({ slug, enabled: true });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    res.status(200).json({
      success: true,
      appName: app.name,
      currentVersion: app.currentVersion,
      count: app.versions.length,
      versions: app.versions.reverse() // Latest first
    });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch versions'
    });
  }
};

/**
 * Get apps by category
 * GET /api/apps/category/:category
 */
export const getAppsByCategories = async (req, res) => {
  try {
    const { category } = req.params;
    
    let apps;

    if (isMongoDBAvailable()) {
      try {
        apps = await App.getByCategory(category);
        
        if (apps.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'No apps found in this category'
          });
        }

        return res.status(200).json({
          success: true,
          category,
          count: apps.length,
          source: 'mongodb',
          apps
        });
      } catch (dbError) {
        console.warn('MongoDB query failed, falling back to JSON:', dbError.message);
      }
    }

    // Fallback to apps.json
    apps = APPS_DATABASE.filter(app => app.category === category);

    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No apps found in this category'
      });
    }

    res.status(200).json({
      success: true,
      category,
      count: apps.length,
      source: 'json',
      apps
    });
  } catch (error) {
    console.error('Get apps by category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch apps'
    });
  }
};

/**
 * Get all categories
 * GET /api/apps/categories
 */
export const getCategoriesHandler = async (req, res) => {
  try {
    let categories;

    if (isMongoDBAvailable()) {
      try {
        categories = await App.distinct('category', { enabled: true });
        
        return res.status(200).json({
          success: true,
          count: categories.length,
          source: 'mongodb',
          categories: categories.sort()
        });
      } catch (dbError) {
        console.warn('MongoDB query failed, falling back to JSON:', dbError.message);
      }
    }

    // Fallback to apps.json
    categories = [...new Set(APPS_DATABASE.map(app => app.category))];

    res.status(200).json({
      success: true,
      count: categories.length,
      source: 'json',
      categories: categories.sort()
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
};

/**
 * Search apps
 * GET /api/apps/search?q=keyword
 */
export const searchApps = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const userIsPremium = req.user ? req.user.isPremiumValid() : false;
    let results;

    if (isMongoDBAvailable()) {
      try {
        results = await App.searchApps(q);
        
        if (!userIsPremium) {
          results = results.filter(app => !app.premium);
        }

        return res.status(200).json({
          success: true,
          query: q,
          count: results.length,
          source: 'mongodb',
          apps: results
        });
      } catch (dbError) {
        console.warn('MongoDB search failed, falling back to JSON:', dbError.message);
      }
    }

    // Fallback to apps.json
    const allApps = userIsPremium ? APPS_DATABASE : APPS_DATABASE.filter(app => !app.premium);
    const searchTerm = q.toLowerCase();
    
    results = allApps.filter(app =>
      app.name.toLowerCase().includes(searchTerm) ||
      (app.category && app.category.toLowerCase().includes(searchTerm)) ||
      (app.id && app.id.toLowerCase().includes(searchTerm)) ||
      (app.description && app.description.toLowerCase().includes(searchTerm))
    );

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      source: 'json',
      apps: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Search failed'
    });
  }
};

/**
 * Get premium apps
 * GET /api/apps/premium
 */
export const getPremiumAppsHandler = async (req, res) => {
  try {
    if (!req.user || !req.user.isPremiumValid()) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required'
      });
    }

    let premiumApps;

    if (isMongoDBAvailable()) {
      try {
        premiumApps = await App.find(
          { premium: true, enabled: true }
        ).sort('-featured -rating');
        
        return res.status(200).json({
          success: true,
          count: premiumApps.length,
          source: 'mongodb',
          apps: premiumApps
        });
      } catch (dbError) {
        console.warn('MongoDB query failed, falling back to JSON:', dbError.message);
      }
    }

    // Fallback to apps.json
    premiumApps = APPS_DATABASE.filter(app => app.premium);

    res.status(200).json({
      success: true,
      count: premiumApps.length,
      source: 'json',
      apps: premiumApps
    });
  } catch (error) {
    console.error('Get premium apps error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch premium apps'
    });
  }
};

/**
 * Get featured apps
 * GET /api/apps/featured
 */
export const getFeaturedAppsHandler = async (req, res) => {
  try {
    let featuredApps;

    if (isMongoDBAvailable()) {
      try {
        featuredApps = await App.getFeatured();
        
        return res.status(200).json({
          success: true,
          count: featuredApps.length,
          source: 'mongodb',
          apps: featuredApps
        });
      } catch (dbError) {
        console.warn('MongoDB query failed, falling back to JSON:', dbError.message);
      }
    }

    // Fallback to apps.json
    featuredApps = APPS_DATABASE.slice(0, 6); // Get first 6 as featured

    res.status(200).json({
      success: true,
      count: featuredApps.length,
      source: 'json',
      apps: featuredApps
    });
  } catch (error) {
    console.error('Get featured apps error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch featured apps'
    });
  }
};
