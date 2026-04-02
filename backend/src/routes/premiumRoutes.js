/**
 * Premium Routes
 * Handles all premium subscription and feature endpoints
 */

import express from 'express';
import {
  getPremiumFeaturesHandler,
  getPremiumStatusHandler,
  getPremiumServicesHandler,
  upgradeSubscriptionHandler,
  cancelSubscriptionHandler,
  getPricingHandler
} from '../controllers/premiumController.js';
import { protect as authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/pricing', getPricingHandler);
router.get('/services', getPremiumServicesHandler);

// Protected routes (require authentication)
router.get('/features', authenticate, getPremiumFeaturesHandler);
router.get('/status', authenticate, getPremiumStatusHandler);
router.post('/upgrade', authenticate, upgradeSubscriptionHandler);
router.post('/cancel', authenticate, cancelSubscriptionHandler);

export default router;
