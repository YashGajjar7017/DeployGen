/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

import { verifyJWT } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Protect routes - requires valid JWT
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = verifyJWT(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }

    // Attach user to request
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Optional auth - doesn't require JWT but stores user if provided
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyJWT(token);
      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    } catch (error) {
      // Continue without user
    }
  }

  next();
};

/**
 * Admin only - requires premium or admin account
 */
export const adminOnly = async (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && !req.user.isPremium)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized. Admin access required.'
    });
  }
  next();
};

/**
 * Check if user is premium
 */
export const isPremium = async (req, res, next) => {
  if (!req.user || !req.user.isPremiumValid()) {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required'
    });
  }
  next();
};
