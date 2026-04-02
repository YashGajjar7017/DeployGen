/**
 * Database Configuration
 * Handles MongoDB connection and setup
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MongoDB URI from env, or fallback to local MongoDB instance
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/app-manager";
    
    console.log('Connecting to MongoDB...');
    console.log('Connection URI:', mongoUri.replace(/:[^@]*@/, ':****@')); // Hide password in logs
    
    const conn = await mongoose.connect(mongoUri, {
      // Connection settings
      serverSelectionTimeoutMS: 30000,  // Increased from 5s to 30s for Atlas
      socketTimeoutMS: 45000,            // Keep socket timeout
      connectTimeoutMS: 30000,           // Add connect timeout
      
      // Write settings
      retryWrites: true,
      w: 'majority',
      
      // Buffering settings
      bufferMaxEntries: 0,               // Don't buffer operations if disconnected
      bufferTimeoutMS: 10000,            // Timeout buffered operations after 10s
      
      // Other settings
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });
    
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\n✗ MongoDB Connection Error: ${error.message}`);
    console.error('\n⚠️  Troubleshooting tips:');
    console.error('   1. Check your MONGODB_URI in .env file');
    console.error('   2. Verify MongoDB Atlas cluster is running');
    console.error('   3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)');
    console.error('   4. Verify network connectivity: npm run test-db');
    console.error('   5. For local MongoDB: ensure mongod is running\n');
    
    // Don't exit - allow server to start but requests will fail gracefully
    throw error;
  }
};

export default connectDB;
