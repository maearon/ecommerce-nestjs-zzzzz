# Hướng dẫn tích hợp Checkout với NestJS Gateway

## ✅ Đã hoàn thành

### 1. Tạo Order Service
**File**: `adidas-microservices/apps/web/src/api/services/orderService.ts`

**Chức năng**:
- ✅ Map CartItem từ Redux store sang format Gateway yêu cầu
- ✅ Extract customerId từ session/user
- ✅ Gọi API đến NestJS Gateway để tạo order
- ✅ Parse và trả về order ID từ response

**Key functions**:
- `createOrder(cartItems, customerId)`: Tạo order mới
- `getCustomerIdFromSession(user)`: Lấy customerId từ session
- `mapCartItemsToGatewayFormat(cartItems)`: Chuyển đổi format dữ liệu

### 2. Cập nhật Checkout Page
**File**: `adidas-microservices/apps/web/src/app/checkout/page.tsx`

**Thay đổi**:
- ✅ Import `orderService` và các hooks cần thiết
- ✅ Thêm state cho loading và error handling
- ✅ Cập nhật `handleNext()` để gọi API tạo order
- ✅ Xử lý success: clear cart, redirect đến confirmation page
- ✅ Xử lý error: hiển thị thông báo lỗi
- ✅ UI: Thêm error message display, loading state cho button

## 🔧 Cấu hình cần thiết

### 1. Environment Variables

Thêm vào file `.env.local` hoặc `.env` trong `adidas-microservices/apps/web/`:

```env
# NestJS Gateway URL
NEXT_PUBLIC_NESTJS_GATEWAY_URL=http://localhost:3000
```

**Lưu ý**: 
- Port 3000 là default port của NestJS Gateway (theo `main.ts`)
- Nếu gateway chạy ở port khác, cập nhật env variable này

### 2. Đảm bảo Gateway Service đang chạy

**Trong `ecommerce-nestjs-zzzzz/`**:

```bash
# Terminal 1: Start Gateway
npm run start:gateway

# Terminal 2: Start Orders Service  
npm run start:orders

# Hoặc dùng script có sẵn:
npm run start:nodeA  # Start Gateway + Orders
```

**Kiểm tra**:
- Gateway: http://localhost:3000
- Orders Service: TCP port 3001 (internal)

### 3. Test API

**Test Gateway endpoint trực tiếp**:

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "user-001",
    "items": [
      { "sku": "SKU-123", "qty": 2, "price": 150000 },
      { "sku": "SKU-456", "qty": 1, "price": 95000 }
    ]
  }'
```

## 📊 Luồng dữ liệu

```
┌─────────────────┐
│  Checkout Page  │
│  (Next.js)      │
└────────┬────────┘
         │
         │ 1. User điền form + click "PLACE ORDER"
         │
         ▼
┌─────────────────┐
│  orderService   │
│  .createOrder() │
└────────┬────────┘
         │
         │ 2. Map CartItem → Gateway format
         │    { id, price, quantity } → { sku, qty, price }
         │
         │ 3. Extract customerId từ session
         │
         ▼
┌─────────────────┐
│  POST /orders   │
│  NestJS Gateway │
│  (port 3000)    │
└────────┬────────┘
         │
         │ 4. TCP request đến Orders Service
         │
         ▼
┌─────────────────┐
│ Orders Service  │
│  (port 3001)    │
└────────┬────────┘
         │
         │ 5. Xử lý order, publish event
         │
         ▼
┌─────────────────┐
│  Response       │
│  Order ID       │
└─────────────────┘
```

## 🔄 Mapping dữ liệu

### CartItem (Frontend) → Gateway Format

**Input (Redux CartItem)**:
```typescript
{
  id: 123,
  name: "Product Name",
  price: 150000,
  quantity: 2,
  color: "black",
  size: "M"
}
```

**Output (Gateway Payload)**:
```typescript
{
  sku: "123-black-M",  // Generated from id + color + size
  qty: 2,
  price: 150000
}
```

### Customer ID

**Logged-in user**:
- Ưu tiên: `user.id` → `user.email` → fallback ID

**Guest user**:
- Tạo temporary ID: `guest-{timestamp}`
- Lưu vào localStorage để reuse

## 🚨 Các vấn đề cần lưu ý

### 1. CORS (Cross-Origin Resource Sharing)
Nếu NestJS Gateway và Frontend chạy ở port khác nhau, cần cấu hình CORS:

**Trong `gateway.module.ts` hoặc `main.ts`**:
```typescript
app.enableCors({
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true
});
```

### 2. Order Confirmation Page
Checkout page redirect đến `/order-confirmation` sau khi order thành công. Cần tạo page này nếu chưa có.

### 3. Error Handling
- Network errors: Tự động hiển thị qua `handleNetworkError()`
- Validation errors: Hiển thị trong form
- API errors: Hiển thị trong error message box

### 4. RabbitMQ Setup
Orders service publish event đến RabbitMQ. Đảm bảo RabbitMQ đang chạy nếu cần xử lý events.

## 📝 Checklist trước khi test

- [ ] NestJS Gateway đang chạy (port 3000)
- [ ] Orders Service đang chạy (TCP port 3001)
- [ ] Frontend Next.js app đang chạy (port 3001)
- [ ] Environment variable `NEXT_PUBLIC_NESTJS_GATEWAY_URL` đã được set
- [ ] CORS đã được cấu hình (nếu cần)
- [ ] User có items trong cart
- [ ] Form checkout đã được điền đầy đủ

## 🧪 Test Flow

1. **Thêm items vào cart** trên frontend
2. **Điều hướng đến checkout page**
3. **Điền form**: firstName, lastName, address, phone
4. **Click "PLACE ORDER"**
5. **Kiểm tra**:
   - Button hiển thị "PROCESSING..."
   - Network request đến `POST http://localhost:3000/orders`
   - Cart được clear sau khi thành công
   - Redirect đến `/order-confirmation`

## 🔍 Debug

### Kiểm tra Network Request
Mở Browser DevTools → Network tab:
- Tìm request đến `/orders`
- Kiểm tra request payload
- Kiểm tra response

### Kiểm tra Gateway Logs
Xem logs trong terminal chạy Gateway:
```
[GATEWAY] Sending request to Orders Service with payload: {...}
[GATEWAY] Received response from Orders Service: {...}
```

### Kiểm tra Orders Service Logs
Xem logs trong terminal chạy Orders Service:
```
[ORDERS] Received create_order request with payload: {...}
[ORDERS] Order created with ID: {id}
```

## 📚 Tài liệu tham khảo

- NestJS Gateway: `ecommerce-nestjs-zzzzz/apps/gateway/`
- Orders Service: `ecommerce-nestjs-zzzzz/apps/orders/`
- Checkout Page: `adidas-microservices/apps/web/src/app/checkout/page.tsx`
- Order Service: `adidas-microservices/apps/web/src/api/services/orderService.ts`

