/**
 * App Controller
 * Handles app listing, filtering, and information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appsPath = path.join(__dirname, '../../apps.json');
let APPS_DATABASE;

const loadApps = () => {
  try {
    const data = fs.readFileSync(appsPath, 'utf8');
    APPS_DATABASE = JSON.parse(data);
  } catch (error) {
    console.error('Failed to load apps.json:', error);
    APPS_DATABASE = [];
  }
};

loadApps();

/**
 * Get all available apps
 * GET /api/apps
 */
export const getAllAppsHandler = async (req, res) => {
  try {
    const userIsPremium = req.user ? req.user.isPremiumValid() : false;
const apps = userIsPremium ? APPS_DATABASE : APPS_DATABASE.filter(app => !app.premium);

    res.status(200).json({
      success: true,
      count: apps.length,
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
 * Get apps by category
 * GET /api/apps/category/:category
 */
export const getAppsByCategories = async (req, res) => {
  try {
    const { category } = req.params;
const apps = APPS_DATABASE.filter(app => app.category === category);

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
const categories = [...new Set(APPS_DATABASE.map(app => app.category))];

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
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
const allApps = userIsPremium ? APPS_DATABASE : APPS_DATABASE.filter(app => !app.premium);

    const searchTerm = q.toLowerCase();
    const results = allApps.filter(app =>
      app.name.toLowerCase().includes(searchTerm) ||
      app.category.toLowerCase().includes(searchTerm) ||
      app.id.toLowerCase().includes(searchTerm)
    );

    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
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

const premiumApps = APPS_DATABASE.filter(app => app.premium);

    res.status(200).json({
      success: true,
      count: premiumApps.length,
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
