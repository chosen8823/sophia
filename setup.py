#!/usr/bin/env python3
"""
Setup script for Sophiael AI Platform
This script helps set up the environment and dependencies
"""

import os
import sys
import subprocess
import platform

def print_header():
    print("=" * 60)
    print("🤖 Sophiael AI Platform - Setup Script")
    print("=" * 60)

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    print(f"📍 Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Error: Python 3.8 or higher is required")
        return False
    
    print("✅ Python version is compatible")
    return True

def install_pip_packages():
    """Install required packages"""
    print("\n📦 Installing required packages...")
    
    packages = [
        "flask==3.0.3",
        "flask-cors==4.0.0", 
        "pyinstaller==6.11.1"
    ]
    
    for package in packages:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", 
                "--user", "--no-warn-script-location", package
            ])
            print(f"✅ {package} installed successfully")
        except subprocess.CalledProcessError:
            print(f"⚠️  Warning: Failed to install {package}")
            continue
    
    print("✅ Package installation completed")

def create_virtual_environment():
    """Create virtual environment"""
    print("\n🔧 Setting up virtual environment...")
    
    venv_path = "venv"
    if os.path.exists(venv_path):
        print("ℹ️  Virtual environment already exists")
        return True
    
    try:
        subprocess.check_call([sys.executable, "-m", "venv", venv_path])
        print("✅ Virtual environment created")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to create virtual environment")
        return False

def test_application():
    """Test if the application can run"""
    print("\n🧪 Testing application...")
    
    try:
        # Quick import test
        sys.path.insert(0, os.getcwd())
        import sophiael_main
        print("✅ Application imports successfully")
        return True
    except ImportError as e:
        print(f"⚠️  Warning: Import test failed: {e}")
        return False

def create_shortcut():
    """Create desktop shortcut (Windows only)"""
    if platform.system() != "Windows":
        return
    
    print("\n🔗 Creating desktop shortcut...")
    
    shortcut_content = f"""
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "{os.path.expanduser('~/Desktop/Sophiael AI.lnk')}"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "{os.path.abspath('sophiael_main.py')}"
oLink.WorkingDirectory = "{os.getcwd()}"
oLink.Description = "Sophiael AI Platform"
oLink.Save
"""
    
    try:
        with open("create_shortcut.vbs", "w") as f:
            f.write(shortcut_content)
        
        subprocess.call(["cscript", "create_shortcut.vbs"], shell=True)
        os.remove("create_shortcut.vbs")
        print("✅ Desktop shortcut created")
    except Exception:
        print("⚠️  Could not create desktop shortcut")

def main():
    """Main setup function"""
    print_header()
    
    if not check_python_version():
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Install packages
    install_pip_packages()
    
    # Create virtual environment
    create_virtual_environment()
    
    # Test application
    test_application()
    
    # Create shortcut on Windows
    create_shortcut()
    
    print("\n" + "=" * 60)
    print("🎉 Setup completed successfully!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Run 'python sophiael_main.py' to start the AI platform")
    print("2. Or use the build script to create an executable:")
    if platform.system() == "Windows":
        print("   - Run 'build.bat' on Windows")
    else:
        print("   - Run './build.sh' on Linux/Mac")
    print("3. Access the platform at http://localhost:5000")
    print("\n📚 For more information, see the documentation files.")
    
    input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()