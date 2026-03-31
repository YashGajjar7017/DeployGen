import jwt from 'jsonwebtoken';

export const generateJWT = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
  } catch (error) {
    return null;
  }
};

export const decodeJWT = (token) => {
  return jwt.decode(token);
};