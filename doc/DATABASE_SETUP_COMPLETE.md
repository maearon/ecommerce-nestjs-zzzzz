# ✅ Database Setup Hoàn Tất

## 📋 Đã hoàn thành

### 1. **Prisma Dependencies**
- ✅ Thêm `@prisma/client` và `prisma` vào `package.json`

### 2. **Prisma Schemas**
Đã tạo schema cho 4 services:

- ✅ **Orders**: `apps/orders/prisma/schema.prisma`
  - Order model với status, total, customerId
  - OrderItem model với sku, qty, price
  - OrderStatus enum

- ✅ **Inventory**: `apps/inventory/prisma/schema.prisma`
  - ProductStock (stock management)
  - StockReservation (reservations)
  - StockMovement (audit trail)

- ✅ **Payments**: `apps/payments/prisma/schema.prisma`
  - Payment (payment records)
  - PaymentAttempt (attempt history)
  - Refund (refund records)

- ✅ **Rewards**: `apps/rewards/prisma/schema.prisma`
  - CustomerReward (points & level)
  - RewardTransaction (transactions)
  - RewardRule (earning rules)

### 3. **Prisma Services**
- ✅ Tạo `PrismaService` cho mỗi service
- ✅ Implement `OnModuleInit` và `OnModuleDestroy`
- ✅ Auto connect/disconnect

### 4. **Orders Service Update**
- ✅ Update `OrdersService` để dùng Prisma thay fake ID
- ✅ Create order với items trong database
- ✅ Return order ID thật từ database
- ✅ Update `OrdersModule` để include PrismaService

### 5. **NPM Scripts**
- ✅ Thêm scripts để generate Prisma client
- ✅ Thêm scripts để migrate/push schema

## 🚀 Next Steps

### 1. Tạo Databases trên Neon

Tạo 4 databases riêng:
1. `adidas_order_prod`
2. `adidas_inventory_prod`
3. `adidas_payments_prod`
4. `adidas_rewards_prod`

### 2. Setup Environment Variables

Add vào `.env` hoặc Render:

```env
# Orders
ORDERS_DATABASE_URL=postgres://default:password@ep-xxx-pooler.us-east-1.aws.neon.tech/adidas_order_prod?pgbouncer=true&connect_timeout=15&sslmode=require
ORDERS_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx.us-east-1.aws.neon.tech/adidas_order_prod?connect_timeout=15&sslmode=require

# Inventory
INVENTORY_DATABASE_URL=postgres://default:password@ep-xxx-pooler.us-east-1.aws.neon.tech/adidas_inventory_prod?pgbouncer=true&connect_timeout=15&sslmode=require
INVENTORY_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx.us-east-1.aws.neon.tech/adidas_inventory_prod?connect_timeout=15&sslmode=require

# Payments
PAYMENTS_DATABASE_URL=postgres://default:password@ep-xxx-pooler.us-east-1.aws.neon.tech/adidas_payments_prod?pgbouncer=true&connect_timeout=15&sslmode=require
PAYMENTS_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx.us-east-1.aws.neon.tech/adidas_payments_prod?connect_timeout=15&sslmode=require

# Rewards
REWARDS_DATABASE_URL=postgres://default:password@ep-xxx-pooler.us-east-1.aws.neon.tech/adidas_rewards_prod?pgbouncer=true&connect_timeout=15&sslmode=require
REWARDS_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx.us-east-1.aws.neon.tech/adidas_rewards_prod?connect_timeout=15&sslmode=require
```

### 3. Generate Prisma Clients

```bash
npm run prisma:generate:all
```

Hoặc từng service:
```bash
npm run prisma:generate:orders
npm run prisma:generate:inventory
npm run prisma:generate:payments
npm run prisma:generate:rewards
```

### 4. Push Schemas vào Database

```bash
npm run prisma:push:orders
npm run prisma:push:inventory
npm run prisma:push:payments
npm run prisma:push:rewards
```

### 5. Test

```bash
# Start services
npm run start:nodeA

# Test create order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user-001",
    "items": [
      { "sku": "SKU-123", "qty": 2, "price": 150000 }
    ]
  }'
```

## 📁 File Structure

```
ecommerce-nestjs-zzzzz/
├── apps/
│   ├── orders/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       ├── prisma.service.ts
│   │       └── orders.service.ts (updated)
│   ├── inventory/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       └── prisma.service.ts
│   ├── payments/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       └── prisma.service.ts
│   └── rewards/
│       ├── prisma/
│       │   └── schema.prisma
│       └── src/
│           └── prisma.service.ts
├── package.json (updated)
└── PRISMA_SETUP.md
```

## ⚠️ Lưu ý

1. **Prisma Client**: Mỗi service cần generate client riêng trước khi build
2. **Connection Strings**: Dùng pooler URL cho runtime, direct URL cho migrations
3. **Monorepo**: Mỗi service có schema riêng, generate client riêng
4. **Build Order**: Generate Prisma client trước khi build NestJS

## 📚 Documentation

Xem `PRISMA_SETUP.md` để biết chi tiết setup và troubleshooting.

