import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appRoutes from './routes/appRoutes.js';
import configRoutes from './routes/configRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

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
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Database: MongoDB Connected`);
      console.log(`✓ API Documentation: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('✗ Server startup error:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✗ Server shutting down...');
  process.exit(0);
});

export default app;
