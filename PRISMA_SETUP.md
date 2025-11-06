# 🗄️ Prisma Setup Guide - Multi-Database Configuration

## 📋 Tổng quan

Mỗi service có database riêng với Prisma schema riêng:

- **Orders Service**: `apps/orders/prisma/schema.prisma`
- **Inventory Service**: `apps/inventory/prisma/schema.prisma`
- **Payments Service**: `apps/payments/prisma/schema.prisma`
- **Rewards Service**: `apps/rewards/prisma/schema.prisma`

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

Dependencies đã được thêm:
- `@prisma/client` (runtime)
- `prisma` (dev tool)

### 2. Tạo Database trên Neon

Tạo 4 databases riêng biệt trên Neon PostgreSQL:

1. **Orders DB**: `adidas_order_prod`
2. **Inventory DB**: `adidas_inventory_prod`
3. **Payments DB**: `adidas_payments_prod`
4. **Rewards DB**: `adidas_rewards_prod`

Mỗi database sẽ có connection string riêng:
```
postgres://default:password@ep-bold-voice-a4yp8xc9-pooler.us-east-1.aws.neon.tech/adidas_order_prod?pgbouncer=true&connect_timeout=15&sslmode=require
```

### 3. Environment Variables

Tạo file `.env` hoặc set trong Render:

**Orders Service**:
```env
ORDERS_DATABASE_URL=postgres://default:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/adidas_order_prod?pgbouncer=true&connect_timeout=15&sslmode=require
ORDERS_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx-xxx.us-east-1.aws.neon.tech/adidas_order_prod?connect_timeout=15&sslmode=require
```

**Inventory Service**:
```env
INVENTORY_DATABASE_URL=postgres://default:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/adidas_inventory_prod?pgbouncer=true&connect_timeout=15&sslmode=require
INVENTORY_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx-xxx.us-east-1.aws.neon.tech/adidas_inventory_prod?connect_timeout=15&sslmode=require
```

**Payments Service**:
```env
PAYMENTS_DATABASE_URL=postgres://default:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/adidas_payments_prod?pgbouncer=true&connect_timeout=15&sslmode=require
PAYMENTS_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx-xxx.us-east-1.aws.neon.tech/adidas_payments_prod?connect_timeout=15&sslmode=require
```

**Rewards Service**:
```env
REWARDS_DATABASE_URL=postgres://default:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/adidas_rewards_prod?pgbouncer=true&connect_timeout=15&sslmode=require
REWARDS_DATABASE_DIRECT_URL=postgres://default:password@ep-xxx-xxx.us-east-1.aws.neon.tech/adidas_rewards_prod?connect_timeout=15&sslmode=require
```

**Lưu ý**:
- `DATABASE_URL`: Dùng connection pooler (pgbouncer) - cho production
- `DIRECT_URL`: Direct connection - cho migrations

### 4. Generate Prisma Client

Với monorepo structure, cần generate client cho từng service:

```bash
# Orders
cd apps/orders
npx prisma generate --schema=./prisma/schema.prisma

# Inventory
cd apps/inventory
npx prisma generate --schema=./prisma/schema.prisma

# Payments
cd apps/payments
npx prisma generate --schema=./prisma/schema.prisma

# Rewards
cd apps/rewards
npx prisma generate --schema=./prisma/schema.prisma
```

Hoặc từ root:
```bash
# Orders
npx prisma generate --schema=apps/orders/prisma/schema.prisma

# Inventory
npx prisma generate --schema=apps/inventory/prisma/schema.prisma

# Payments
npx prisma generate --schema=apps/payments/prisma/schema.prisma

# Rewards
npx prisma generate --schema=apps/rewards/prisma/schema.prisma
```

### 5. Run Migrations

```bash
# Orders
npx prisma migrate dev --schema=apps/orders/prisma/schema.prisma --name init

# Inventory
npx prisma migrate dev --schema=apps/inventory/prisma/schema.prisma --name init

# Payments
npx prisma migrate dev --schema=apps/payments/prisma/schema.prisma --name init

# Rewards
npx prisma migrate dev --schema=apps/rewards/prisma/schema.prisma --name init
```

Hoặc push schema (không tạo migration):
```bash
# Orders
npx prisma db push --schema=apps/orders/prisma/schema.prisma

# Inventory
npx prisma db push --schema=apps/inventory/prisma/schema.prisma

# Payments
npx prisma db push --schema=apps/payments/prisma/schema.prisma

# Rewards
npx prisma db push --schema=apps/rewards/prisma/schema.prisma
```

### 6. Update package.json Scripts

Thêm scripts vào `package.json`:

```json
{
  "scripts": {
    "prisma:generate:orders": "prisma generate --schema=apps/orders/prisma/schema.prisma",
    "prisma:generate:inventory": "prisma generate --schema=apps/inventory/prisma/schema.prisma",
    "prisma:generate:payments": "prisma generate --schema=apps/payments/prisma/schema.prisma",
    "prisma:generate:rewards": "prisma generate --schema=apps/rewards/prisma/schema.prisma",
    "prisma:generate:all": "npm run prisma:generate:orders && npm run prisma:generate:inventory && npm run prisma:generate:payments && npm run prisma:generate:rewards",
    "prisma:migrate:orders": "prisma migrate dev --schema=apps/orders/prisma/schema.prisma",
    "prisma:migrate:inventory": "prisma migrate dev --schema=apps/inventory/prisma/schema.prisma",
    "prisma:migrate:payments": "prisma migrate dev --schema=apps/payments/prisma/schema.prisma",
    "prisma:migrate:rewards": "prisma migrate dev --schema=apps/rewards/prisma/schema.prisma"
  }
}
```

## 📊 Database Schemas

### Orders Schema

- `Order`: Order với status, total, customerId
- `OrderItem`: Items trong order (sku, qty, price)
- `OrderStatus` enum: CREATED, PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED

### Inventory Schema

- `ProductStock`: Stock management (sku, quantity, reserved, available)
- `StockReservation`: Reservations cho orders
- `StockMovement`: Audit trail cho stock changes

### Payments Schema

- `Payment`: Payment records với status, method, transactionId
- `PaymentAttempt`: Payment attempt history
- `Refund`: Refund records

### Rewards Schema

- `CustomerReward`: Customer points và level
- `RewardTransaction`: Points transactions
- `RewardRule`: Rules for earning points

## 🚀 Production Deployment

### Build Commands (Render)

**Orders Service**:
```bash
npm install && npm run prisma:generate:orders && npm run build orders
```

**Inventory Service**:
```bash
npm install && npm run prisma:generate:inventory && npm run build inventory
```

**Payments Service**:
```bash
npm install && npm run prisma:generate:payments && npm run build payments
```

**Rewards Service**:
```bash
npm install && npm run prisma:generate:rewards && npm run build rewards
```

### Environment Variables (Render)

Add tất cả database URLs cho từng service như đã nêu ở trên.

## ⚠️ Lưu ý

1. **Prisma Client Path**: Mỗi service generate client riêng, import từ `@prisma/client` (sẽ resolve đúng client dựa trên schema)

2. **Multiple Prisma Clients**: Trong monorepo, Prisma sẽ tự động detect schema dựa trên context. Đảm bảo schema path đúng khi generate.

3. **Connection Pooling**: Dùng `DATABASE_URL` với pgbouncer cho production, `DIRECT_URL` cho migrations.

4. **Migration Files**: Mỗi service có migration folder riêng: `apps/{service}/prisma/migrations`

## 🧪 Test

```bash
# Test Orders service
cd apps/orders
npm run start:dev

# Test với Prisma Studio
npx prisma studio --schema=apps/orders/prisma/schema.prisma
```

## 📚 Resources

- [Prisma Multi-Schema](https://www.prisma.io/docs/guides/database/multi-schema)
- [Neon Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Prisma Migrate](https://www.prisma.io/docs/guides/migrate)

