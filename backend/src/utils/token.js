/**
 * Token Utilities
 * Handles secure token generation and validation
 */

import crypto from 'crypto';

/**
 * Generate a secure random token
 */
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a token for storage
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verify a token against its hash
 */
export const verifyTokenHash = (token, hash) => {
  const newHash = crypto.createHash('sha256').update(token).digest('hex');
  return newHash === hash;
};

/**
 * Generate download link from token
 */
export const generateDownloadLink = (token) => {
  return `${process.env.API_URL || 'http://localhost:5000'}/api/config/${token}`;
};

/**
 * Get token expiry time
 */
export const getTokenExpiry = () => {
  const expiryMinutes = parseInt(process.env.TOKEN_EXPIRY_MINUTES || 10);
  return new Date(Date.now() + expiryMinutes * 60000);
};
