# 📦 Hướng dẫn Git Add và Deploy

## 🚀 Quick Start

### Option 1: Chạy PowerShell Script (Windows)

```powershell
# Từ root directory
cd "C:\Users\manhn\Downloads\ecommerce-nestjs-zzzzz.com[05_11_25]"
.\git-add-all.ps1
```

### Option 2: Copy Commands từ File

Mở file `GIT_ADD_ALL_FILES.txt` và copy từng nhóm commands để chạy.

### Option 3: Manual Git Add

Xem commands chi tiết bên dưới.

## 📝 Git Commands

### Frontend Files (adidas-microservices)

```bash
cd adidas-microservices/apps/web

# Address Management
git add src/models/Address.ts
git add src/lib/utils/getUserFromRequest.ts
git add src/app/api/v1/addresses/route.ts
git add "src/app/api/v1/addresses/[addressId]/route.ts"
git add src/app/api/v1/addresses/search/route.ts
git add src/app/api/v1/addresses/default/route.ts

# Payment Integration
git add src/app/api/v1/payments/create-intent/route.ts
git add src/app/api/v1/payments/webhook/momo/route.ts
git add src/app/api/v1/payments/webhook/vnpay/route.ts

# Components
git add src/components/checkout/PaymentMethods.tsx

# Updated Files
git add src/app/checkout/page.tsx
git add src/api/services/orderService.ts

# Documentation
git add ADDRESS_API_README.md
```

### Backend Files (ecommerce-nestjs-zzzzz)

```bash
cd ../../../
cd ecommerce-nestjs-zzzzz

# Prisma Schemas
git add apps/orders/prisma/schema.prisma
git add apps/inventory/prisma/schema.prisma
git add apps/payments/prisma/schema.prisma
git add apps/rewards/prisma/schema.prisma

# Prisma Services
git add apps/orders/src/prisma.service.ts
git add apps/inventory/src/prisma.service.ts
git add apps/payments/src/prisma.service.ts
git add apps/rewards/src/prisma.service.ts

# Updated Services
git add apps/orders/src/orders.service.ts
git add apps/orders/src/orders.module.ts
git add apps/gateway/src/gateway.module.ts
git add apps/gateway/src/gateway.controller.ts
git add apps/gateway/src/main.ts
git add apps/orders/src/main.ts

# Docker
git add Dockerfile.gateway
git add Dockerfile.orders
git add docker-compose.yml

# Package
git add package.json

# Documentation
git add PRISMA_SETUP.md
git add DATABASE_SETUP_COMPLETE.md
```

### Root Documentation

```bash
cd ../

git add GIT_COMMANDS.md
git add PAYMENT_INTEGRATION.md
git add DEPLOY_GUIDE.md
git add ENV_SETUP.md
git add QUICK_START.md
git add DEPLOY_SUMMARY.md
git add CHECKOUT_FEATURES.md
git add VERCEL_ENV_SETUP.md
git add FINAL_SUMMARY.md
git add README_GIT_ADD.md
```

## ✅ Commit

```bash
git commit -m "feat: Add address management API, payment integration (Stripe/MoMo/VNPay/COD), Prisma database setup, and checkout enhancements

- Add address CRUD API with MongoDB and Better Auth
- Integrate Stripe, PayPal, MoMo, VNPay, and COD payment methods
- Add address search with Google Places API
- Update checkout page with payment selection
- Setup Prisma schemas for Orders, Inventory, Payments, Rewards services
- Replace fake IDs with real database storage
- Add Docker configuration for deployment
- Update Gateway with environment-based configuration"
```

## 🚀 Push

```bash
git push origin main
# hoặc
git push origin master
```

## 📋 Checklist sau khi push

- [ ] Vercel tự động deploy frontend
- [ ] Set environment variables trong Vercel
- [ ] Deploy NestJS services lên Render
- [ ] Test checkout flow
- [ ] Test payment methods
- [ ] Verify address search hoạt động

