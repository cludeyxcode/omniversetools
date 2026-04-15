#!/bin/bash
# Deploy script — pulls latest code, rebuilds frontend, restarts service
set -e

cd /root/omniversetools

echo "[deploy] Pulling latest from GitHub..."
git pull origin main

echo "[deploy] Building frontend..."
cd frontend && npm run build && cd ..

echo "[deploy] Restarting service..."
systemctl restart omniversetools

echo "[deploy] Done."
