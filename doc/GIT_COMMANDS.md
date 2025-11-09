# 📦 Git Commands - Add Files for Deployment

## 🚀 Commands để add và commit các file đã tạo

### 1. Address Management API (MongoDB + Better Auth)

```bash
cd adidas-microservices/apps/web

# Add Address Model
git add src/models/Address.ts

# Add Helper Functions
git add src/lib/utils/getUserFromRequest.ts

# Add API Routes
git add src/app/api/v1/addresses/route.ts
git add src/app/api/v1/addresses/\[addressId\]/route.ts
git add src/app/api/v1/addresses/search/route.ts
git add src/app/api/v1/addresses/default/route.ts

# Add Documentation
git add ADDRESS_API_README.md
```

### 2. Payment Integration (Stripe, MoMo, VNPay, COD)

```bash
# Add Payment API Routes
git add src/app/api/v1/payments/create-intent/route.ts
git add src/app/api/v1/payments/webhook/momo/route.ts
git add src/app/api/v1/payments/webhook/vnpay/route.ts

# Add Payment Component
git add src/components/checkout/PaymentMethods.tsx

# Update Checkout Page
git add src/app/checkout/page.tsx
```

### 3. Order Service Integration

```bash
# Add Order Service
git add src/api/services/orderService.ts

# Update Checkout (already added above)
```

### 4. NestJS Microservices (Database Setup)

```bash
cd ../..

# Add Prisma Schemas
git add ecommerce-nestjs-zzzzz/apps/orders/prisma/schema.prisma
git add ecommerce-nestjs-zzzzz/apps/inventory/prisma/schema.prisma
git add ecommerce-nestjs-zzzzz/apps/payments/prisma/schema.prisma
git add ecommerce-nestjs-zzzzz/apps/rewards/prisma/schema.prisma

# Add Prisma Services
git add ecommerce-nestjs-zzzzz/apps/orders/src/prisma.service.ts
git add ecommerce-nestjs-zzzzz/apps/inventory/src/prisma.service.ts
git add ecommerce-nestjs-zzzzz/apps/payments/src/prisma.service.ts
git add ecommerce-nestjs-zzzzz/apps/rewards/src/prisma.service.ts

# Update Orders Service
git add ecommerce-nestjs-zzzzz/apps/orders/src/orders.service.ts
git add ecommerce-nestjs-zzzzz/apps/orders/src/orders.module.ts

# Update Gateway
git add ecommerce-nestjs-zzzzz/apps/gateway/src/gateway.module.ts
git add ecommerce-nestjs-zzzzz/apps/gateway/src/gateway.controller.ts
git add ecommerce-nestjs-zzzzz/apps/gateway/src/main.ts

# Update Orders Main
git add ecommerce-nestjs-zzzzz/apps/orders/src/main.ts

# Add Docker Files
git add ecommerce-nestjs-zzzzz/Dockerfile.gateway
git add ecommerce-nestjs-zzzzz/Dockerfile.orders
git add ecommerce-nestjs-zzzzz/docker-compose.yml

# Add Package.json updates
git add ecommerce-nestjs-zzzzz/package.json

# Add Documentation
git add ecommerce-nestjs-zzzzz/PRISMA_SETUP.md
git add ecommerce-nestjs-zzzzz/DEPLOY_GUIDE.md
git add ecommerce-nestjs-zzzzz/ENV_SETUP.md
git add ecommerce-nestjs-zzzzz/DEPLOY_SUMMARY.md
git add ecommerce-nestjs-zzzzz/DATABASE_SETUP_COMPLETE.md
git add QUICK_START.md
git add DEPLOY_GUIDE.md
git add ENV_SETUP.md
```

## 📝 All-in-One Command

```bash
# Từ root directory
cd "C:\Users\manhn\Downloads\ecommerce-nestjs-zzzzz.com[05_11_25]"

# Frontend - Address & Payment
cd adidas-microservices/apps/web
git add src/models/Address.ts
git add src/lib/utils/getUserFromRequest.ts
git add src/app/api/v1/addresses/
git add src/app/api/v1/payments/
git add src/components/checkout/PaymentMethods.tsx
git add src/app/checkout/page.tsx
git add src/api/services/orderService.ts
git add ADDRESS_API_README.md

# Backend - NestJS Services
cd ../../../
cd ecommerce-nestjs-zzzzz
git add apps/*/prisma/schema.prisma
git add apps/*/src/prisma.service.ts
git add apps/orders/src/orders.service.ts
git add apps/orders/src/orders.module.ts
git add apps/gateway/src/gateway.module.ts
git add apps/gateway/src/gateway.controller.ts
git add apps/gateway/src/main.ts
git add apps/orders/src/main.ts
git add Dockerfile.*
git add docker-compose.yml
git add package.json
git add *.md

# Commit
git commit -m "feat: Add address management API, payment integration (Stripe/MoMo/VNPay/COD), and Prisma database setup for microservices"
```

## 🔐 Environment Variables cần thêm vào Vercel

### Frontend (adidas-microservices/apps/web)

```env
# NestJS Gateway
NEXT_PUBLIC_NESTJS_GATEWAY_URL=https://nestjs-gateway.onrender.com

# Google Places API (for address search)
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# MoMo (Vietnam)
MOMO_PARTNER_CODE=your-partner-code
MOMO_ACCESS_KEY=your-access-key
MOMO_SECRET_KEY=your-secret-key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# VNPay (Vietnam)
VNPAY_TMN_CODE=your-tmn-code
VNPAY_SECRET_KEY=your-secret-key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# App URL
NEXT_PUBLIC_APP_URL=https://adidas-mocha.vercel.app
```

## ✅ Checklist

- [ ] All files added to git
- [ ] Environment variables set in Vercel
- [ ] Payment gateway credentials configured
- [ ] Google Places API key added
- [ ] Test address search functionality
- [ ] Test payment methods (Stripe, MoMo, VNPay, COD)
- [ ] Test checkout flow end-to-end

