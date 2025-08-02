#!/usr/bin/env bash
# Startup script for manus-vm to deploy the Sophia Manus clone platform
# Installs dependencies, clones repository, and launches backend and frontend
# Intended for use as a GCE metadata startup-script
set -euo pipefail

# Update system and install prerequisites
apt-get update -y
apt-get install -y python3 python3-venv python3-pip git nodejs npm unzip

# Clone repository if not already present
REPO_DIR="/opt/sophia"
if [ ! -d "$REPO_DIR" ]; then
  git clone https://github.com/chosen8823/sophia.git "$REPO_DIR"
fi

cd "$REPO_DIR"

# Unpack any bundled archives (if present)
for archive in *.zip; do
  [ -f "$archive" ] && unzip -o "$archive"
done

# Python environment setup
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

# Launch backend
nohup bash -c "source $REPO_DIR/venv/bin/activate && python main.py" \
  >/var/log/sophia-backend.log 2>&1 &

# Launch frontend if available
if [ -d manus_platform_frontend ]; then
  cd manus_platform_frontend
  npm install
  nohup npm run dev -- --host >/var/log/sophia-frontend.log 2>&1 &
fi

