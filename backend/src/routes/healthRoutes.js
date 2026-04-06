/**
 * Health Check Routes
 * Provides system and database health information
 */

import express from 'express';

const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DeployGEN API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic health check
router.get('/health', (req, res) => {
  const dbStatus = req.app.locals.getDBStatus?.();
  const healthy = dbStatus?.connected;
  
  res.status(healthy ? 200 : 503).json({
    success: true,
    status: healthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus?.connected || false,
      status: dbStatus?.readyStateString || 'unknown',
      lastError: dbStatus?.lastError || null,
    }
  });
});

// Detailed status
router.get('/health/detailed', (req, res) => {
  const dbStatus = req.app.locals.getDBStatus?.();
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    server: {
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      },
      nodeVersion: process.version,
      platform: process.platform,
    },
    database: {
      connected: dbStatus?.connected || false,
      status: dbStatus?.readyStateString || 'unknown',
      connectionAttempts: dbStatus?.connectionAttempts || 0,
      lastConnectTime: dbStatus?.lastConnectTime || null,
      lastError: dbStatus?.lastError || null,
      models: dbStatus?.models || [],
    },
    api: {
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
      }
    }
  });
});

// Database specific status
router.get('/health/db', (req, res) => {
  const dbStatus = req.app.locals.getDBStatus?.();
  const healthy = dbStatus?.connected;
  
  if (!healthy) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed',
      status: dbStatus?.readyStateString || 'unknown',
      error: dbStatus?.lastError || 'Unknown error',
      troubleshooting: [
        'Check MONGODB_URI in .env file',
        'Verify MongoDB is running (mongosh or Atlas cluster)',
        'Check network connectivity and IP whitelist',
        'Verify credentials in connection string',
        'Run: npm run test-db for diagnostics'
      ]
    });
  }
  
  res.json({
    success: true,
    message: 'Database connection healthy',
    status: 'connected',
    connectionAttempts: dbStatus.connectionAttempts,
    lastConnectTime: dbStatus.lastConnectTime,
    models: dbStatus.models || []
  });
});

export default router;
