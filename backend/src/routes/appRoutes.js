/**
 * App Routes
 * Handles app listing, filtering, and searching with version history
 */

import express from 'express';
import {
  getAllAppsHandler,
  getAppsByCategories,
  getCategoriesHandler,
  searchApps,
  getPremiumAppsHandler,
  getFeaturedAppsHandler,
  getAppDetailHandler,
  getAppVersionsHandler
} from '../controllers/appController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// List routes
router.get('/', optionalAuth, getAllAppsHandler);          // All apps
router.get('/featured', optionalAuth, getFeaturedAppsHandler); // Featured apps
router.get('/categories', getCategoriesHandler);           // All categories
router.get('/premium', optionalAuth, getPremiumAppsHandler); // Premium apps
router.get('/search', optionalAuth, searchApps);           // Search apps

// App detail routes (must come after specific routes)
router.get('/:slug', optionalAuth, getAppDetailHandler);   // Single app with versions
router.get('/:slug/versions', optionalAuth, getAppVersionsHandler); // Version history

// Category route (specify after slug routes to avoid conflicts)
router.get('/category/:category', getAppsByCategories);

export default router;
