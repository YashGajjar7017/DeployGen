# MongoDB Connection Health Check Script (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/health-check.ps1

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🏥 AppManager MongoDB Health Check" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check 1: Node.js installed
Write-Host "1️⃣  Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check 2: .env file exists
Write-Host ""
Write-Host "2️⃣  Checking .env file..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "✅ .env file found" -ForegroundColor Green
    $envContent = Get-Content .env
    if ($envContent -match "MONGODB_URI") {
        Write-Host "✅ MONGODB_URI is set" -ForegroundColor Green
    } else {
        Write-Host "❌ MONGODB_URI not found in .env" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ .env file not found. Create one with MONGODB_URI" -ForegroundColor Red
    exit 1
}

# Check 3: Dependencies installed
Write-Host ""
Write-Host "3️⃣  Checking npm dependencies..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

# Check 4: MongoDB connection using Node
Write-Host ""
Write-Host "4️⃣  Testing MongoDB connection..." -ForegroundColor Yellow
Write-Host "    (Starting connection test...)" -ForegroundColor Gray

$testScript = @'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  bufferMaxEntries: 0,
}).then((conn) => {
  console.log('    ✅ Connected to MongoDB');
  console.log(`    Host: ${conn.connection.host}`);
  console.log(`    Database: ${conn.connection.name}`);
  mongoose.disconnect();
  process.exit(0);
}).catch((err) => {
  console.log('    ❌ Connection failed');
  console.log(`    Error: ${err.message}`);
  if (err.message.includes('timeout')) {
    console.log('\n    ⚠️  Timeout - Check if:');
    console.log('       • MongoDB Atlas cluster is RUNNING (not Paused)');
    console.log('       • Your IP is whitelisted in Network Access');
    console.log('       • Connection string is correct in .env');
  }
  process.exit(1);
});
'@

$testScript | node
$mongoTestResult = $LASTEXITCODE

# Check 5: Port 5000 availability
Write-Host ""
Write-Host "5️⃣  Checking port 5000 (Backend API)..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "⚠️  Port 5000 is already in use" -ForegroundColor Yellow
    Write-Host "    (This is fine if you're starting fresh)" -ForegroundColor Gray
} else {
    Write-Host "✅ Port 5000 is available" -ForegroundColor Green
}

# Check 6: Port 27017 (Local MongoDB)
$envContent = Get-Content .env
if ($envContent -match "mongodb://localhost") {
    Write-Host ""
    Write-Host "6️⃣  Checking port 27017 (Local MongoDB)..." -ForegroundColor Yellow
    $port27017 = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
    if ($port27017) {
        Write-Host "✅ MongoDB is listening on port 27017" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB not found on port 27017" -ForegroundColor Red
        Write-Host "    Start MongoDB with: mongod" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($mongoTestResult -eq 0) {
    Write-Host "✅ Health check complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some issues detected - see above" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor Gray
Write-Host "  2. In another terminal: curl http://localhost:5000/api" -ForegroundColor Gray
Write-Host "  3. Should see API response 👍" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
