# 🚀 Hướng dẫn Deploy NestJS Microservices lên Production

## 📊 Kiến trúc hiện tại

### Cấu trúc Services
```
┌─────────────────────────────────────────┐
│         NODE A (Gateway + Orders)       │
├─────────────────────────────────────────┤
│  Gateway (HTTP REST) - Port 3000       │
│  Orders (TCP Microservice) - Port 3001  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   NODE B (Inventory + Payments + Rewards)│
├─────────────────────────────────────────┤
│  Inventory (RabbitMQ Consumer)          │
│  Payments (RabbitMQ Consumer)           │
│  Rewards (RabbitMQ Consumer)            │
└─────────────────────────────────────────┘
```

### Technology Stack
- **Framework**: NestJS 11
- **Database**: TypeORM + MySQL2 (có trong dependencies nhưng chưa dùng)
- **Message Queue**: RabbitMQ (AMQP)
- **Communication**: TCP (Gateway ↔ Orders), RabbitMQ (Events)

## 🎯 Deploy Strategy

### 1. **Render** - Deploy các services
- Gateway (HTTP REST API)
- Orders Service (TCP, có thể chạy cùng Gateway hoặc riêng)

### 2. **Upstash** - Redis (nếu cần cache)
- Hiện tại chưa dùng Redis, nhưng có thể thêm sau

### 3. **AWS Free Tier** - RabbitMQ
- AWS MQ (RabbitMQ) - Free tier: 750 giờ/tháng
- Hoặc dùng CloudAMQP (free tier)

### 4. **Database** - Upstash hoặc Neon
- Upstash Redis (free tier)
- Neon PostgreSQL (free tier) - nếu muốn dùng PostgreSQL thay MySQL

## 📝 Environment Variables

### Gateway Service (Render)

**Required Variables**:
```env
# Gateway Config
GATEWAY_PORT=3000
FRONTEND_URL=https://adidas-mocha.vercel.app

# RabbitMQ (AWS MQ)
RABBITMQ_USER=your-rmq-user
RABBITMQ_PASS=your-rmq-password
RABBITMQ_HOST=your-rmq-host.mq.us-east-1.amazonaws.com
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/

# Orders Service TCP (internal)
ORDERS_SERVICE_HOST=localhost
ORDERS_SERVICE_PORT=3001
```

### Orders Service (Render - riêng hoặc chung với Gateway)

**Required Variables**:
```env
# RabbitMQ (same as Gateway)
RABBITMQ_USER=your-rmq-user
RABBITMQ_PASS=your-rmq-password
RABBITMQ_HOST=your-rmq-host.mq.us-east-1.amazonaws.com
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/

# TCP Config (for Gateway connection)
TCP_PORT=3001
```

### Node B Services (Inventory, Payments, Rewards)

**Required Variables**:
```env
# RabbitMQ (same as Gateway)
RABBITMQ_USER=your-rmq-user
RABBITMQ_PASS=your-rmq-password
RABBITMQ_HOST=your-rmq-host.mq.us-east-1.amazonaws.com
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
```

## 🔧 Setup AWS RabbitMQ (Free Tier)

### 1. Tạo RabbitMQ Instance trên AWS MQ

1. Đăng nhập AWS Console
2. Vào **Amazon MQ** service
3. Click **Create broker**
4. Chọn:
   - **Broker engine**: RabbitMQ
   - **Broker name**: `ecommerce-rmq`
   - **Deployment mode**: Single-instance (free tier)
   - **Instance type**: `mq.t3.micro` (free tier eligible)
   - **Storage**: 20 GB (free tier)
   - **Username**: `admin` (hoặc tùy chọn)
   - **Password**: Tạo password mạnh
   - **VPC**: Chọn default hoặc tạo mới
   - **Subnet**: Chọn public subnet
   - **Security group**: Allow port 5672 (AMQP) và 15672 (Management UI)

5. Click **Create broker**

### 2. Lấy Connection Info

Sau khi tạo xong, vào broker details:
- **Endpoint**: `b-xxxxx-1.mq.us-east-1.amazonaws.com`
- **Username**: Username bạn đã set
- **Password**: Password bạn đã set
- **Port**: 5672 (AMQP)
- **VHost**: `/` (default)

### 3. Security Group

Thêm rule để cho phép connection từ Render:
- **Type**: Custom TCP
- **Port**: 5672
- **Source**: `0.0.0.0/0` (hoặc Render IP ranges nếu có)

## 🚀 Deploy lên Render

### Option 1: Deploy Gateway + Orders cùng 1 service

**Tạo Web Service trên Render**:

1. **Connect Repository**: GitHub repo của bạn
2. **Settings**:
   - **Name**: `nestjs-gateway-orders`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:nodeA` hoặc custom script

3. **Environment Variables**: Thêm tất cả vars ở trên

4. **Health Check**: 
   - Path: `/orders` (POST endpoint)
   - Hoặc tạo GET `/health` endpoint

### Option 2: Deploy riêng biệt (Recommended)

#### Gateway Service

1. **Create Web Service**
2. **Settings**:
   - **Name**: `nestjs-gateway`
   - **Root Directory**: `ecommerce-nestjs-zzzzz`
   - **Build Command**: `npm install && npm run build gateway`
   - **Start Command**: `node dist/apps/gateway/main.js`

3. **Environment Variables**: (như trên)

#### Orders Service

1. **Create Background Worker**
2. **Settings**:
   - **Name**: `nestjs-orders`
   - **Root Directory**: `ecommerce-nestjs-zzzzz`
   - **Build Command**: `npm install && npm run build orders`
   - **Start Command**: `node dist/apps/orders/main.js`

3. **Environment Variables**: (như trên)

**Lưu ý**: Orders service dùng TCP, nên cần:
- Gateway và Orders phải ở cùng network hoặc expose internal service
- Hoặc dùng Redis/Message Queue để communicate

### Option 3: Deploy Gateway + Orders qua Docker (Recommended cho TCP)

Tạo `Dockerfile` và `docker-compose.yml` để chạy cả 2 services cùng network.

## 🐳 Docker Setup (Recommended)

### Dockerfile cho Gateway

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY apps/gateway ./apps/gateway
COPY libs ./libs

RUN npm ci
RUN npm run build gateway

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/apps/gateway/main.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  gateway:
    build:
      context: .
      dockerfile: Dockerfile.gateway
    ports:
      - "3000:3000"
    environment:
      - GATEWAY_PORT=3000
      - FRONTEND_URL=https://adidas-mocha.vercel.app
      - RABBITMQ_USER=${RABBITMQ_USER}
      - RABBITMQ_PASS=${RABBITMQ_PASS}
      - RABBITMQ_HOST=${RABBITMQ_HOST}
      - RABBITMQ_PORT=${RABBITMQ_PORT}
      - RABBITMQ_VHOST=${RABBITMQ_VHOST}
      - ORDERS_SERVICE_HOST=orders
      - ORDERS_SERVICE_PORT=3001
    networks:
      - nestjs-network

  orders:
    build:
      context: .
      dockerfile: Dockerfile.orders
    environment:
      - RABBITMQ_USER=${RABBITMQ_USER}
      - RABBITMQ_PASS=${RABBITMQ_PASS}
      - RABBITMQ_HOST=${RABBITMQ_HOST}
      - RABBITMQ_PORT=${RABBITMQ_PORT}
      - RABBITMQ_VHOST=${RABBITMQ_VHOST}
      - TCP_PORT=3001
    networks:
      - nestjs-network

networks:
  nestjs-network:
    driver: bridge
```

## 🔄 Update Frontend để trỏ đến Production

### Update orderService.ts

```typescript
const NESTJS_GATEWAY_URL = 
  process.env.NEXT_PUBLIC_NESTJS_GATEWAY_URL || 
  "http://localhost:3000"
```

### Update Vercel Environment Variables

Trong Vercel dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_NESTJS_GATEWAY_URL=https://nestjs-gateway.onrender.com
```

## 🧪 Test sau khi deploy

### 1. Test Gateway Health

```bash
curl https://nestjs-gateway.onrender.com/health
```

### 2. Test Create Order

```bash
curl -X POST https://nestjs-gateway.onrender.com/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user-001",
    "items": [
      { "sku": "SKU-123", "qty": 2, "price": 150000 }
    ]
  }'
```

### 3. Test từ Frontend

1. Vào https://adidas-mocha.vercel.app
2. Thêm items vào cart
3. Đi đến checkout
4. Điền form và click "PLACE ORDER"
5. Kiểm tra network tab trong DevTools

## ⚠️ Lưu ý quan trọng

### 1. TCP Communication giữa Gateway và Orders

**Vấn đề**: Render không support internal TCP connections giữa các services

**Giải pháp**:
- **Option A**: Chạy Gateway + Orders cùng 1 service (Docker)
- **Option B**: Chuyển Orders sang RabbitMQ consumer (như Inventory, Payments)
- **Option C**: Dùng HTTP thay TCP (update gateway.module.ts)

### 2. RabbitMQ Connection

- AWS MQ có thể có IP whitelist
- Render có dynamic IPs → cần allow `0.0.0.0/0` hoặc dùng VPN
- Hoặc dùng CloudAMQP (có free tier, dễ setup hơn)

### 3. Database

Hiện tại Orders service chưa dùng DB (dùng fake ID). Nếu muốn persist data:
- Set up Upstash Redis hoặc Neon PostgreSQL
- Update Orders service để dùng TypeORM
- Add migration files

### 4. CORS

Gateway đã enable CORS, nhưng cần đảm bảo `FRONTEND_URL` đúng:
```env
FRONTEND_URL=https://adidas-mocha.vercel.app
```

## 📚 Tài nguyên

- [Render Documentation](https://render.com/docs)
- [AWS MQ RabbitMQ](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/rabbitmq.html)
- [Upstash Redis](https://upstash.com/docs)
- [Neon PostgreSQL](https://neon.tech/docs)

## ✅ Checklist

- [ ] Tạo AWS MQ RabbitMQ instance
- [ ] Lấy RabbitMQ connection info
- [ ] Tạo Render services (Gateway + Orders)
- [ ] Add environment variables
- [ ] Deploy và test
- [ ] Update Vercel env variables
- [ ] Test từ frontend
- [ ] Monitor logs và errors

