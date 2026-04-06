#!/bin/bash
# MongoDB Connection Health Check Script
# Usage: bash scripts/health-check.sh

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🏥 DeployGEN MongoDB Health Check"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Node.js installed
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Install from https://nodejs.org${NC}"
    exit 1
fi

# Check 2: .env file exists
echo ""
echo "2️⃣  Checking .env file..."
if [ -f .env ]; then
    echo -e "${GREEN}✅ .env file found${NC}"
    if grep -q "MONGODB_URI" .env; then
        echo -e "${GREEN}✅ MONGODB_URI is set${NC}"
    else
        echo -e "${RED}❌ MONGODB_URI not found in .env${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ .env file not found. Create one with MONGODB_URI${NC}"
    exit 1
fi

# Check 3: Dependencies installed
echo ""
echo "3️⃣  Checking npm dependencies..."
if [ -d node_modules ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencies not installed. Run: npm install${NC}"
fi

# Check 4: MongoDB connection (using Node)
echo ""
echo "4️⃣  Testing MongoDB connection..."
echo "    (Starting connection test...)"

node - <<'EOF'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const GREEN='\033[0;32m';
const RED='\033[0;31m';
const YELLOW='\033[1;33m';
const NC='\033[0m';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  bufferMaxEntries: 0,
}).then((conn) => {
  console.log(`    ${GREEN}✅ Connected to MongoDB${NC}`);
  console.log(`    Host: ${conn.connection.host}`);
  console.log(`    Database: ${conn.connection.name}`);
  mongoose.disconnect();
  process.exit(0);
}).catch((err) => {
  console.log(`    ${RED}❌ Connection failed${NC}`);
  console.log(`    Error: ${err.message}`);
  if (err.message.includes('timeout')) {
    console.log(`\n    ${YELLOW}⚠️  Timeout - Check if:${NC}`);
    console.log(`       • MongoDB Atlas cluster is RUNNING (not Paused)`);
    console.log(`       • Your IP is whitelisted in Network Access`);
    console.log(`       • Connection string is correct in .env`);
  }
  process.exit(1);
});
EOF

# Check 5: Port 5000 availability
echo ""
echo "5️⃣  Checking port 5000 (Backend API)..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use${NC}"
    echo "    (This is fine if you're starting fresh)"
else
    echo -e "${GREEN}✅ Port 5000 is available${NC}"
fi

# Check 6: Port 27017 availability (if local MongoDB)
if grep -q "mongodb://localhost" .env; then
    echo ""
    echo "6️⃣  Checking port 27017 (Local MongoDB)..."
    if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ MongoDB is listening on port 27017${NC}"
    else
        echo -e "${RED}❌ MongoDB not found on port 27017${NC}"
        echo "    Start MongoDB with: mongod"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Health check complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. In another terminal: curl http://localhost:5000/api"
echo "  3. Should see API response 👍"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
