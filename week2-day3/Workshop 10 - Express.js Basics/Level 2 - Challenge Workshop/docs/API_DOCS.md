# 📚 Book Library API - Documentation

## 📋 ภาพรวม
Book Library API เป็น RESTful API สำหรับจัดการข้อมูลหนังสือและผู้แต่ง

**Base URL:** `http://localhost:3000`

---

## 🔑 API Endpoints

### Authors Endpoints

#### 1. GET /api/authors
ดึงรายการผู้แต่งทั้งหมด

**Query Parameters:**
- `country` (optional) - กรองตามประเทศ

**Example Request:**
```bash
curl http://localhost:3000/api/authors
curl "http://localhost:3000/api/authors?country=UK"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

#### 2. GET /api/authors/:id
ดึงข้อมูลผู้แต่งตาม ID พร้อมหนังสือทั้งหมด

**Example Request:**
```bash
curl http://localhost:3000/api/authors/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "country": "UK",
    "birthYear": 1965,
    "books": [...]
  }
}
```

---

#### 3. POST /api/authors
สร้างผู้แต่งใหม่

**Request Body:**
```json
{
  "name": "Agatha Christie",
  "country": "UK",
  "birthYear": 1890
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Agatha Christie","country":"UK","birthYear":1890}'
```

**Response:**
```json
{
  "success": true,
  "message": "Author created",
  "data": {...}
}
```

---

#### 4. PUT /api/authors/:id
อัพเดทข้อมูลผู้แต่ง

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/authors/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"J.K. Rowling Updated"}'
```

---

#### 5. DELETE /api/authors/:id
ลบผู้แต่ง (ต้องไม่มีหนังสือ)

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/authors/1
```

---

### Books Endpoints

#### 1. GET /api/books
ดึงรายการหนังสือทั้งหมด พร้อม pagination

**Query Parameters:**
- `genre` (optional) - กรองตามประเภท
- `page` (optional, default: 1) - หน้าที่ต้องการ
- `limit` (optional, default: 10) - จำนวนต่อหน้า

**Example Request:**
```bash
curl http://localhost:3000/api/books
curl "http://localhost:3000/api/books?genre=Fantasy&page=1&limit=5"
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "pageSize": 10,
    "totalItems": 3
  },
  "count": 3,
  "data": [...]
}
```

---

#### 2. GET /api/books/search
ค้นหาหนังสือจากชื่อ

**Query Parameters:**
- `q` (required) - คำค้นหา

**Example Request:**
```bash
curl "http://localhost:3000/api/books/search?q=harry"
```

---

#### 3. GET /api/books/:id
ดึงข้อมูลหนังสือตาม ID

**Example Request:**
```bash
curl http://localhost:3000/api/books/1
```

---

#### 4. POST /api/books
สร้างหนังสือใหม่

**Request Body:**
```json
{
  "title": "The Hobbit",
  "authorId": 1,
  "year": 1937,
  "genre": "Fantasy",
  "isbn": "9780547928227"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit","authorId":1,"year":1937,"genre":"Fantasy","isbn":"9780547928227"}'
```

---

#### 5. PUT /api/books/:id
อัพเดทหนังสือ

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

---

#### 6. DELETE /api/books/:id
ลบหนังสือ

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

---

## 🛡️ Validation Rules

### Author Validation
- `name`: string, 2-100 characters, required
- `country`: string, 2-50 characters, required
- `birthYear`: number, 1000-current year, required

### Book Validation
- `title`: string, 1-200 characters, required
- `authorId`: number (integer), required
- `year`: number, 1000-current year, required
- `genre`: string, 2-50 characters, required
- `isbn`: string, pattern: `[0-9-]+`, required

---

## ⚡ Rate Limiting
- **Window:** 15 minutes (900,000 ms)
- **Max Requests:** 100 requests per IP
- **Response:** 429 Too Many Requests

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "details": ["..."]
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Not Found - /api/invalid"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests"
}
```

---

## 🧪 การทดสอบ

### ติดตั้ง dependencies:
```bash
cd "Level 2 - Challenge Workshop"
npm install
```

### รัน server:
```bash
npm run dev
```

### ทดสอบ endpoints:
```bash
# Test welcome
curl http://localhost:3000

# Test authors
curl http://localhost:3000/api/authors

# Test books
curl http://localhost:3000/api/books

# Test search
curl "http://localhost:3000/api/books/search?q=1984"
```

---

## ✅ Checklist การทำงาน

### ต้องเขียนเอง (30%)
- [ ] middleware/validate.js - ทำ validation logic
- [ ] middleware/rateLimit.js - ทำ rate limiting logic
- [ ] routes/authors.js - ทำ CRUD operations
- [ ] routes/books.js - ทำ CRUD + Search + Pagination

### ให้มาแล้ว (70%)
- [x] .env, .gitignore, package.json
- [x] data/dataStore.js
- [x] server.js
- [x] app.js
- [x] middleware/errorHandler.js

---

## 📝 บันทึกผลการทดสอบ

### วันที่ทดสอบ: [ระบุวันที่]
### ผู้ทดสอบ: [ระบุชื่อ]

#### ผลการทดสอบ Authors API:
- [ ] GET /api/authors
- [ ] GET /api/authors/:id
- [ ] POST /api/authors
- [ ] PUT /api/authors/:id
- [ ] DELETE /api/authors/:id

#### ผลการทดสอบ Books API:
- [ ] GET /api/books
- [ ] GET /api/books/search
- [ ] GET /api/books/:id
- [ ] POST /api/books
- [ ] PUT /api/books/:id
- [ ] DELETE /api/books/:id

#### ผลการทดสอบ Features:
- [ ] Validation (Joi)
- [ ] Rate Limiting
- [ ] Pagination
- [ ] Search
- [ ] Error Handling

---

## 💡 Tips
1. อ่าน TODO comments ในแต่ละไฟล์อย่างละเอียด
2. ทดสอบทีละ endpoint
3. ใช้ Postman หรือ curl ในการทดสอบ
4. ดู console logs เพื่อ debug
5. ตรวจสอบ validation errors
