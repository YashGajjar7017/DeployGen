import crypto from 'crypto';

export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyTokenHash = (token, hash) => {
  const newHash = crypto.createHash('sha256').update(token).digest('hex');
  return newHash === hash;
};

export const generateDownloadLink = (token) => {
  return `${process.env.API_URL || 'http://localhost:8000'}/api/config/${token}`;
};

export const getTokenExpiry = () => {
  const expiryMinutes = parseInt(process.env.TOKEN_EXPIRY_MINUTES || 10);
  return new Date(Date.now() + expiryMinutes * 60000);
};
