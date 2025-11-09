# 💳 Payment Integration Guide

## 📋 Payment Methods Supported

### International Methods
1. **Stripe** - Credit/Debit Cards (Visa, Mastercard, AmEx, Discover)
2. **PayPal** - PayPal wallet
3. **Klarna** - 4 Interest-Free Installments
4. **Afterpay** - 4 Interest-Free Payments
5. **Affirm** - Buy now, pay later

### Vietnam-Specific Methods
1. **MoMo** - MoMo E-Wallet
2. **VNPay** - Bank transfer, ATM, e-wallet
3. **COD** - Cash on Delivery (Thanh toán khi nhận hàng)

## 🔧 Setup Instructions

### 1. Stripe Setup

1. Tạo account tại [Stripe Dashboard](https://dashboard.stripe.com/)
2. Lấy API keys:
   - **Secret Key**: `sk_test_...` (test) hoặc `sk_live_...` (production)
   - **Publishable Key**: `pk_test_...` hoặc `pk_live_...`
3. Add vào Vercel environment variables:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

### 2. MoMo Setup

1. Đăng ký tại [MoMo Developer Portal](https://developers.momo.vn/)
2. Tạo app và lấy credentials:
   - Partner Code
   - Access Key
   - Secret Key
3. Add vào Vercel:
   ```env
   MOMO_PARTNER_CODE=your-partner-code
   MOMO_ACCESS_KEY=your-access-key
   MOMO_SECRET_KEY=your-secret-key
   MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
   ```

### 3. VNPay Setup

1. Đăng ký tại [VNPay](https://www.vnpay.vn/)
2. Lấy credentials:
   - TMN Code
   - Secret Key
3. Add vào Vercel:
   ```env
   VNPAY_TMN_CODE=your-tmn-code
   VNPAY_SECRET_KEY=your-secret-key
   VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   ```

### 4. COD (Cash on Delivery)

Không cần setup, tự động available cho Vietnam.

## 🔄 Payment Flow

### Stripe Flow
```
1. User selects Stripe
2. Create Payment Intent → Returns clientSecret
3. Use Stripe Elements (client-side) hoặc Stripe Checkout
4. User confirms payment
5. Redirect to confirmation page
```

### MoMo Flow
```
1. User selects MoMo
2. Create Payment → Returns payUrl
3. Redirect user to MoMo payment page
4. User completes payment on MoMo
5. MoMo redirects back to callback URL
6. Verify payment status
7. Redirect to confirmation
```

### VNPay Flow
```
1. User selects VNPay
2. Create Payment → Returns payUrl
3. Redirect user to VNPay payment page
4. User completes payment
5. VNPay redirects back with params
6. Verify signature
7. Redirect to confirmation
```

### COD Flow
```
1. User selects COD
2. Create order (no payment intent needed)
3. Order status: PENDING
4. Redirect to confirmation
5. Payment collected on delivery
```

## 📝 API Endpoints

### Create Payment Intent
**POST** `/api/v1/payments/create-intent`

**Request:**
```json
{
  "orderId": "order-123",
  "amount": 302.17,
  "currency": "USD",
  "paymentMethod": "stripe" // or "momo", "vnpay", "cod"
}
```

**Response (Stripe):**
```json
{
  "paymentId": "pi_xxx",
  "clientSecret": "pi_xxx_secret_xxx",
  "method": "stripe",
  "status": "requires_payment_method"
}
```

**Response (MoMo/VNPay):**
```json
{
  "paymentId": "order-123",
  "payUrl": "https://payment-gateway.com/pay/...",
  "method": "momo",
  "status": "pending"
}
```

**Response (COD):**
```json
{
  "paymentId": "cod-1234567890",
  "method": "cod",
  "status": "pending",
  "message": "Payment will be collected on delivery"
}
```

## 🎨 UI Integration

Payment methods được hiển thị tự động dựa trên country:
- **US/International**: Stripe, PayPal, Klarna, Afterpay, Affirm
- **Vietnam**: Stripe, PayPal, MoMo, VNPay, COD

Country được detect từ:
1. Selected address country
2. User location
3. Browser locale

## 🔐 Security

- All payment data encrypted in transit (HTTPS)
- Payment credentials stored in environment variables
- Webhook signatures verified
- User authentication required for all payment operations

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [MoMo API Documentation](https://developers.momo.vn/)
- [VNPay Integration Guide](https://sandbox.vnpayment.vn/apis/)
- [COD Best Practices](https://www.adidas.com/us/help/faq/payment)

