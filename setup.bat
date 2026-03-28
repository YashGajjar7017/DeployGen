@echo off
REM AppManager Quick Start Script for Windows
REM Automatically sets up and runs AppManager locally

echo.
echo ╔════════════════════════════════════════╗
echo ║     AppManager - Quick Start Setup     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+
    pause
    exit /b 1
)
echo ✓ Python is installed

echo.
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your MongoDB URI
)

if not exist node_modules (
    echo Installing dependencies...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

cd ..

echo.
echo 📦 Setting up Frontend...
cd frontend

if not exist .env.local (
    echo Creating .env.local file...
    copy .env.example .env.local
)

if not exist node_modules (
    echo Installing dependencies...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

cd ..

echo.
echo 🐍 Setting up Windows Client...
cd windows-client

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start AppManager, run in separate terminals:
echo.
echo Terminal 1 - Backend:
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Then visit:
echo   🌐 Frontend: http://localhost:3000
echo   🔌 API: http://localhost:5000/api
echo.
echo 📖 For more info, see docs/SETUP.md
echo.
pause
