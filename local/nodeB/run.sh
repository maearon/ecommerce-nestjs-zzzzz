#!/bin/bash
# ================================
# 🏗️ Start Node B (Inventory + Payments + Rewards)
# ================================

# Load environment variables
if [ -f "local/nodeB/.env" ]; then
  export $(grep -v '^#' local/nodeB/.env | xargs)
  echo "✅ Environment loaded from local/nodeB/.env"
else
  echo "⚠️  No .env found in local/nodeB/.env"
fi

# Ensure Node.js modules installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start microservices using concurrently
echo "🚀 Starting Node B services (Inventory + Payments + Rewards)..."
npx concurrently -n INVENTORY,PAYMENTS,REWARDS -c yellow,magenta,cyan \
  "nest start inventory --watch" \
  "nest start payments --watch" \
  "nest start rewards --watch"
