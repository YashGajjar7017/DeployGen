/**
 * Database Configuration
 * Handles MongoDB connection and setup
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MongoDB URI from env, or fallback to local MongoDB instance
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/app-manager";
    
    const conn = await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.error('Attempted URI:', process.env.MONGODB_URI || "mongodb://localhost:27017/app-manager");
    // Don't exit - allow server to start but requests will fail gracefully
    throw error;
  }
};

export default connectDB;
