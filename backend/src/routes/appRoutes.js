/**
 * App Routes
 * Handles app listing, filtering, and searching
 */

import express from 'express';
import {
  getAllAppsHandler,
  getAppsByCategories,
  getCategoriesHandler,
  searchApps,
  getPremiumAppsHandler
} from '../controllers/appController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes use optional auth to show premium apps if logged in
router.get('/', optionalAuth, getAllAppsHandler);
router.get('/categories', getCategoriesHandler);
router.get('/category/:category', getAppsByCategories);
router.get('/search', optionalAuth, searchApps);
router.get('/premium', optionalAuth, getPremiumAppsHandler);

export default router;
