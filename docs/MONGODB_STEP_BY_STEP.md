# 🚀 MongoDB Timeout Fix - Step by Step Guide

## Problem Summary
You're seeing this error when generating configurations:
```
MongooseError: Operation `configurations.insertOne()` buffering timed out after 10000ms
```

This means your backend can't connect to MongoDB Atlas after 10 seconds. **We've fixed this!**

---

## ✅ What We've Already Fixed

1. **database.js** - Increased MongoDB timeouts from 5s to 30s
2. **configController.js** - Added timeout detection (15s limit)
3. **Created test-db.js** - Diagnostic tool to check your connection
4. **Created health-check.ps1** - Full health check script
5. **Updated package.json** - Added convenient npm commands

---

## 🔧 Step-by-Step Fix Process

### Step 1: Run Health Check (FIRST!)
This shows you the exact problem:

```bash
cd backend
npm run health-check
```

**What to look for:**
- ✅ Node.js version shown
- ✅ .env file with MONGODB_URI
- ✅ Dependencies installed
- ✅ MongoDB connection successful

If any step fails, jump to **Troubleshooting** below.

### Step 2: Run Connection Diagnostics
Even more detailed testing:

```bash
npm run test-db
```

This tests:
- DNS resolution for MongoDB Atlas
- Actual connection attempt
- Database operations (insert, find, delete)

**Common results:**
- ✅ All green = Your setup is correct, move to Step 3
- ❌ DNS fails = Internet/firewall issue
- ❌ Connection fails = MongoDB cluster or whitelist issue
- ❌ Operations fail = Authentication issue

### Step 3: Restart Backend
After fixes are applied:

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
✅ Database connected
```

### Step 4: Test Configuration Generation
Try the API that was failing:

```bash
curl -X POST http://localhost:5000/api/config \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}'
```

Or use the frontend to generate a config. Should work now! ✨

---

## 🔍 Troubleshooting

### "Timeout - Could not connect"
**Issue**: Connection taking too long (over 10-30 seconds)

**Fixes** (in order):
1. Check MongoDB Atlas **Cluster is RUNNING** (not Paused)
   - Log in to MongoDB Atlas
   - View Clusters page
   - If it says "Paused", click "Resume"

2. Check your **IP is Whitelisted**
   - Go to MongoDB Atlas → Network Access
   - Add your current IP (or 0.0.0.0/0 for development)
   - Save and wait 5 minutes for changes to apply

3. Check your **Connection String**
   - In `.env`, verify MONGODB_URI looks like:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
   - Special characters in password must be URL encoded

### "Authentication failed"
**Issue**: Wrong username/password or insufficient permissions

**Fixes**:
1. Reset your MongoDB Atlas password
   - In MongoDB Atlas → Database Access
   - Select your user → Edit
   - Change password
   - Update `.env` with new password

2. Create new database user
   - MongoDB Atlas → Database Access → Add New Database User
   - Give it readWrite permissions on all databases
   - Use that user in connection string

### "Cannot find database"
**Issue**: Database name in connection string is wrong

**Fixes**:
1. Check connection string matches your database name
2. In MongoDB Atlas, the database appears under Collections
3. Update `.env` with correct database name

### "Port already in use"
**Issue**: Something else is running on port 5000

**Fixes**:
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with the number shown)
taskkill /PID <PID> /F

# Then restart backend
npm run dev
```

---

## 📋 Configuration Files Modified

### 1. `backend/src/config/database.js`
Increased timeouts for MongoDB Atlas:
```javascript
serverSelectionTimeoutMS: 30000,  // Atlas needs 30s
socketTimeoutMS: 45000,           // Socket timeout
connectTimeoutMS: 30000,          // Connection timeout
bufferMaxEntries: 0,              // Fail fast if no connection
maxPoolSize: 10,                  // Connection pool
minPoolSize: 5
```

### 2. `backend/src/controllers/configController.js`
Added timeout wrapper to detect failures:
```javascript
const config = await Promise.race([
  Configuration.create({...}),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Database operation timeout')), 15000)
  )
]);
```

### 3. `backend/scripts/test-db.js` (NEW)
Diagnostic tool that tests:
- Connection to MongoDB
- Database operations
- Timeout detection

### 4. `backend/scripts/health-check.ps1` (NEW)
Complete system health check including:
- Node.js version
- .env configuration
- Dependencies
- MongoDB connection
- Port availability

---

## 🎯 Quick Decision Tree

```
Is MongoDB timeout error happening?
├─ YES → Run "npm run health-check"
│   ├─ ❌ DNS fails → Network/firewall issue
│   ├─ ❌ Connection fails → MongoDB cluster or IP whitelist
│   ├─ ❌ Operations fail → Authentication issue
│   └─ ✅ All pass → Restart backend with "npm run dev"
│
└─ NO → Specific error shown?
    ├─ Error 401/403 → Authentication problem
    ├─ Error 500 → Check backend logs
    └─ No error → Working! 🎉
```

---

## 📞 Still Having Issues?

### Check logs for more details:
```bash
# See detailed backend logs
npm run dev

# In another terminal, test the connection
npm run test-db
```

### Verify MongoDB Atlas settings:
1. **Cluster Status**: Must be "RUNNING" (green)
2. **IP Whitelist**: Your IP must be added or 0.0.0.0/0
3. **Database User**: Must exist and have correct permissions
4. **Connection String**: Must include username:password and database name
5. **Special Characters**: If password has @, :, or /, must be URL encoded

### Common Special Character Encodings:
- `@` → `%40`
- `:` → `%3A`
- `!` → `%21`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `'` → `%27`
- `(` → `%28`
- `)` → `%29`
- `*` → `%2A`
- `+` → `%2B`
- `/` → `%2F`
- `?` → `%3F`

**Example**: If password is `P@ss!word`, use `P%40ss%21word` in the URI

---

## ✨ Success Indicator

When everything is working, you should see:
1. ✅ `health-check` command shows all green
2. ✅ `test-db` connects and performs operations
3. ✅ Backend starts with "✅ Database connected"
4. ✅ Configuration generation works via API or frontend

---

## 📚 Additional Resources

- [MongoDB Atlas Network Access](https://www.mongodb.com/docs/atlas/security-network/)
- [MongoDB Connection String URI](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Mongoose Connection Options](https://mongoosejs.com/docs/connections.html)
- [Express.js Error Handling](https://expressjs.com/en/guide/error-handling.html)

---

**Questions?** Check the logs, run `npm run test-db`, and use the decision tree above!
