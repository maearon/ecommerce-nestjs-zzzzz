#!/bin/bash
# Script to add all new files for deployment

echo "🚀 Adding files to git..."

# Frontend - Address Management & Payment
echo "📦 Adding Frontend files..."
cd adidas-microservices/apps/web

git add src/models/Address.ts
git add src/lib/utils/getUserFromRequest.ts
git add src/app/api/v1/addresses/route.ts
git add src/app/api/v1/addresses/\[addressId\]/route.ts
git add src/app/api/v1/addresses/search/route.ts
git add src/app/api/v1/addresses/default/route.ts
git add src/app/api/v1/payments/create-intent/route.ts
git add src/app/api/v1/payments/webhook/momo/route.ts
git add src/app/api/v1/payments/webhook/vnpay/route.ts
git add src/components/checkout/PaymentMethods.tsx
git add src/app/checkout/page.tsx
git add src/api/services/orderService.ts
git add ADDRESS_API_README.md

cd ../../../

# Backend - NestJS Services
echo "📦 Adding Backend files..."
cd ecommerce-nestjs-zzzzz

git add apps/orders/prisma/schema.prisma
git add apps/inventory/prisma/schema.prisma
git add apps/payments/prisma/schema.prisma
git add apps/rewards/prisma/schema.prisma
git add apps/orders/src/prisma.service.ts
git add apps/inventory/src/prisma.service.ts
git add apps/payments/src/prisma.service.ts
git add apps/rewards/src/prisma.service.ts
git add apps/orders/src/orders.service.ts
git add apps/orders/src/orders.module.ts
git add apps/gateway/src/gateway.module.ts
git add apps/gateway/src/gateway.controller.ts
git add apps/gateway/src/main.ts
git add apps/orders/src/main.ts
git add Dockerfile.gateway
git add Dockerfile.orders
git add docker-compose.yml
git add package.json
git add PRISMA_SETUP.md
git add DATABASE_SETUP_COMPLETE.md

cd ../

# Documentation
echo "📝 Adding Documentation..."
git add GIT_COMMANDS.md
git add PAYMENT_INTEGRATION.md
git add DEPLOY_GUIDE.md
git add ENV_SETUP.md
git add QUICK_START.md
git add DEPLOY_SUMMARY.md

echo "✅ All files added to git staging area!"
echo ""
echo "📝 Next steps:"
echo "1. Review changes: git status"
echo "2. Commit: git commit -m 'feat: Add address management, payment integration, and database setup'"
echo "3. Push: git push origin main"

