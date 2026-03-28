/**
 * Health Check Route
 */

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'App Manager API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy'
  });
});

export default router;
