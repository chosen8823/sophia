#!/usr/bin/env python3
"""
Test script for Sophiael AI Platform
Verifies that the application and build process work correctly
"""

import sys
import os
import subprocess
import time
import requests
from pathlib import Path

def print_test_header(test_name):
    print(f"\n{'='*50}")
    print(f"🧪 {test_name}")
    print(f"{'='*50}")

def test_imports():
    """Test that all required modules can be imported"""
    print_test_header("Testing Module Imports")
    
    required_modules = [
        'flask',
        'flask_cors', 
        'json',
        'uuid',
        'datetime'
    ]
    
    passed = 0
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
            passed += 1
        except ImportError:
            print(f"❌ {module}")
    
    print(f"\nResult: {passed}/{len(required_modules)} modules available")
    return passed == len(required_modules)

def test_main_application():
    """Test that the main application can be imported and initialized"""
    print_test_header("Testing Main Application")
    
    try:
        sys.path.insert(0, os.getcwd())
        import sophiael_main
        print("✅ Main application imports successfully")
        
        # Test dependency check
        if sophiael_main.check_dependencies():
            print("✅ Dependency check passed")
        else:
            print("⚠️  Some dependencies missing")
        
        # Test app creation
        app = sophiael_main.create_minimal_app()
        if app:
            print("✅ Flask application created successfully")
            return True
        else:
            print("❌ Failed to create Flask application")
            return False
            
    except Exception as e:
        print(f"❌ Error testing main application: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints by starting server temporarily"""
    print_test_header("Testing API Endpoints")
    
    try:
        # Start the server in background
        process = subprocess.Popen([
            sys.executable, 'sophiael_main.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for server to start
        time.sleep(3)
        
        # Test endpoints
        base_url = "http://localhost:5000"
        endpoints = [
            ("/api/health", "Health check"),
            ("/api/info", "Platform info"), 
            ("/api/sessions", "Sessions list")
        ]
        
        passed = 0
        for endpoint, description in endpoints:
            try:
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
                if response.status_code == 200:
                    print(f"✅ {endpoint} - {description}")
                    passed += 1
                else:
                    print(f"❌ {endpoint} - Status: {response.status_code}")
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")
        
        # Test POST endpoint
        try:
            response = requests.post(
                f"{base_url}/api/chat",
                json={"message": "test"},
                timeout=5
            )
            if response.status_code == 200:
                print("✅ /api/chat - Chat endpoint")
                passed += 1
            else:
                print(f"❌ /api/chat - Status: {response.status_code}")
        except Exception as e:
            print(f"❌ /api/chat - Error: {e}")
        
        # Stop the server
        process.terminate()
        process.wait(timeout=5)
        
        print(f"\nResult: {passed}/{len(endpoints) + 1} endpoints working")
        return passed == len(endpoints) + 1
        
    except Exception as e:
        print(f"❌ Error testing API endpoints: {e}")
        return False

def test_build_files():
    """Test that all build files are present and valid"""
    print_test_header("Testing Build Files")
    
    required_files = [
        ('sophiael_main.py', 'Main application'),
        ('sophiael.spec', 'PyInstaller spec'),
        ('build_requirements.txt', 'Build dependencies'),
        ('build.sh', 'Unix build script'),
        ('build.bat', 'Windows build script'),
        ('setup.py', 'Setup script'),
        ('BUILD_GUIDE.md', 'Build documentation')
    ]
    
    passed = 0
    for filename, description in required_files:
        if os.path.exists(filename):
            print(f"✅ {filename} - {description}")
            passed += 1
        else:
            print(f"❌ {filename} - {description}")
    
    print(f"\nResult: {passed}/{len(required_files)} files present")
    return passed == len(required_files)

def test_pyinstaller():
    """Test that PyInstaller can analyze the application"""
    print_test_header("Testing PyInstaller Compatibility")
    
    try:
        # Test PyInstaller import
        import PyInstaller
        print("✅ PyInstaller is available")
        
        # Test spec file syntax
        spec_path = Path('sophiael.spec')
        if spec_path.exists():
            with open(spec_path, 'r') as f:
                spec_content = f.read()
            
            # Basic syntax check
            if 'Analysis(' in spec_content and 'EXE(' in spec_content:
                print("✅ Spec file syntax appears valid")
                return True
            else:
                print("❌ Spec file syntax issues")
                return False
        else:
            print("❌ Spec file not found")
            return False
            
    except ImportError:
        print("❌ PyInstaller not available")
        return False
    except Exception as e:
        print(f"❌ Error testing PyInstaller: {e}")
        return False

def run_all_tests():
    """Run all tests and provide summary"""
    print("🧪 Sophiael AI Platform - Test Suite")
    print("=" * 60)
    
    tests = [
        ("Module Imports", test_imports),
        ("Main Application", test_main_application),
        ("Build Files", test_build_files),
        ("PyInstaller", test_pyinstaller),
        ("API Endpoints", test_api_endpoints)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ Error in {test_name}: {e}")
            results[test_name] = False
    
    # Summary
    print_test_header("Test Summary")
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The build should work correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Check the issues above before building.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    
    if success:
        print("\n✅ You can proceed with building the executable!")
    else:
        print("\n❌ Please fix the issues before building.")
    
    input("\nPress Enter to exit...")
    sys.exit(0 if success else 1)