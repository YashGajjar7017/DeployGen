/**
 * JWT Utilities
 * Handles JWT token generation and verification
 */

import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 */
export const generateJWT = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Verify JWT token
 */
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT token without verification
 */
export const decodeJWT = (token) => {
  return jwt.decode(token);
};
