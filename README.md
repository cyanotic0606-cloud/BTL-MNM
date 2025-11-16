<<<<<<< HEAD
# 🛒 ThapCamStore - Shopping Web Application

**Bài tập lớn môn Phát triển phần mềm nguồn mở**

Website thương mại điện tử được xây dựng với Next.js 16 và Airtable, tích hợp các tính năng hiện đại như caching, pagination, search với normalize tiếng Việt.

---

## 📋 Mục lục

- [Thông tin chung](#thông-tin-chung)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tối ưu hóa](#tối-ưu-hóa)
- [API Endpoints](#api-endpoints)

---

## 👥 Thông tin chung

**Nhóm thực hiện:**

- Sinh viên 1: [An Hoàng Anh]
- Sinh viên 2: [Nguyễn Công Thành]
- Sinh viên 3: [Lê Đỗ Gia Vũ]

**Giảng viên hướng dẫn:** [Đào Thị Lệ Thủy]

**Thời gian thực hiện:** Học kỳ 1 - Năm 2025/2026

---

## ✨ Tính năng

### 🏠 **Người dùng**

- ✅ Xem danh sách sản phẩm với phân trang (12 sản phẩm/trang)
- ✅ Tìm kiếm sản phẩm với normalize tiếng Việt (có/không dấu đều được)
- ✅ Lọc sản phẩm theo danh mục
- ✅ Sắp xếp sản phẩm (tên, giá tăng/giảm)
- ✅ Xem chi tiết sản phẩm với nhiều biến thể (kích thước, màu sắc)
- ✅ Giỏ hàng (thêm, xóa, cập nhật số lượng)
- ✅ Đặt hàng và nhận email xác nhận

### 🎨 **Giao diện**

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ UI hiện đại với Tailwind CSS
- ✅ Components tái sử dụng (shadcn/ui)

### ⚡ **Performance**

- ✅ Server-side caching (1 giờ)
- ✅ Tối ưu hóa data fetching với `unstable_cache`
- ✅ Thời gian load: **28-75ms** (sau cache)

### 🔒 **Validation**

- ✅ Validate page number (tự động redirect nếu không hợp lệ)
- ✅ Validate sort parameters
- ✅ Xử lý lỗi 404 cho sản phẩm/danh mục không tồn tại

---

## 🛠 Công nghệ sử dụng

### **Frontend**

- **Next.js 16** - React Framework với App Router
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Zustand** - State management (giỏ hàng)

### **Backend & Database**

- **Airtable** - Cloud database (NoSQL)
- **Next.js API Routes** - Backend endpoints
- **Resend** - Email service

### **Libraries**

- `marked` - Markdown parser
- `react-hook-form` + `zod` - Form validation
- `lucide-react` - Icons
- `sonner` - Toast notifications

---

## 🚀 Cài đặt và chạy

### **Yêu cầu hệ thống**

- Node.js 18+ hoặc 20+
- npm, yarn, hoặc pnpm

### **Bước 1: Clone repository**

```bash
git clone https://github.com/HoangAnhAn04/project-shopping-web.git
cd project-shopping-web
```

### **Bước 2: Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### **Bước 3: Cấu hình môi trường**

Tạo file `.env.local` với nội dung:

```env
NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_ORDERS_TABLE_NAME=orders
RESEND_API_KEY=your_resend_key
```

### **Bước 4: Chạy development server**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### **Bước 5: Build production**

```bash
npm run build
npm start
```

---

## 📁 Cấu trúc thư mục

```
shopping-web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Trang chủ
│   │   ├── products/            # Danh sách & chi tiết sản phẩm
│   │   ├── category/[slug]/     # Trang danh mục
│   │   ├── cart/                # Giỏ hàng
│   │   ├── search/              # Tìm kiếm
│   │   └── api/                 # API routes
│   │       ├── search/          # API tìm kiếm
│   │       └── checkout/        # API đặt hàng
│   ├── components/              # React components
│   │   ├── layout/              # Header, Footer
│   │   ├── pages/               # Page-specific components
│   │   └── ui/                  # Reusable UI components
│   ├── lib/                     # Utilities
│   ├── state/                   # Zustand stores
│   ├── types/                   # TypeScript types
│   └── utils/                   # Helper functions
├── public/                      # Static assets
└── README.md                    # File này
```

---

## ⚡ Tối ưu hóa

### **1. Caching Strategy**

```typescript
// Tất cả trang đều có cache 1 giờ
export const revalidate = 3600;

// Data fetching với unstable_cache
const getAllProducts = unstable_cache(
  async () => await base('products').select({}).all(),
  ['all-products'],
  { revalidate: 3600, tags: ['products'] }
);
```

**Kết quả:**

- Lần đầu: ~1.7s (fetch từ Airtable)
- Lần sau: **28-75ms** (từ cache) - Giảm **95%**

### **2. Validation & Error Handling**

```typescript
// Validate page number
if (isNaN(pageNum) || pageNum < 1) {
  redirect('/products?page=1');
}

// Validate page > totalPages
if (pageNum > totalPages && totalPages > 0) {
  redirect(`/products?page=${totalPages}`);
}
```

### **3. Search Optimization**

- Normalize tiếng Việt (loại bỏ dấu)
- Synonym support
- Fuzzy matching (exact match, starts with, contains)
- Cache 5 phút

---

## 🌐 API Endpoints

### **GET /api/search**

Tìm kiếm sản phẩm

**Query params:**

- `q` (string, required): Từ khóa tìm kiếm

**Response:**

```json
{
  "products": [...],
  "total": 10
}
```

### **POST /api/checkout**

Đặt hàng

**Body:**

```json
{
  "values": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "cartItems": [...],
  "cartTotal": 100000
}
```

**Response:**

```json
{
  "success": true,
  "orderId": "rec123"
}
```

---

## 📊 Performance Metrics

| Trang          | Lần đầu (cold) | Lần sau (cached) | Cải thiện |
| -------------- | -------------- | ---------------- | --------- |
| Homepage       | ~1.5s          | ~50ms            | 97%       |
| Products       | ~1.7s          | ~75ms            | 95%       |
| Category       | ~2.5s          | ~50ms            | 98%       |
| Product Detail | ~1.5s          | ~80ms            | 95%       |

---

## 🐛 Known Issues

- Airtable API key đang dùng `NEXT_PUBLIC_*` (không an toàn cho production)
- Chưa có rate limiting cho APIs
- Chưa sanitize HTML trong product description

**Lưu ý:** Đây là bài tập lớn nên chưa cần fix các issues trên.

---

## 📝 License

This is a student project for educational purposes.

---

## 📞 Liên hệ

- GitHub: [HoangAnhAn04](https://github.com/HoangAnhAn04)
- Repository: [project-shopping-web](https://github.com/HoangAnhAn04/project-shopping-web)
=======
# BTL-MNM
>>>>>>> 49c82ed15de36210b4cfe14c554a4b33eb55911d
