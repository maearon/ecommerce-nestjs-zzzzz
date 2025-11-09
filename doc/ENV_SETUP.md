# 🔐 Environment Variables Setup

## 📋 Tổng hợp các biến môi trường cần thiết

### 🌐 Gateway Service (Render)

```env
# Gateway Config
GATEWAY_PORT=3000
FRONTEND_URL=https://adidas-mocha.vercel.app

# RabbitMQ (AWS MQ hoặc CloudAMQP)
RABBITMQ_USER=admin
RABBITMQ_PASS=your-secure-password
RABBITMQ_HOST=b-xxxxx-1.mq.us-east-1.amazonaws.com
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/

# Orders Service Connection (Internal trong Docker)
ORDERS_SERVICE_HOST=orders
ORDERS_SERVICE_PORT=3001
```

### 📦 Orders Service (Render hoặc Docker)

```env
# RabbitMQ (same as Gateway)
RABBITMQ_USER=admin
RABBITMQ_PASS=your-secure-password
RABBITMQ_HOST=b-xxxxx-1.mq.us-east-1.amazonaws.com
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/

# TCP Config
TCP_PORT=3001
TCP_HOST=0.0.0.0
```

### 🎨 Frontend (Vercel)

```env
NEXT_PUBLIC_NESTJS_GATEWAY_URL=https://nestjs-gateway.onrender.com
```

## 🚀 Cách setup trên Render

### 1. Tạo Gateway Service

1. Vào [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect GitHub repository
4. Settings:
   - **Name**: `nestjs-gateway`
   - **Root Directory**: `ecommerce-nestjs-zzzzz` (nếu repo là monorepo)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build gateway`
   - **Start Command**: `node dist/apps/gateway/main.js`
   - **Plan**: Free (hoặc Starter cho production)

5. **Environment Variables**:
   - Click **Environment** tab
   - Add từng variable như trên
   - **Lưu ý**: `RABBITMQ_USER`, `RABBITMQ_PASS`, `RABBITMQ_HOST` nên set là **Secret** (không sync)

### 2. Tạo Orders Service

**Vấn đề**: Render không support TCP services trực tiếp

**Giải pháp A: Dùng Docker Compose (Recommended)**

1. Tạo **Private Service** trên Render
2. Upload `docker-compose.yml`
3. Render sẽ tự động build và deploy cả 2 services

**Giải pháp B: Chuyển Orders sang HTTP**

Update Orders service để expose HTTP endpoint thay vì TCP.

**Giải pháp C: Chạy cùng Gateway**

Update startup script để chạy cả Gateway và Orders trong 1 service.

## 🔧 Setup AWS RabbitMQ

### 1. Tạo Broker

1. AWS Console → **Amazon MQ**
2. **Create broker**
3. Settings:
   - **Engine type**: RabbitMQ
   - **Broker name**: `ecommerce-rmq`
   - **Deployment mode**: Single-instance (free tier)
   - **Instance type**: `mq.t3.micro`
   - **Username**: `admin` (hoặc tùy chọn)
   - **Password**: Tạo mạnh
   - **VPC**: Default hoặc tạo mới
   - **Publicly accessible**: Yes (để Render có thể connect)

4. **Security Group**:
   - Allow inbound: Port 5672 (AMQP) từ `0.0.0.0/0`
   - Allow inbound: Port 15672 (Management UI) từ your IP

### 2. Lấy Connection Info

Sau khi broker created:
- **Endpoint**: `b-xxxxx-1.mq.us-east-1.amazonaws.com`
- **Username**: Username bạn đã set
- **Password**: Password bạn đã set
- **Port**: 5672
- **VHost**: `/`

### 3. Test Connection

```bash
# Test từ local trước
export RABBITMQ_USER=admin
export RABBITMQ_PASS=your-password
export RABBITMQ_HOST=b-xxxxx-1.mq.us-east-1.amazonaws.com
export RABBITMQ_PORT=5672
export RABBITMQ_VHOST=/

# Chạy local
npm run start:nodeA
```

## 🐰 Alternative: CloudAMQP (Easier)

Nếu AWS MQ phức tạp, dùng CloudAMQP:

1. Đăng ký tại [CloudAMQP](https://www.cloudamqp.com/)
2. Tạo instance (free tier: Little Lemur)
3. Lấy connection URL từ dashboard
4. Parse URL:
   ```
   amqp://user:pass@host:port/vhost
   ```
5. Extract:
   - `RABBITMQ_USER`: user
   - `RABBITMQ_PASS`: pass
   - `RABBITMQ_HOST`: host
   - `RABBITMQ_PORT`: 5672 (default)
   - `RABBITMQ_VHOST`: vhost (thường là username)

## 📝 Vercel Environment Variables

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `adidas-microservices`
3. **Settings** → **Environment Variables**
4. Add:
   ```
   NEXT_PUBLIC_NESTJS_GATEWAY_URL = https://nestjs-gateway.onrender.com
   ```
5. **Save** và **Redeploy**

## ✅ Checklist

- [ ] AWS MQ RabbitMQ instance created
- [ ] Security group configured (port 5672 open)
- [ ] RabbitMQ connection info lấy được
- [ ] Render Gateway service created
- [ ] Environment variables added vào Render
- [ ] Render Orders service created (hoặc Docker)
- [ ] Vercel environment variable updated
- [ ] Test connection từ local
- [ ] Test từ production

## 🧪 Test Script

```bash
# Test Gateway health
curl https://nestjs-gateway.onrender.com/health

# Test create order
curl -X POST https://nestjs-gateway.onrender.com/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "test-user",
    "items": [
      { "sku": "TEST-123", "qty": 1, "price": 100000 }
    ]
  }'
```

## 🔍 Debug

Nếu gặp lỗi:

1. **Connection refused**: Kiểm tra security group
2. **Authentication failed**: Kiểm tra username/password
3. **Timeout**: Kiểm tra host/port đúng chưa
4. **VHost error**: Thử dùng `/` hoặc username

