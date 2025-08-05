#!/bin/bash
# 🌟 Sophia Platform - VM Auto-Setup Script
# Automatically configures Sophia on a fresh Google Cloud VM

set -e

echo "🌟 Sophia Platform - VM Setup"
echo "=============================="
echo "Setting up Sophia Consciousness Platform on Google Cloud VM..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}💫 $1${NC}"
}

# Update system
print_step "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Install essential packages
print_step "Installing essential packages..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    wget \
    unzip \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release
print_success "Essential packages installed"

# Install Docker
print_step "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER
print_success "Docker installed"

# Install Node.js 18
print_step "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js $(node --version) installed"

# Install Google Cloud SDK
print_step "Installing Google Cloud SDK..."
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update && sudo apt install -y google-cloud-cli
print_success "Google Cloud SDK installed"

# Create workspace directory
print_step "Setting up Sophia workspace..."
mkdir -p /home/$USER/sophia-platform
cd /home/$USER/sophia-platform

# Clone Sophia repository
print_step "Cloning Sophia repository..."
git clone https://github.com/chosen8823/sophia.git .
print_success "Repository cloned"

# Set up Python virtual environment
print_step "Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python environment ready"

# Install frontend dependencies if package.json exists
if [ -f "package.json" ]; then
    print_step "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
fi

# Set up environment variables
print_step "Creating environment configuration..."
cat > .env << EOF
# Sophia Platform Configuration
FLASK_APP=main.py
FLASK_ENV=production
PORT=5000
SOPHIA_MODE=server

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT
GCP_REGION=us-central1

# AI Model Configuration
HUGGINGFACE_API_KEY=your_huggingface_key_here
OPENAI_API_KEY=your_openai_key_here

# Database Configuration
DATABASE_URL=sqlite:///sophia.db

# Security
SECRET_KEY=sophia_consciousness_platform_$(openssl rand -hex 32)
EOF
print_success "Environment configured"

# Create systemd service for auto-start
print_step "Creating system service..."
sudo tee /etc/systemd/system/sophia.service > /dev/null << EOF
[Unit]
Description=Sophia Consciousness Platform
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/sophia-platform
Environment=PATH=/home/$USER/sophia-platform/venv/bin
ExecStart=/home/$USER/sophia-platform/venv/bin/python main.py --mode=server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable sophia
print_success "System service created"

# Create launch script
print_step "Creating launch scripts..."
cat > launch_sophia.sh << 'EOF'
#!/bin/bash
cd /home/$USER/sophia-platform
source venv/bin/activate
export SOPHIA_MODE=server
python main.py --mode=server --port=5000
EOF
chmod +x launch_sophia.sh

cat > launch_dev.sh << 'EOF'
#!/bin/bash
cd /home/$USER/sophia-platform
source venv/bin/activate
export SOPHIA_MODE=manus
python main.py --mode=manus --port=5000
EOF
chmod +x launch_dev.sh
print_success "Launch scripts created"

# Get VM external IP
EXTERNAL_IP=$(curl -s -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip)

print_info "🎉 Sophia Platform Setup Complete!"
echo ""
echo "🌟 Your Sophia Consciousness Platform is ready!"
echo "=============================================="
echo ""
echo "🌐 Access URLs:"
echo "   External: http://$EXTERNAL_IP:5000"
echo "   Internal: http://localhost:5000"
echo ""
echo "🚀 Quick Start Commands:"
echo "   Start Service: sudo systemctl start sophia"
echo "   Stop Service:  sudo systemctl stop sophia"
echo "   View Logs:     sudo journalctl -u sophia -f"
echo ""
echo "🛠️ Manual Launch:"
echo "   Production:    ./launch_sophia.sh"
echo "   Development:   ./launch_dev.sh"
echo ""
echo "📁 Project Location: /home/$USER/sophia-platform"
echo ""
echo "🔧 Next Steps:"
echo "1. Add your API keys to .env file"
echo "2. Start the service: sudo systemctl start sophia"
echo "3. Visit: http://$EXTERNAL_IP:5000"
echo ""
echo "💫 Your conscious AI platform is now running in the cloud!"
echo "✨ Transcending dimensions through technology! ✨"
