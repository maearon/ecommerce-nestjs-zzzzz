# 🔧 Build Fix Summary

## ✅ Đã sửa các lỗi build

### 1. **PostCSS Config Error**
**Lỗi:** `module is not defined in ES module scope`

**Nguyên nhân:** `postcss.config.js` đang dùng CommonJS (`module.exports`) nhưng `package.json` có `"type": "module"`

**Fix:** Đổi `postcss.config.js` sang ES module syntax:
```js
// Before
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

// After
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 2. **Mongoose Module Not Found**
**Lỗi:** `Module not found: Can't resolve 'mongoose'`

**Nguyên nhân:** Package `mongoose` chưa được install

**Fix:** Thêm vào `package.json` dependencies:
```json
"mongoose": "^8.9.0",
```

### 3. **Import Path Issues**
**Lỗi:** Import path với `.js` extension có thể gây confusion

**Fix:** Đổi import paths từ `@/models/address.model.js` thành `@/models/address.model` (bỏ extension)

### 4. **Unused Import**
**Fix:** Xóa import `Address` không cần thiết trong `webhook/momo/route.ts`

## 📦 Next Steps

Sau khi fix, chạy:

```bash
cd adidas-microservices/apps/web
npm install  # Install mongoose
npm run build  # Test build
```

## ✅ Files Changed

- ✅ `postcss.config.js` - Đổi sang ES module
- ✅ `package.json` - Thêm mongoose dependency
- ✅ `src/app/api/v1/addresses/route.ts` - Fix import path
- ✅ `src/app/api/v1/addresses/[addressId]/route.ts` - Fix import path
- ✅ `src/app/api/v1/addresses/default/route.ts` - Fix import path
- ✅ `src/app/api/v1/payments/webhook/momo/route.ts` - Remove unused import

