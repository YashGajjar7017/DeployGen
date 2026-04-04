import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB, { getDBStatus } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appRoutes from './routes/appRoutes.js';
import configRoutes from './routes/configRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import premiumRoutes from './routes/premiumRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Store DB connection state in app
app.locals.dbConnected = false;
app.locals.getDBStatus = getDBStatus;

// ==================== MIDDLEWARE ====================

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// ==================== ROUTES ====================

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/config', configRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/premium', premiumRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// ==================== SERVER START ====================

const startServer = async () => {
  try {
    // Connect to database with proper error handling
    try {
      await connectDB();
      app.locals.dbConnected = true;
      console.log('✅ Database connection successful\n');
    } catch (dbError) {
      app.locals.dbConnected = false;
      console.warn('\n⚠️  Database connection failed');
      console.warn('The server will continue but database operations will fail.');
      console.warn('Please resolve the connection issues and restart the server.\n');
      
      // Option to exit if DB is critical (set DB_REQUIRED=true in .env)
      if (process.env.DB_REQUIRED === 'true') {
        console.error('❌ DB_REQUIRED=true - Exiting server');
        process.exit(1);
      }
    }

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Database Status: ${app.locals.dbConnected ? '✅ Connected' : '⚠️  Not Connected'}`);
      console.log(`   API Docs: GET http://localhost:${PORT}/api/health`);
      console.log(`\n📝 API Endpoints Available:`);
      console.log(`   POST   /api/auth/signup`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/profile (protected)`);
      console.log(`   GET    /api/auth/settings (protected)`);
      console.log(`   GET    /api/apps`);
      console.log(`   POST   /api/config/generate`);
      console.log(`   GET    /api/health (database status)\n`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✗ Server shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
