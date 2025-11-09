# ⚡ Quick Start - Deploy NestJS lên Production

## 🎯 Tóm tắt nhanh

### Hiện trạng
- ✅ Frontend đã deploy: https://adidas-mocha.vercel.app
- ❌ Backend chưa deploy: Cần deploy Gateway + Orders lên Render
- ❌ RabbitMQ chưa có: Cần setup AWS MQ hoặc CloudAMQP

## 🚀 3 Bước Deploy

### Bước 1: Setup RabbitMQ (5 phút)

**Option A: CloudAMQP (Dễ nhất)**
1. Đăng ký: https://www.cloudamqp.com/
2. Tạo instance: **Little Lemur** (free)
3. Lấy connection URL từ dashboard
4. Parse URL để lấy: user, pass, host, port, vhost

**Option B: AWS MQ (Free tier AWS)**
1. AWS Console → Amazon MQ
2. Create broker: RabbitMQ, Single-instance, mq.t3.micro
3. Publicly accessible: Yes
4. Security group: Allow port 5672 từ 0.0.0.0/0
5. Lấy endpoint, username, password

### Bước 2: Deploy lên Render (10 phút)

**Cách 1: Docker Compose (Recommended)**

1. Tạo **Private Service** trên Render
2. Connect GitHub repo
3. Settings:
   - **Root Directory**: `ecommerce-nestjs-zzzzz`
   - **Dockerfile Path**: `docker-compose.yml`
   - **Docker Context**: `.`
4. Environment Variables:
   ```
   RABBITMQ_USER=<từ Bước 1>
   RABBITMQ_PASS=<từ Bước 1>
   RABBITMQ_HOST=<từ Bước 1>
   RABBITMQ_PORT=5672
   RABBITMQ_VHOST=/
   GATEWAY_PORT=3000
   FRONTEND_URL=https://adidas-mocha.vercel.app
   ORDERS_SERVICE_HOST=orders
   ORDERS_SERVICE_PORT=3001
   ```
5. Deploy!

**Cách 2: Deploy riêng Gateway (TCP chưa support)**

1. Tạo **Web Service** trên Render
2. Settings:
   - **Name**: `nestjs-gateway`
   - **Root Directory**: `ecommerce-nestjs-zzzzz`
   - **Build Command**: `npm install && npm run build gateway`
   - **Start Command**: `node dist/apps/gateway/main.js`
   - **Health Check**: `/health`
3. Environment Variables: (như trên)
4. **Lưu ý**: Orders service cần deploy riêng hoặc chạy cùng Gateway

### Bước 3: Update Frontend (2 phút)

1. Vào Vercel Dashboard
2. Project: `adidas-microservices`
3. Settings → Environment Variables
4. Add:
   ```
   NEXT_PUBLIC_NESTJS_GATEWAY_URL=https://nestjs-gateway.onrender.com
   ```
5. Redeploy

## ✅ Test

```bash
# Health check
curl https://nestjs-gateway.onrender.com/health

# Test order
curl -X POST https://nestjs-gateway.onrender.com/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"test","items":[{"sku":"TEST","qty":1,"price":100}]}'
```

## 📝 Checklist

- [ ] RabbitMQ setup (CloudAMQP hoặc AWS MQ)
- [ ] Lấy RabbitMQ credentials
- [ ] Render service created
- [ ] Environment variables added
- [ ] Deploy successful
- [ ] Health check passed
- [ ] Vercel env updated
- [ ] Frontend redeployed
- [ ] Test từ frontend thành công

## 🆘 Troubleshooting

**Connection refused**: Kiểm tra security group (port 5672)
**Authentication failed**: Kiểm tra username/password
**Timeout**: Kiểm tra host/port đúng chưa
**CORS error**: Kiểm tra FRONTEND_URL đúng chưa

## 📚 Chi tiết

Xem `DEPLOY_GUIDE.md` và `ENV_SETUP.md` để biết thêm chi tiết.

