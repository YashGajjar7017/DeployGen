# Build script for Windows Client

$pythonPath = "python"
$scriptDir = Get-Location

# Check if Python is installed
try {
    & $pythonPath --version
} catch {
    Write-Host "Python is not installed or not in PATH"
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..."
& $pythonPath -m pip install -r requirements.txt

# Check if PyInstaller is installed
& $pythonPath -m pip install pyinstaller

# Build executable
Write-Host "Building executable..."
& $pythonPath -m PyInstaller `
    --onefile `
    --windowed `
    --name AppManager `
    --distpath ./dist `
    --buildpath ./build `
    src/gui_client.py

Write-Host "Build complete! Executable: ./dist/AppManager.exe"
