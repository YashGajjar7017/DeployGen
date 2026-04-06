# Setup & Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 16+ with npm/yarn
- Python 3.8+ with pip
- MongoDB (local or MongoDB Atlas)
- Git
- Visual Studio Code (recommended)

### Step 1: Clone & Setup
```bash
# Clone repository
git clone https://github.com/yourusername/app-manager.git
cd App_manager

# Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Step 2: Configure MongoDB
```bash
# Option A: Local MongoDB
# Install MongoDB Community and start service
mongod

# Option B: MongoDB Atlas
# 1. Create cluster at https://www.mongodb.com/cloud/atlas
# 2. Create user and get connection string
# 3. Update MONGODB_URI in backend/.env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/app-manager?retryWrites=true&w=majority
```

### Step 3: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
nano .env
# Set:
# MONGODB_URI=...
# JWT_SECRET=your-random-secret-key
# NODE_ENV=development

# Start development server
npm run dev
# Should output: ✓ Server running on http://localhost:5000
```

### Step 4: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
nano .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# Should output: ▲ Next.js started on http://localhost:3000
```

### Step 5: Windows Client Setup
```bash
cd ../windows-client

# Install Python dependencies
pip install -r requirements.txt

# Test CLI client
python src/client.py
# Or test GUI client
python src/gui_client.py
```

### Verify Setup
```bash
# Test API
curl http://localhost:5000/api

# Test Frontend
curl http://localhost:3000

# Create test user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456",
    "confirmPassword": "Test123456"
  }'
```

---

## Production Deployment

### Frontend Deployment (Vercel)

#### Option 1: Automatic from GitHub
```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Connect to Vercel
# Go to https://vercel.com/new
# Select your repository
# Vercel auto-detects it's a Next.js app

# 3. Set environment variables
# NEXT_PUBLIC_API_URL=https://api.deploygen.com/api
```

#### Option 2: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add custom domain
# Use Vercel dashboard to add domain
```

---

### Backend Deployment (Railway)

#### Setup Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Set environment variables in Railway dashboard:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
NODE_ENV=production
API_URL=https://api.deploygen.com
FRONTEND_URL=https://deploygen.com

# Deploy
git push
```

#### Update Frontend API URL
```javascript
// frontend/.env.production
NEXT_PUBLIC_API_URL=https://api.appmanager.com/api
```

---

### Database (MongoDB Atlas)

#### Create Cluster
```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create organization
# 3. Create project
# 4. Create M0 (free) or larger cluster
# 5. Create database user:
#    Username: app_user
#    Password: [Generate secure password]
# 6. Get connection string:
#    mongodb+srv://app_user:PASSWORD@cluster0.mongodb.net/app-manager?retryWrites=true&w=majority
```

#### Network Access
```bash
# Add IP addresses that can connect
# Development: Add your IP
# Production: 0.0.0.0/0 (allow all - use with JWT)

# Or use IP Whitelist:
# Railway servers: 34.x.x.x
# Vercel servers: 76.x.x.x
```

#### Backup Strategy
```bash
# Enable automated daily backups
# MongoDB Atlas Dashboard > Backup > Enable Automatic Backups

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/app-manager" \
          --archive=backup_$(date +%Y%m%d).archive

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/app-manager" \
             --archive=backup_20240115.archive
```

---

### Windows Client Distribution

#### Build Executable
```bash
cd windows-client

# Install PyInstaller
pip install pyinstaller

# Build standalone executable
pyinstaller --onefile --windowed \
  --name DeployGEN \
  --icon=assets/app.ico \
  src/gui_client.py

# Executable will be in: dist/DeployGEN.exe
```

#### Create Installer (Optional)
```bash
# Install Inno Setup
# Download from: http://www.jrsoftware.org/isdl.php

# Create script.iss
[Setup]
AppName=AppManager
AppVersion=1.0.0
DefaultDirName={pf}\AppManager
DefaultGroupName=AppManager
OutputDir=installer
OutputBaseFilename=AppManager-Setup-1.0.0

[Files]
Source: "dist\AppManager.exe"; DestDir: "{app}"

[Icons]
Name: "{group}\AppManager"; Filename: "{app}\AppManager.exe"

# Compile
iscc script.iss
```

#### Distribution Methods
```bash
# 1. GitHub Releases
# Upload exe to releases page
# Provide direct download link

# 2. Create Windows Installer
# Users can run standard installer
# DeployGEN appears in Add/Remove Programs

# 3. Cloud Storage
# Upload to OneDrive, Google Drive, Dropbox
# Share with teams

# 4. Corporate Repository
# Internal network share
# Managed deployment tools (SCCM, Intune)
```

---

## Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/app-manager?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production
API_URL=https://api.appmanager.com

# JWT Configuration
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
JWT_EXPIRE=7d

# Token Security
TOKEN_EXPIRY_MINUTES=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS & Frontend
FRONTEND_URL=https://appmanager.com

# Email (Optional - for future notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin
ADMIN_EMAIL=admin@appmanager.com
ADMIN_PASSWORD=change-to-secure-password
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.appmanager.com/api
```

---

## SSL/TLS Certificates

### For Production
```bash
# Vercel handles SSL automatically
# Railway can use auto-SSL or custom domain

# Custom domain with Let's Encrypt
certbot certonly --standalone -d api.deploygen.com -d deploygen.com
```

---

## Monitoring & Logging

### Setup Error Tracking
```javascript
// backend/src/server.js - Add Sentry
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

### View Logs
```bash
# Vercel logs
vercel logs frontend-name

# Railway logs
railway logs

# Local MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

---

## Performance Optimization

### Backend
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.set('Cache-Control', 'no-cache, no-store');
  }
  next();
});
```

### Frontend
```javascript
// next.config.js
module.exports = {
  compress: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  images: {
    optimizeFonts: true,
    domains: ['...'],
  },
};
```

---

## Scaling Considerations

### Database Scaling
- **Initial**: MongoDB Atlas M0 (free)
- **Medium**: M10 - 50GB storage, 4GB RAM
- **Large**: M100+ - Auto scaling, redundancy
- **Sharding**: For 100M+ documents

### Application Scaling
- **Horizontal**: Railway/Render auto-scaling
- **Failover**: Database replication
- **Caching**: Redis cache layer (future)
- **CDN**: Cloudflare for static assets

---

## Troubleshooting Deployment

### Issue: Backend can't connect to MongoDB
```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Test manually: mongosh "connection-string"
# Check firewall rules
```

### Issue: CORS errors in production
```javascript
// Verify CORS configuration
// frontend/.env.production has correct API URL
// backend has correct FRONTEND_URL
// Check response headers: Access-Control-Allow-Origin
```

### Issue: Slow installations
```bash
# Check backend response times
# Monitor database indexes
# Check network connectivity from client
# Verify app download URLs are accessible
```

### Issue: High memory usage
```bash
# Restart services
# Clear old analytics in database
# Optimize queries with indexes
# Monitor with: pm2 monit
```

---

## Backup & Disaster Recovery

### Regular Backups
```bash
# Daily automated backups
# Managed by MongoDB Atlas

# Weekly manual backups
cron: 0 2 * * 0 mongodump --uri="..." --archive=/backups/app-manager-weekly.archive
```

### Disaster Recovery Plan
1. Database fails: Restore from backup (< 24hrs)
2. Backend fails: Redeploy from git
3. Frontend fails: Revert to last working build
4. Complete failure: Migrate to secondary region

---

## Security Checklist

- [ ] Change JWT_SECRET to random value (min 32 chars)
- [ ] Change ADMIN_PASSWORD to secure password
- [ ] Enable HTTPS/SSL on all endpoints
- [ ] Whitelist database IPs (not 0.0.0.0/0 in prod)
- [ ] Set rate limiting appropriately
- [ ] Enable MongoDB authentication
- [ ] Rotate secrets quarterly
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Regular security audits

---

## Useful Commands

```bash
# Check backend health
curl https://api.deploygen.com/api/health

# Monitor logs
tail -f ~/.pm2/logs/app-manager-error.log

# Restart services
railway restart
vercel rebuild

# Update dependencies
cd backend && npm audit fix
cd frontend && npm audit fix

# Database maintenance
db.currentOp()  # Current operations
db.killOp(opid) # Kill slow operations
```
