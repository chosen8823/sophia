#!/bin/bash

# Build Script for Sophiael AI Executable
# This script creates a Windows executable (.exe) for the Sophiael AI Platform

echo "=================================================="
echo "🤖 Sophiael AI Platform - Build Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python is available
print_status "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed or not in PATH"
    exit 1
fi
print_success "Python 3 found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -eq 0 ]; then
        print_success "Virtual environment created"
    else
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate || {
    print_error "Failed to activate virtual environment"
    exit 1
}

# Upgrade pip
print_status "Upgrading pip..."
python -m pip install --upgrade pip

# Install build dependencies
print_status "Installing build dependencies..."
pip install -r build_requirements.txt
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_warning "Some dependencies might have failed to install"
fi

# Test the main application
print_status "Testing main application..."
python sophiael_main.py --test &
MAIN_PID=$!
sleep 2
kill $MAIN_PID 2>/dev/null
print_success "Main application test completed"

# Create executable using PyInstaller
print_status "Creating executable with PyInstaller..."
pyinstaller --clean sophiael.spec

if [ $? -eq 0 ]; then
    print_success "Executable created successfully!"
    print_status "Output location: dist/SophiaelAI.exe"
else
    print_error "Failed to create executable"
    exit 1
fi

# Create distribution directory with additional files
print_status "Creating distribution package..."
DIST_DIR="SophiaelAI_Distribution"
mkdir -p "$DIST_DIR"

# Copy executable
cp dist/SophiaelAI* "$DIST_DIR/"

# Copy configuration files
cp config.toml "$DIST_DIR/" 2>/dev/null || print_warning "config.toml not found"
cp README.md "$DIST_DIR/" 2>/dev/null || print_warning "README.md not found"

# Create a launcher script
cat > "$DIST_DIR/launch_sophiael.bat" << 'EOF'
@echo off
echo Starting Sophiael AI Platform...
echo.
echo This will start the AI platform on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
pause
SophiaelAI.exe
pause
EOF

# Create README for distribution
cat > "$DIST_DIR/DISTRIBUTION_README.txt" << 'EOF'
Sophiael AI Platform - Executable Distribution
==============================================

This package contains the Sophiael AI Platform executable for Windows.

Files included:
- SophiaelAI.exe: Main executable file
- launch_sophiael.bat: Easy launcher script
- config.toml: Configuration file (if available)
- README.md: Project documentation (if available)

How to run:
1. Double-click on "launch_sophiael.bat" OR
2. Run "SophiaelAI.exe" directly from command line

The platform will start on: http://localhost:5000

System Requirements:
- Windows 10 or later
- No additional software required (all dependencies included)

Support:
For issues or questions, please refer to the project repository.
EOF

print_success "Distribution package created in: $DIST_DIR"

# Create installer script (optional)
print_status "Creating installer script..."
cat > "$DIST_DIR/install.bat" << 'EOF'
@echo off
echo Sophiael AI Platform Installer
echo ==============================
echo.
echo This will copy the Sophiael AI Platform to your Programs folder.
echo.
set /p install_path="Enter installation directory (default: C:\Program Files\SophiaelAI): "
if "%install_path%"=="" set install_path=C:\Program Files\SophiaelAI

echo Installing to: %install_path%
mkdir "%install_path%" 2>nul
copy SophiaelAI.exe "%install_path%\"
copy config.toml "%install_path%\" 2>nul
copy README.md "%install_path%\" 2>nul
copy DISTRIBUTION_README.txt "%install_path%\"

echo.
echo Installation completed!
echo You can now run Sophiael AI from: %install_path%\SophiaelAI.exe
echo.
pause
EOF

print_success "Installer script created"

# Final summary
echo ""
print_success "Build process completed successfully!"
echo ""
echo "📦 Distribution package: $DIST_DIR/"
echo "🚀 Executable: $DIST_DIR/SophiaelAI.exe"
echo "📝 Easy launcher: $DIST_DIR/launch_sophiael.bat"
echo "💾 Installer: $DIST_DIR/install.bat"
echo ""
print_status "The executable is ready for distribution!"