/**
 * Database Configuration
 * Handles MongoDB connection and setup
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://yashacker:Iamyash@reactdb.d04du.mongodb.net/?retryWrites=true&w=majority&appName=ReactDB" || process.env.MONGODB_URI);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    // process.exit(1);
  }
};

export default connectDB;
