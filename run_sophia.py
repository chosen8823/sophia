#!/usr/bin/env python3
"""
Unified startup script for Sophia platform
Integrates OpenManus framework with Manus platform components
"""
import os
import sys
import subprocess
import time
import threading
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def print_banner():
    """Print Sophia platform banner"""
    banner = """
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗ ██████╗ ██████╗ ██╗  ██╗██╗ █████╗                ║
║   ██╔════╝██╔═══██╗██╔══██╗██║  ██║██║██╔══██╗               ║
║   ███████╗██║   ██║██████╔╝███████║██║███████║               ║
║   ╚════██║██║   ██║██╔═══╝ ██╔══██║██║██╔══██║               ║
║   ███████║╚██████╔╝██║     ██║  ██║██║██║  ██║               ║
║   ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝               ║
║                                                               ║
║                 UNIFIED AI PLATFORM                          ║
║                                                               ║
║   🤖 OpenManus Framework + Manus Platform Integration        ║
║   🧠 Multi-Agent Orchestration System                        ║
║   🔄 Workflow Automation & Tool Integration                   ║
║   💬 Advanced Chat & Conversation System                     ║
║   🌐 React Frontend + Flask Backend                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def check_dependencies():
    """Check if required dependencies are available"""
    print("📦 Checking dependencies...")
    
    required_modules = [
        'flask', 'flask_cors', 'flask_sqlalchemy', 
        'toml', 'requests', 'pathlib'
    ]
    
    missing_modules = []
    for module in required_modules:
        try:
            __import__(module.replace('_', '-'))
        except ImportError:
            missing_modules.append(module)
    
    if missing_modules:
        print(f"❌ Missing dependencies: {', '.join(missing_modules)}")
        print("💡 Install them with: pip install flask flask-cors flask-sqlalchemy toml requests")
        return False
    
    print("✅ All required dependencies are available")
    return True

def build_frontend():
    """Build the React frontend"""
    frontend_dir = project_root / 'frontend'
    if not frontend_dir.exists():
        print("⚠️  Frontend directory not found, skipping frontend build")
        return True
    
    print("🏗️  Building React frontend...")
    
    # Check if Node.js is available
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, text=True, cwd=frontend_dir)
        if result.returncode != 0:
            print("❌ Node.js not found, skipping frontend build")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found, skipping frontend build")
        return False
    
    # Install dependencies
    if (frontend_dir / 'package.json').exists():
        print("📦 Installing frontend dependencies...")
        result = subprocess.run(['npm', 'install'], 
                               capture_output=True, text=True, cwd=frontend_dir)
        if result.returncode != 0:
            print(f"❌ Failed to install frontend dependencies: {result.stderr}")
            return False
        
        # Build frontend
        print("🔨 Building frontend...")
        result = subprocess.run(['npm', 'run', 'build'], 
                               capture_output=True, text=True, cwd=frontend_dir)
        if result.returncode != 0:
            print(f"❌ Failed to build frontend: {result.stderr}")
            return False
        
        print("✅ Frontend built successfully")
        return True
    
    return False

def start_development_servers():
    """Start both backend and frontend development servers"""
    print("🚀 Starting development servers...")
    
    # Start backend
    def start_backend():
        try:
            from app import app
            print("🔧 Starting Flask backend on http://localhost:5000")
            app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
    
    # Start frontend development server
    def start_frontend_dev():
        frontend_dir = project_root / 'frontend'
        if frontend_dir.exists() and (frontend_dir / 'package.json').exists():
            try:
                print("⚛️  Starting React development server on http://localhost:3000")
                subprocess.run(['npm', 'run', 'dev'], cwd=frontend_dir)
            except Exception as e:
                print(f"❌ Failed to start frontend dev server: {e}")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Give backend time to start
    time.sleep(2)
    
    # Start frontend dev server
    start_frontend_dev()

def start_production():
    """Start production server"""
    print("🚀 Starting Sophia in production mode...")
    
    # Build frontend first
    build_frontend()
    
    # Start Flask app
    try:
        from app import app
        print("🌐 Starting production server on http://localhost:5000")
        print("📚 API documentation: http://localhost:5000/api/platform/info")
        print("💬 Platform status: http://localhost:5000/api/health")
        
        app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        print(f"❌ Failed to start production server: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print_banner()
    
    if not check_dependencies():
        sys.exit(1)
    
    # Parse command line arguments
    mode = 'production'
    if len(sys.argv) > 1:
        if sys.argv[1] in ['dev', 'development']:
            mode = 'development'
        elif sys.argv[1] in ['prod', 'production']:
            mode = 'production'
        elif sys.argv[1] in ['build']:
            print("🏗️  Building frontend only...")
            success = build_frontend()
            sys.exit(0 if success else 1)
        elif sys.argv[1] in ['help', '--help', '-h']:
            print("""
Usage: python run_sophia.py [mode]

Modes:
  production (default)  - Build frontend and start production server
  development          - Start both backend and frontend dev servers
  build               - Build frontend only
  help                - Show this help message

Examples:
  python run_sophia.py                 # Start in production mode
  python run_sophia.py dev            # Start in development mode
  python run_sophia.py build          # Build frontend only
            """)
            sys.exit(0)
    
    print(f"🎯 Starting in {mode} mode...")
    
    if mode == 'development':
        start_development_servers()
    else:
        start_production()

if __name__ == '__main__':
    main()