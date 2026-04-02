# MongoDB Connection Timeout - Troubleshooting Guide

## Problem
You're experiencing this error:
```
MongooseError: Operation `configurations.insertOne()` buffering timed out after 10000ms
```

This means **Mongoose cannot connect to MongoDB**, and after 10 seconds of trying to send the operation, it gives up.

---

## Solution Summary

✅ **Fixed**: Updated `database.js` with proper timeout settings for MongoDB Atlas  
✅ **Fixed**: Added better error handling in `configController.js`  
✅ **Added**: Diagnostic tool to test your connection

---

## Quick Diagnosis

Run this command to test your MongoDB connection:

```bash
cd backend
npm run test-db
```

This will tell you exactly what's wrong and how to fix it.

---

## Common Issues & Fixes

### 1. **MongoDB Atlas Cluster is Paused**

**Symptom**: Timeout errors, connection refused

**Fix**:
1. Go to https://cloud.mongodb.com
2. Click on your cluster name
3. Click **Resume** button if it shows "Paused"
4. Wait 2-3 minutes for cluster to start
5. Try connection again

---

### 2. **IP Address Not Whitelisted**

**Symptom**: "connection timeout" or "host unreachable"

**Fix**:
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** (left sidebar)
3. Click **+ Add IP Address**
4. Choose one of:
   - **Add Current IP** (if you're at home/office)
   - **Add 0.0.0.0/0** (allow all IPs - for development only)
5. Click **Confirm**
6. Wait a few minutes for changes to propagate
7. Try again

---

### 3. **Wrong Connection String**

**Symptom**: "authentication failed" or "invalid credentials"

**Fix**:
1. Go to MongoDB Atlas → **Databases** → Click **Connect**
2. Choose **Drivers** → **Node.js**
3. Copy the connection string
4. Open `.env` in your backend folder
5. Replace the `MONGODB_URI` value
6. Make sure to **replace `<password>` with your actual password**

Example:
```
MONGODB_URI="mongodb+srv://username:actualPassword@cluster.mongodb.net/?retryWrites=true&w=majority"
```

---

### 4. **Special Characters in Password**

**Symptom**: "authentication failed"

**Fix**:
If your MongoDB password contains special characters like `@`, `#`, `!`, etc., you need to **URL encode** them:

- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- `:` → `%3A`
- `/` → `%2F`

Example:
```
Password: myP@ssw#rd!
Encoded: myP%40ssw%23rd%21

MONGODB_URI="mongodb+srv://user:myP%40ssw%23rd%21@cluster.mongodb.net/..."
```

Use this tool: https://www.urlencoder.org/

---

### 5. **No Internet Connection**

**Symptom**: DNS resolution fails, immediate timeout

**Fix**:
1. Check internet connection: `ping 8.8.8.8`
2. Check if your network needs a proxy
3. Check firewall settings (allow Node.js outbound connections)
4. Try using a different network (mobile hotspot)

---

### 6. **MongoDB Service Not Running (Local)**

**Symptom**: "connect ECONNREFUSED 127.0.0.1:27017"

**Fix**:

**Windows:**
```powershell
# Start MongoDB
net start MongoDB

# Or if installed as service
sc start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Verify it's running:**
```bash
# Windows
netstat -an | findstr :27017

# macOS/Linux
lsof -i :27017
```

---

## Updated Configuration Explanation

The `database.js` file has been updated with better settings:

```javascript
serverSelectionTimeoutMS: 30000    // 30s timeout (up from 5s)
socketTimeoutMS: 45000              // 45s socket timeout
connectTimeoutMS: 30000             // 30s connect timeout
bufferMaxEntries: 0                 // Don't buffer if disconnected
maxPoolSize: 10                     // Connection pool size
minPoolSize: 5                      // Minimum connections
```

These settings are optimal for:
- **MongoDB Atlas** (cloud database)
- **Network latency**
- **Cold server startups**

---

## Error Handling Improvements

The `configController.js` has been updated to:
1. Add explicit timeout wrapper (15 seconds max)
2. Detect timeout errors vs other DB errors
3. Return proper HTTP 503 (Service Unavailable) for temporary issues
4. Provide better error messages in development mode
5. Don't fail the entire request if analytics logging fails

---

## Step-by-Step Debugging

### Step 1: Test DB Connection
```bash
cd backend
npm run test-db
```

Check the output:
- ✅ Shows which MongoDB endpoint you're connecting to
- ✅ Tests DNS resolution (for Atlas)
- ✅ Tests actual connection
- ✅ Tests Insert/Find/Delete operations

### Step 2: Check Environment Variables
```bash
# Verify .env file exists
ls .env

# Check MONGODB_URI is set
echo %MONGODB_URI%     # Windows
echo $MONGODB_URI      # macOS/Linux
```

### Step 3: Test Connection in Node
```bash
# Start Node REPL
node

# Paste this:
import mongoose from 'mongoose';
const uri = "your_mongodb_uri_here";
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
});

mongoose.connection.on('connected', () => console.log('✅ Connected'));
mongoose.connection.on('error', (err) => console.log('❌ Error:', err.message));

// Wait 15 seconds
```

### Step 4: Check Logs
```bash
# Start backend with debug info
NODE_ENV=development npm run dev

# Look for:
# - Connection attempts
# - Timeout messages  
# - Authentication errors
```

---

## API Testing

Once connected, test the config generation endpoint:

```bash
# Get all apps
curl http://localhost:5000/api/apps

# Should return: list of applications

# Test token generation (if authenticated)
curl -X POST http://localhost:5000/api/config/generate \
  -H "Content-Type: application/json" \
  -d '{"selectedAppIds": ["vs-code"], "configName": "Dev Setup"}'

# Should return: token and download link
```

---

## MongoDB Atlas Setup Checklist

- [ ] Cluster is **Running** (not Paused)
- [ ] Your IP is **Whitelisted** in Network Access
- [ ] Connection string has correct **username**
- [ ] Connection string has correct **password** (URL encoded if needed)
- [ ] Connection string has correct **cluster name**
- [ ] `.env` file has correct `MONGODB_URI`
- [ ] Database exists (will auto-create on first write)

---

## Useful Commands

```bash
# Test connection
npm run test-db

# Start server in dev mode (shows all logs)
npm run dev

# Start server in production mode
npm start

# Check what ports are listening
netstat -ltn | grep 27017      # MongoDB
netstat -ltn | grep 5000       # Backend API
```

---

## Still Having Issues?

1. **Run `npm run test-db`** - This will tell you exactly what's wrong
2. **Check MongoDB Atlas status page** - https://status.mongodb.com
3. **Review logs carefully** - Look for specific error messages
4. **Try this test locally first:**
   ```bash
   # Use local MongoDB
   MONGODB_URI="mongodb://localhost:27017/app-manager" npm run test-db
   ```

---

## Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Connection String Reference](https://docs.mongodb.com/manual/reference/connection-string)
- [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html)
- [Node.js MongoDB Driver](https://www.mongodb.com/docs/drivers/node)

---

## Summary of Changes Made

| File | Change | Purpose |
|------|--------|---------|
| `database.js` | Increased timeouts to 30s | Support Atlas connections |
| `database.js` | Added `bufferMaxEntries: 0` | Fail fast on disconnect |
| `configController.js` | Added timeout wrapper | Detect connection timeouts |
| `configController.js` | Improved error messages | Better debugging |
| `test-db.js` (new) | Diagnostic tool | Test MongoDB connection |
| `package.json` | Added `test-db` script | Easy running of diagnostic |

---

**Your changes are ready!** Start the backend and run `npm run test-db` to verify everything works. 🚀
