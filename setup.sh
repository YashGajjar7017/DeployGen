#!/bin/bash

# AppManager Quick Start Script
# Automatically sets up and runs AppManager locally

set -e

echo "╔════════════════════════════════════════╗"
echo "║     AppManager - Quick Start Setup     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi
echo "✓ Node.js $(node --version)"

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi
echo "✓ Python $(python3 --version)"

if ! command -v mongod &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Using MongoDB Atlas"
    echo "   Make sure to set MONGODB_URI in backend/.env"
fi

echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your MongoDB URI"
fi

if [ ! -d node_modules ]; then
    npm install
else
    echo "✓ Dependencies already installed"
fi

cd ..

echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
fi

if [ ! -d node_modules ]; then
    npm install
else
    echo "✓ Dependencies already installed"
fi

cd ..

echo ""
echo "🐍 Setting up Windows Client..."
cd windows-client

if [ ! -d venv ]; then
    python3 -m venv venv
fi

source venv/bin/activate || . venv/Scripts/activate

pip install -r requirements.txt

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start DeployGEN, run in separate terminals:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔌 API: http://localhost:5000/api"
echo ""
echo "📖 For more info, see docs/SETUP.md"
echo ""
