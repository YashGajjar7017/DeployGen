/**
 * Configuration Routes
 * Handles token generation, configuration retrieval, and management
 */

import express from 'express';
import {
  generateConfig,
  getConfig,
  getUserConfigs,
  deleteConfig
} from '../controllers/configController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate configuration (optional auth for guests)
router.post('/generate', optionalAuth, generateConfig);

// Get configuration by token (no auth required)
router.get('/:token', getConfig);

// Protected routes
router.get('/user/history', protect, getUserConfigs);
router.delete('/:id', protect, deleteConfig);

export default router;
