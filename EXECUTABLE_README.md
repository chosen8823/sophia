# Sophiael AI Platform - Executable Distribution

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/Build-PyInstaller-orange)](https://pyinstaller.org)

## 🚀 Quick Start

### For End Users (Windows)

1. **Download the executable distribution** (when available)
2. **Extract the files** to your preferred location
3. **Run the launcher**: Double-click `launch_sophiael.bat`
4. **Access the platform**: Open http://localhost:5000 in your browser

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/chosen8823/sophia.git
   cd sophia
   ```

2. **Run the demo** (no dependencies required)
   ```bash
   python demo.py
   ```

3. **Build the executable**
   ```bash
   # Windows
   build.bat
   
   # Linux/macOS  
   chmod +x build.sh && ./build.sh
   ```

## 📋 What's Included

This build system creates a complete Windows executable for the Sophiael AI Platform with:

### ✨ Features
- **Standalone Executable**: No Python installation required
- **Web Interface**: Modern, responsive UI accessible via browser
- **Chat Functionality**: Interactive AI chat with session management
- **API Endpoints**: RESTful API for programmatic access
- **Easy Distribution**: Single executable with installer options

### 📁 Files Created
```
SophiaelAI_Distribution/
├── SophiaelAI.exe              # Main executable
├── launch_sophiael.bat         # Easy launcher script
├── install.bat                 # Installation helper
├── DISTRIBUTION_README.txt     # User instructions
└── config files...             # Configuration and docs
```

### 🔧 Build Tools
- `sophiael_main.py` - Main application entry point
- `sophiael.spec` - PyInstaller configuration
- `build_requirements.txt` - Essential dependencies only
- `build.sh` / `build.bat` - Automated build scripts
- `setup.py` - Environment setup helper
- `test_build.py` - Build verification tests
- `demo.py` - Standalone demo (no dependencies)

## 🛠️ Build Process

### Prerequisites
- Python 3.8 or higher
- Internet connection (for dependencies)
- Windows 10+ (for Windows builds)

### Build Steps

1. **Setup Environment**
   ```bash
   python setup.py  # Automated setup
   ```

2. **Install Dependencies**
   ```bash
   pip install -r build_requirements.txt
   ```

3. **Run Tests** (optional)
   ```bash
   python test_build.py
   ```

4. **Build Executable**
   ```bash
   # Automated (recommended)
   build.bat  # Windows
   ./build.sh # Linux/macOS
   
   # Manual
   pyinstaller --clean sophiael.spec
   ```

### Build Configuration

The build is optimized for:
- **Small size**: Excludes unnecessary packages
- **Fast startup**: Minimal imports in main module
- **Compatibility**: Works on Windows 10+
- **Self-contained**: All dependencies bundled

## 📖 Usage

### Web Interface
1. Launch the executable
2. Open http://localhost:5000
3. Use the chat interface
4. Access API endpoints

### API Endpoints
- `GET /` - Web interface
- `GET /api/health` - Health check
- `GET /api/info` - Platform information  
- `POST /api/chat` - Send chat message
- `GET /api/sessions` - List chat sessions

### Example API Usage
```python
import requests

# Health check
response = requests.get("http://localhost:5000/api/health")
print(response.json())

# Send chat message
response = requests.post(
    "http://localhost:5000/api/chat",
    json={"message": "Hello, AI!"}
)
print(response.json())
```

## 🎯 Architecture

### Application Structure
```
Sophiael AI Platform
├── Web Interface (Flask)
├── Chat Engine (AI responses)
├── Session Management
├── API Layer (REST)
└── Configuration
```

### Key Components
- **Flask Application**: Web server and API
- **Chat Engine**: AI conversation handling
- **Session Manager**: User session tracking
- **Configuration**: Settings and customization

## 🔧 Customization

### Modifying the Build

Edit `sophiael.spec` to customize:
```python
# Add more hidden imports
hiddenimports=[
    'your_module',
],

# Exclude large packages
excludes=[
    'matplotlib',
    'tensorflow',
],

# Add data files
datas=[
    ('config.toml', '.'),
    ('static/*', 'static'),
],
```

### Adding Features

1. Modify `sophiael_main.py`
2. Update dependencies in `build_requirements.txt`
3. Test with `python test_build.py`
4. Rebuild with build scripts

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
- Check Python version (3.8+ required)
- Install missing dependencies
- Review error messages in build output

**Executable Won't Run**
- Check Windows version (10+ required)
- Run from command line to see errors
- Check antivirus software

**Missing Features**
- Verify all dependencies in `build_requirements.txt`
- Check `hiddenimports` in spec file
- Test individual modules

### Getting Help

1. Run diagnostic tests: `python test_build.py`
2. Check build logs for errors
3. Review `BUILD_GUIDE.md` for detailed instructions
4. Test with demo mode: `python demo.py`

## 📈 Performance

### Optimization Tips
- Use `--onefile` for single executable
- Enable UPX compression for smaller size
- Exclude unused packages in spec file
- Use virtual environment for clean builds

### System Requirements
- **Build Machine**: Python 3.8+, 2GB RAM, 2GB disk
- **Target Machine**: Windows 10+, 1GB RAM, 500MB disk

## 🔒 Security

The executable is built with:
- No embedded credentials
- Local-only server binding
- Standard Flask security practices
- No external network dependencies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Test your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review build logs
- Test with `python demo.py`
- Consult `BUILD_GUIDE.md`

---

**Built with ❤️ using Python, Flask, and PyInstaller**