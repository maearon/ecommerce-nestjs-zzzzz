# Phân tích tích hợp Checkout Page với Gateway Service

## 📋 Tổng quan

### 1. Checkout Page (Adidas Clone)
**Location**: `adidas-microservices/apps/web/src/app/checkout/page.tsx`

**Hiện trạng**:
- ✅ Có form checkout với đầy đủ thông tin (email, firstName, lastName, address, phone)
- ✅ Lấy cart items từ Redux store
- ✅ Tính toán totals (subtotal, tax, delivery)
- ❌ **CHƯA CÓ** API call để tạo order
- ❌ Chưa có service để gọi Gateway API

**Cấu trúc CartItem**:
```typescript
interface CartItem {
  id: number
  name: string
  price: number
  compareAtPrice?: number | null
  image: string
  color?: string
  size?: string
  quantity: number
  customization?: { name?: string; number?: string }
}
```

### 2. Gateway Service (NestJS Microservices)
**Location**: `ecommerce-nestjs-zzzzz/apps/gateway`

**Hiện trạng**:
- ✅ Có endpoint `POST /orders`
- ✅ Nhận payload: `{ customerId, items: [{ sku, qty, price }] }`
- ✅ Giao tiếp với Orders service qua TCP (port 3001)
- ✅ Trả về order ID

**Cấu trúc payload mong đợi**:
```typescript
{
  customerId: string  // VD: "user-001"
  items: [
    { sku: string, qty: number, price: number }
  ]
}
```

## 🔍 Vấn đề cần giải quyết

### 1. **Mapping dữ liệu không khớp**
- **Checkout**: CartItem có `id, name, price, color, size, quantity`
- **Gateway**: Expects `sku, qty, price`
- **Cần**: Chuyển đổi CartItem → Gateway format

### 2. **Thiếu customerId**
- Checkout có session/user nhưng chưa extract `customerId`
- Gateway cần `customerId` string

### 3. **Thiếu Order Service**
- Chưa có service để gọi Gateway API
- Cần tạo `orderService.ts` tương tự `javaService.ts` và `rubyService.ts`

### 4. **Cấu hình API endpoint**
- Gateway chạy ở port 3000 (default) hoặc `GATEWAY_PORT` env
- Frontend API client đang dùng `http://localhost:9000/api` (API Gateway Express)
- **Cần**: Thêm endpoint cho NestJS Gateway hoặc cấu hình proxy

### 5. **Xử lý response**
- Gateway trả về: `"Order created with ID: {id} OK"`
- Cần parse và hiển thị thông báo cho user

## ✅ Giải pháp đề xuất

### Bước 1: Tạo Order Service
Tạo file `adidas-microservices/apps/web/src/api/services/orderService.ts`:
- Gọi `POST /orders` đến NestJS Gateway
- Map CartItem → Gateway format
- Extract customerId từ session

### Bước 2: Cập nhật Checkout Page
- Import và sử dụng `orderService.createOrder()`
- Xử lý loading state
- Xử lý success/error
- Clear cart sau khi order thành công

### Bước 3: Cấu hình API endpoint
- Thêm NestJS Gateway URL vào env hoặc config
- Hoặc thêm proxy route trong Express API Gateway

### Bước 4: Mapping dữ liệu
- `CartItem.id` → `sku` (hoặc tạo SKU từ id + color + size)
- `CartItem.quantity` → `qty`
- `CartItem.price` → `price`
- `session.user.id` hoặc `session.user.email` → `customerId`

## 📝 Chi tiết implementation

### Order Service Structure
```typescript
interface OrderPayload {
  customerId: string
  items: Array<{
    sku: string
    qty: number
    price: number
  }>
}

interface OrderResponse {
  orderId: string
  message: string
}
```

### Checkout Integration Flow
1. User điền form và click "NEXT" hoặc "PLACE ORDER"
2. Validate form
3. Map cart items → Gateway format
4. Call `orderService.createOrder()`
5. Show loading state
6. On success: Show success message, clear cart, redirect
7. On error: Show error message

## 🚀 Các file cần tạo/sửa

1. **Tạo mới**:
   - `adidas-microservices/apps/web/src/api/services/orderService.ts`

2. **Sửa đổi**:
   - `adidas-microservices/apps/web/src/app/checkout/page.tsx`
   - `adidas-microservices/apps/web/src/api/client.ts` (thêm NestJS Gateway URL nếu cần)

3. **Cấu hình**:
   - `.env` hoặc `.env.local` (thêm NESTJS_GATEWAY_URL)

