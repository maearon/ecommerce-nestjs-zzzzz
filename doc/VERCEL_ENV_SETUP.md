# 🔐 Vercel Environment Variables Setup

## 📋 Required Environment Variables

### 1. NestJS Gateway (Backend)
```env
NEXT_PUBLIC_NESTJS_GATEWAY_URL=https://nestjs-gateway.onrender.com
```

### 2. Google Places API (Address Search)
```env
GOOGLE_PLACES_API_KEY=AIzaSy...your-key-here
```

### 3. Payment Gateways

#### Stripe
```env
STRIPE_SECRET_KEY=sk_live_51...your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_51...your-publishable-key
```

#### MoMo (Vietnam)
```env
MOMO_PARTNER_CODE=MOMOX...your-partner-code
MOMO_ACCESS_KEY=your-access-key
MOMO_SECRET_KEY=your-secret-key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
```

#### VNPay (Vietnam)
```env
VNPAY_TMN_CODE=your-tmn-code
VNPAY_SECRET_KEY=your-secret-key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### 4. App URL
```env
NEXT_PUBLIC_APP_URL=https://adidas-mocha.vercel.app
```

## 🚀 Setup trên Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `adidas-microservices` hoặc project name của bạn
3. **Settings** → **Environment Variables**
4. Add từng variable như trên
5. **Save** và **Redeploy**

## 🔍 Verify

Sau khi deploy, kiểm tra:
- Address search hoạt động (Google Places API)
- Payment methods hiển thị đúng
- Checkout flow hoàn chỉnh

