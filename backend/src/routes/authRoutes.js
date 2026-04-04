/**
 * Authentication Routes
 * Handles user signup, login, and profile management
 */

import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  requestEmailVerification,
  verifyEmail,
  updateSettings,
  getSettings
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

// Email verification routes
router.post('/request-email-verification', protect, requestEmailVerification);
router.post('/verify-email', protect, verifyEmail);

// Settings routes
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

export default router;
