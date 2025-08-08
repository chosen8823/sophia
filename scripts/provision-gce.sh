#!/usr/bin/env bash
set -euo pipefail

echo "[Provision] Updating system packages";
sudo apt-get update -y && sudo apt-get upgrade -y

echo "[Provision] Installing Node.js (via NodeSource)";
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs build-essential
fi

echo "[Provision] Installing pm2";
sudo npm install -g pm2

echo "[Provision] Cloning or pulling repository";
if [ ! -d "/opt/sophia" ]; then
  sudo git clone https://github.com/your-user/sophia.git /opt/sophia
fi
cd /opt/sophia
sudo git pull

echo "[Provision] Installing dependencies";
npm install --omit=dev

echo "[Provision] Building";
npm run build

echo "[Provision] Starting service with pm2";
pm2 start npx --name sophia -- next start -p 3000
pm2 save
pm2 startup systemd -u $USER --hp $HOME >/dev/null 2>&1 || true

echo "[Provision] Done. Service listening on port 3000.";
