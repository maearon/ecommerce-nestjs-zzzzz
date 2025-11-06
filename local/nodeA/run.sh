#!/bin/bash
# ================================
# 🏗️ Start Node A (Gateway + Orders)
# ================================

# Load environment variables
if [ -f "local/nodeA/.env" ]; then
  export $(grep -v '^#' local/nodeA/.env | xargs)
  echo "✅ Environment loaded from local/nodeA/.env"
else
  echo "⚠️  No .env found in local/nodeA/.env"
fi

# Ensure Node.js modules installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start Gateway + Orders using concurrently
echo "🚀 Starting Node A services (Gateway + Orders)..."
npx concurrently -n GATEWAY,ORDERS -c blue,green \
  "nest start gateway --watch" \
  "nest start orders --watch"
