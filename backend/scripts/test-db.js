import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/app-manager';

console.log('\n🔍 MongoDB Connection Diagnostic Tool\n');
console.log('═'.repeat(50));

// Step 1: Display connection string (with masked password)
console.log('\n📋 Connection Information:');
const maskedUri = MONGODB_URI.replace(/:[^@]*@/, ':****@');
console.log(`   URI: ${maskedUri}`);

// Step 2: Check connection type
const isAtlas = MONGODB_URI.includes('mongodb+srv://');
console.log(`   Type: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);

// Step 3: DNS resolution test (for Atlas)
if (isAtlas) {
  console.log('\n🌐 Testing DNS Resolution:');
  const domain = MONGODB_URI.split('@')[1].split(':')[0];
  
  dns.resolve(domain, (err, addresses) => {
    if (err) {
      console.log(`   ❌ DNS Resolution Failed: ${err.message}`);
      console.log('   Possible causes:');
      console.log('   - No internet connection');
      console.log('   - DNS server issues');
      console.log('   - Firewall blocking DNS');
    } else {
      console.log(`   ✅ DNS Resolution Successful`);
      console.log(`   Resolved to: ${addresses.join(', ')}`);
      
      // Step 4: MongoDB Connection Test
      console.log('\n🔗 Testing MongoDB Connection:');
      testConnection();
    }
  });
} else {
  testConnection();
}

async function testConnection() {
  try {
    console.log('   Attempting connection...');
    console.log('   (This may take up to 15 seconds)\n');
    
    const startTime = Date.now();
    
    const conn = await Promise.race([
      mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout - MongoDB unreachable')), 15000)
      )
    ]);
    
    const duration = Date.now() - startTime;
    
    console.log('   ✅ Connection Successful!');
    console.log(`   Connected to: ${conn.connection.host}:${conn.connection.port || 27017}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Connection time: ${duration}ms`);
    
    // Test database operations
    console.log('\n📝 Testing Database Operations:');
    
    const testCollection = conn.connection.collection('__diagnostic_test__');
    
    // Insert test
    const insertResult = await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('   ✅ Insert operation successful');
    
    // Find test
    const findResult = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('   ✅ Find operation successful');
    
    // Delete test
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('   ✅ Delete operation successful');
    
    console.log('\n✅ All tests passed! MongoDB is working correctly.\n');
    console.log('═'.repeat(50) + '\n');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log(`   ❌ Connection Failed\n`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Duration: ${duration}ms\n`);
    
    console.log('═'.repeat(50));
    console.log('\n🔧 Troubleshooting Steps:\n');
    
    if (isAtlas) {
      console.log('For MongoDB Atlas:');
      console.log('  1. Verify your cluster is RUNNING');
      console.log('     → Go to mongodb.com/cloud and check cluster status');
      console.log('');
      console.log('  2. Check IP Whitelist');
      console.log('     → Atlas Dashboard → Network Access → IP Whitelist');
      console.log('     → Add your IP address or 0.0.0.0/0 for development');
      console.log('');
      console.log('  3. Verify connection string');
      console.log('     → Atlas Dashboard → Databases → Connect');
      console.log('     → Choose "Drivers" → Copy connection string');
      console.log('     → Update .env MONGODB_URI');
      console.log('');
      console.log('  4. Check credentials');
      console.log('     → Ensure username and password are URL encoded');
      console.log('     → Special characters need encoding (@ = %40, etc)');
      console.log('');
      console.log('  5. Check network');
      console.log('     → ping 8.8.8.8 (internet connectivity)');
      console.log('     → Check firewall/proxy settings');
    } else {
      console.log('For Local MongoDB:');
      console.log('  1. Verify MongoDB is installed');
      console.log('     → Run: mongod --version');
      console.log('');
      console.log('  2. Start MongoDB service');
      console.log('     Windows: net start MongoDB');
      console.log('     macOS:   brew services start mongodb-community');
      console.log('     Linux:   sudo systemctl start mongod');
      console.log('');
      console.log('  3. Check connection string');
      console.log('     → Default: mongodb://localhost:27017/app-manager');
      console.log('');
      console.log('  4. Verify MongoDB is listening');
      console.log('     → netstat -an | findstr 27017 (Windows)');
      console.log('     → lsof -i :27017 (macOS/Linux)');
    }
    
    console.log('\n📚 Resources:');
    console.log('  • MongoDB Atlas: https://docs.atlas.mongodb.com');
    console.log('  • Connection Strings: https://docs.mongodb.com/manual/reference/connection-string');
    console.log('  • Driver Connection: https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection');
    
    console.log('\n═'.repeat(50) + '\n');
    
    process.exit(1);
  }
}

const startTime = Date.now();
