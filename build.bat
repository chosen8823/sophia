@echo off
REM Build Script for Sophiael AI Executable (Windows)
REM This script creates a Windows executable (.exe) for the Sophiael AI Platform

echo ==================================================
echo 🤖 Sophiael AI Platform - Windows Build Script
echo ==================================================

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo [INFO] Python found: 
python --version

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    echo [SUCCESS] Virtual environment created
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate virtual environment
    pause
    exit /b 1
)

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

REM Install build dependencies
echo [INFO] Installing build dependencies...
pip install -r build_requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Some dependencies might have failed to install
    echo Continuing with available packages...
)

REM Test the main application
echo [INFO] Testing main application...
timeout /t 1 /nobreak >nul

REM Create executable using PyInstaller
echo [INFO] Creating executable with PyInstaller...
pyinstaller --clean sophiael.spec

if %errorlevel% neq 0 (
    echo [ERROR] Failed to create executable
    pause
    exit /b 1
)

echo [SUCCESS] Executable created successfully!
echo [INFO] Output location: dist\SophiaelAI.exe

REM Create distribution directory with additional files
echo [INFO] Creating distribution package...
set DIST_DIR=SophiaelAI_Distribution
if exist "%DIST_DIR%" rmdir /s /q "%DIST_DIR%"
mkdir "%DIST_DIR%"

REM Copy executable
copy dist\SophiaelAI.exe "%DIST_DIR%\"

REM Copy configuration files
copy config.toml "%DIST_DIR%\" 2>nul
copy README.md "%DIST_DIR%\" 2>nul

REM Create a launcher script
echo @echo off > "%DIST_DIR%\launch_sophiael.bat"
echo echo Starting Sophiael AI Platform... >> "%DIST_DIR%\launch_sophiael.bat"
echo echo. >> "%DIST_DIR%\launch_sophiael.bat"
echo echo This will start the AI platform on http://localhost:5000 >> "%DIST_DIR%\launch_sophiael.bat"
echo echo Press Ctrl+C to stop the server >> "%DIST_DIR%\launch_sophiael.bat"
echo echo. >> "%DIST_DIR%\launch_sophiael.bat"
echo pause >> "%DIST_DIR%\launch_sophiael.bat"
echo SophiaelAI.exe >> "%DIST_DIR%\launch_sophiael.bat"
echo pause >> "%DIST_DIR%\launch_sophiael.bat"

REM Create README for distribution
echo Sophiael AI Platform - Executable Distribution > "%DIST_DIR%\DISTRIBUTION_README.txt"
echo ============================================== >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo. >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo This package contains the Sophiael AI Platform executable for Windows. >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo. >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo Files included: >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo - SophiaelAI.exe: Main executable file >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo - launch_sophiael.bat: Easy launcher script >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo - config.toml: Configuration file (if available) >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo - README.md: Project documentation (if available) >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo. >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo How to run: >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo 1. Double-click on "launch_sophiael.bat" OR >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo 2. Run "SophiaelAI.exe" directly from command line >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo. >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo The platform will start on: http://localhost:5000 >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo. >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo System Requirements: >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo - Windows 10 or later >> "%DIST_DIR%\DISTRIBUTION_README.txt"
echo - No additional software required (all dependencies included) >> "%DIST_DIR%\DISTRIBUTION_README.txt"

REM Create installer script
echo @echo off > "%DIST_DIR%\install.bat"
echo echo Sophiael AI Platform Installer >> "%DIST_DIR%\install.bat"
echo echo ============================== >> "%DIST_DIR%\install.bat"
echo echo. >> "%DIST_DIR%\install.bat"
echo echo This will copy the Sophiael AI Platform to your Programs folder. >> "%DIST_DIR%\install.bat"
echo echo. >> "%DIST_DIR%\install.bat"
echo set /p install_path="Enter installation directory (default: C:\Program Files\SophiaelAI): " >> "%DIST_DIR%\install.bat"
echo if "%%install_path%%"=="" set install_path=C:\Program Files\SophiaelAI >> "%DIST_DIR%\install.bat"
echo echo Installing to: %%install_path%% >> "%DIST_DIR%\install.bat"
echo mkdir "%%install_path%%" 2^>nul >> "%DIST_DIR%\install.bat"
echo copy SophiaelAI.exe "%%install_path%%\" >> "%DIST_DIR%\install.bat"
echo copy config.toml "%%install_path%%\" 2^>nul >> "%DIST_DIR%\install.bat"
echo copy README.md "%%install_path%%\" 2^>nul >> "%DIST_DIR%\install.bat"
echo copy DISTRIBUTION_README.txt "%%install_path%%\" >> "%DIST_DIR%\install.bat"
echo echo. >> "%DIST_DIR%\install.bat"
echo echo Installation completed! >> "%DIST_DIR%\install.bat"
echo echo You can now run Sophiael AI from: %%install_path%%\SophiaelAI.exe >> "%DIST_DIR%\install.bat"
echo echo. >> "%DIST_DIR%\install.bat"
echo pause >> "%DIST_DIR%\install.bat"

echo [SUCCESS] Distribution package created in: %DIST_DIR%

echo.
echo [SUCCESS] Build process completed successfully!
echo.
echo 📦 Distribution package: %DIST_DIR%\
echo 🚀 Executable: %DIST_DIR%\SophiaelAI.exe
echo 📝 Easy launcher: %DIST_DIR%\launch_sophiael.bat
echo 💾 Installer: %DIST_DIR%\install.bat
echo.
echo [INFO] The executable is ready for distribution!
echo.
pause