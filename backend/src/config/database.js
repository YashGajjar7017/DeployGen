/**
 * Database Configuration
 * Handles MongoDB connection with retry logic and health checks
 */

import mongoose from 'mongoose';

// Track connection state
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Store connection state
let dbConnectionState = {
  connected: false,
  lastError: null,
  lastConnectTime: null,
  connectionAttempts: 0,
};

const connectDB = async (retryCount = 0) => {
  try {
    // Use MongoDB URI from env, or fallback to local MongoDB instance
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/app-manager";
    
    console.log(`\n📡 Attempting MongoDB connection... (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    console.log('Connection URI:', mongoUri.replace(/:[^@]*@/, ':****@')); // Hide password in logs
    
    const conn = await mongoose.connect(mongoUri, {
      // Connection settings
      serverSelectionTimeoutMS: 15000,  // Timeout for server selection
      socketTimeoutMS: 45000,            // Keep socket timeout
      connectTimeoutMS: 15000,           // Add connect timeout
      
      // Write settings
      retryWrites: true,
      w: 'majority',
      
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });
    
    dbConnectionState.connected = true;
    dbConnectionState.lastConnectTime = new Date();
    dbConnectionState.connectionAttempts = retryCount + 1;
    dbConnectionState.lastError = null;
    
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);
    
    // Setup connection event listeners
    setupConnectionListeners();
    
    return conn;
  } catch (error) {
    dbConnectionState.lastError = error.message;
    
    console.error(`\n❌ MongoDB Connection Error (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.error(`\n⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    }
    
    // After max retries, show troubleshooting
    console.error('\n⚠️  MongoDB Connection Failed - Troubleshooting Steps:');
    console.error('   1. Check MONGODB_URI in .env file');
    console.error('   2. Verify MongoDB is running:');
    console.error('      - Local: mongosh or mongo shell');
    console.error('      - Atlas: Check cluster status at mongodb.com');
    console.error('   3. Check network connectivity:');
    console.error('      - npm run test-db');
    console.error('      - ping mongodb.com (for Atlas)');
    console.error('   4. Verify IP whitelist in MongoDB Atlas');
    console.error('   5. Check credentials in connection string');
    console.error('   6. Test with local MongoDB if using Atlas\n');
    
    throw error;
  }
};

// Setup connection event listeners
const setupConnectionListeners = () => {
  mongoose.connection.on('connected', () => {
    dbConnectionState.connected = true;
    console.log('📡 Mongoose connected to MongoDB');
  });

  mongoose.connection.on('disconnected', () => {
    dbConnectionState.connected = false;
    console.warn('⚠️  Mongoose disconnected from MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    dbConnectionState.connected = false;
    dbConnectionState.lastError = err.message;
    console.error('❌ MongoDB Connection Error:', err.message);
  });

  mongoose.connection.on('reconnected', () => {
    dbConnectionState.connected = true;
    console.log('✅ Mongoose reconnected to MongoDB');
  });
};

// Export health check function
export const getDBStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    readyStateString: getReadyStateString(mongoose.connection.readyState),
    ...dbConnectionState,
    models: mongoose.connection.modelNames(),
  };
};

// Helper to convert readyState to string
const getReadyStateString = (state) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
};

export default connectDB;
