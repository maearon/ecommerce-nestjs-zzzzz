# 📋 Tóm tắt: Deploy NestJS Microservices lên Production

## 🎯 Tình trạng hiện tại

### ✅ Đã có sẵn
- **Frontend**: Đã deploy lên Vercel tại https://adidas-mocha.vercel.app
- **NestJS Services**: Gateway, Orders, Inventory, Payments, Rewards
- **RabbitMQ Setup**: Code đã sẵn sàng, chỉ cần config connection
- **TypeORM + MySQL2**: Có trong dependencies nhưng chưa dùng (Orders service dùng fake ID)

### ❌ Chưa có
- **Database**: Chưa setup (Orders service không persist data)
- **RabbitMQ**: Chưa có instance (cần AWS MQ hoặc CloudAMQP)
- **Production Deploy**: Services chưa deploy lên Render
- **Environment Variables**: Chưa config cho production

## 🔧 Những gì đã được tạo/sửa

### 1. **Docker Files** (cho deploy)
- ✅ `Dockerfile.gateway` - Build Gateway service
- ✅ `Dockerfile.orders` - Build Orders service  
- ✅ `docker-compose.yml` - Chạy cả 2 services cùng network

### 2. **Configuration Updates**
- ✅ `gateway.module.ts` - Dùng env variables cho Orders service host/port
- ✅ `gateway.controller.ts` - Thêm health check endpoint `/health`
- ✅ `orders/main.ts` - Dùng env variables cho TCP host/port
- ✅ `gateway/main.ts` - Đã có CORS config

### 3. **Deployment Files**
- ✅ `render.yaml` - Blueprint cho Render (nhưng có hạn chế với TCP)
- ✅ `DEPLOY_GUIDE.md` - Hướng dẫn chi tiết
- ✅ `ENV_SETUP.md` - Hướng dẫn setup environment variables

## 📊 Kiến trúc Production

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  https://adidas-mocha.vercel.app       │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│      Render (Gateway Service)           │
│  https://nestjs-gateway.onrender.com   │
│  - HTTP REST API (Port 3000)            │
└──────────────┬──────────────────────────┘
               │ TCP (Internal Docker Network)
               ▼
┌─────────────────────────────────────────┐
│      Render/Docker (Orders Service)     │
│  - TCP Microservice (Port 3001)         │
│  - RabbitMQ Publisher                   │
└──────────────┬──────────────────────────┘
               │ AMQP (RabbitMQ)
               ▼
┌─────────────────────────────────────────┐
│      AWS MQ (RabbitMQ)                  │
│  - Fanout Exchange                       │
│  - Event Bus                            │
└──────────────┬──────────────────────────┘
               │
               ├─► Inventory Service (future)
               ├─► Payments Service (future)
               └─► Rewards Service (future)
```

## 🚀 Các bước deploy

### Bước 1: Setup RabbitMQ

**Option A: AWS MQ (Free Tier)**
1. Tạo RabbitMQ broker trên AWS MQ
2. Instance type: `mq.t3.micro` (free tier eligible)
3. Publicly accessible: Yes
4. Security group: Allow port 5672 từ `0.0.0.0/0`
5. Lấy connection info: host, username, password, vhost

**Option B: CloudAMQP (Easier)**
1. Đăng ký CloudAMQP
2. Tạo Little Lemur instance (free tier)
3. Lấy connection URL từ dashboard
4. Parse và extract credentials

### Bước 2: Deploy lên Render

**Option A: Docker Compose (Recommended)**

1. Tạo **Private Service** trên Render
2. Upload `docker-compose.yml`
3. Render sẽ tự động:
   - Build cả Gateway và Orders
   - Chạy trong cùng Docker network
   - TCP communication sẽ work

**Option B: Deploy riêng biệt**

1. **Gateway Service**:
   - Type: Web Service
   - Build: `npm install && npm run build gateway`
   - Start: `node dist/apps/gateway/main.js`
   - Health check: `/health`

2. **Orders Service**:
   - **Vấn đề**: Render không support TCP services trực tiếp
   - **Giải pháp**: 
     - Dùng Docker Compose (Option A)
     - Hoặc chuyển Orders sang HTTP
     - Hoặc chạy cùng Gateway trong 1 service

### Bước 3: Environment Variables

**Trên Render (Gateway Service)**:
```
GATEWAY_PORT=3000
FRONTEND_URL=https://adidas-mocha.vercel.app
RABBITMQ_USER=<từ AWS MQ hoặc CloudAMQP>
RABBITMQ_PASS=<từ AWS MQ hoặc CloudAMQP>
RABBITMQ_HOST=<từ AWS MQ hoặc CloudAMQP>
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
ORDERS_SERVICE_HOST=orders (hoặc localhost nếu cùng service)
ORDERS_SERVICE_PORT=3001
```

**Trên Vercel (Frontend)**:
```
NEXT_PUBLIC_NESTJS_GATEWAY_URL=https://nestjs-gateway.onrender.com
```

### Bước 4: Test

1. **Health Check**:
   ```bash
   curl https://nestjs-gateway.onrender.com/health
   ```

2. **Create Order**:
   ```bash
   curl -X POST https://nestjs-gateway.onrender.com/orders \
     -H "Content-Type: application/json" \
     -d '{"customerId":"test","items":[{"sku":"TEST","qty":1,"price":100}]}'
   ```

3. **Test từ Frontend**:
   - Vào https://adidas-mocha.vercel.app
   - Thêm items vào cart
   - Checkout và place order
   - Kiểm tra network tab

## ⚠️ Lưu ý quan trọng

### 1. TCP Communication

**Vấn đề**: Render không support TCP giữa các services riêng biệt

**Giải pháp**:
- ✅ **Docker Compose**: Chạy Gateway + Orders trong cùng Docker network
- ✅ **Single Service**: Chạy cả 2 trong 1 service (update startup script)
- ⚠️ **HTTP Alternative**: Chuyển Orders sang HTTP thay TCP

### 2. Database

**Hiện tại**: Orders service dùng fake ID, không persist data

**Nếu muốn persist**:
- Setup Upstash Redis (free tier) hoặc Neon PostgreSQL
- Update Orders service để dùng TypeORM
- Add migration files
- Update orders.service.ts để save vào DB

### 3. RabbitMQ Security

- AWS MQ: Cần allow `0.0.0.0/0` trong security group (không an toàn lắm)
- Hoặc dùng VPN/Private network
- CloudAMQP có managed security tốt hơn

### 4. CORS

- Gateway đã enable CORS
- Đảm bảo `FRONTEND_URL` đúng: `https://adidas-mocha.vercel.app`

## 📁 Files đã tạo

### Deployment
- `Dockerfile.gateway`
- `Dockerfile.orders`
- `docker-compose.yml`
- `render.yaml`

### Documentation
- `DEPLOY_GUIDE.md` - Hướng dẫn chi tiết
- `ENV_SETUP.md` - Setup environment variables
- `DEPLOY_SUMMARY.md` - File này

### Code Updates
- `apps/gateway/src/gateway.module.ts` - Env-based config
- `apps/gateway/src/gateway.controller.ts` - Health check
- `apps/orders/src/main.ts` - Env-based TCP config

## ✅ Checklist trước khi deploy

- [ ] Setup RabbitMQ (AWS MQ hoặc CloudAMQP)
- [ ] Lấy RabbitMQ credentials
- [ ] Tạo Render account
- [ ] Deploy Gateway service lên Render
- [ ] Deploy Orders service lên Render (hoặc Docker)
- [ ] Add environment variables vào Render
- [ ] Update Vercel environment variables
- [ ] Test health check endpoint
- [ ] Test create order API
- [ ] Test từ frontend
- [ ] Monitor logs và errors

## 🎯 Next Steps (Optional)

1. **Add Database**: 
   - Setup Upstash/Neon
   - Update Orders service để persist data
   - Add migration files

2. **Add Monitoring**:
   - Sentry cho error tracking
   - LogRocket cho user sessions
   - Render logs monitoring

3. **Add Tests**:
   - Unit tests cho services
   - Integration tests cho API
   - E2E tests cho checkout flow

4. **Scale**:
   - Load balancing cho Gateway
   - Auto-scaling trên Render
   - CDN cho static assets

## 📚 Tài liệu tham khảo

- [Render Documentation](https://render.com/docs)
- [AWS MQ RabbitMQ](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/rabbitmq.html)
- [CloudAMQP](https://www.cloudamqp.com/docs)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)

