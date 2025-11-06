#!/bin/bash
# Production startup script
# Runs both Gateway and Orders in the same process

set -e

echo "🚀 Starting NestJS Microservices in Production Mode..."

# Start Orders service in background
echo "📦 Starting Orders Service..."
node dist/apps/orders/main.js &
ORDERS_PID=$!

# Wait a bit for Orders to start
sleep 2

# Start Gateway service
echo "🌐 Starting Gateway Service..."
node dist/apps/gateway/main.js

# Cleanup on exit
trap "kill $ORDERS_PID" EXIT

