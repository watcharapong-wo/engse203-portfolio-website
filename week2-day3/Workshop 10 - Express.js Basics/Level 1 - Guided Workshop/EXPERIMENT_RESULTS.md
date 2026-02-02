# 📊 ผลการทดลอง - Workshop 10 Level 1

## ผู้ทดลอง
- **ชื่อ:** [ระบุชื่อ]
- **วันที่:** [ระบุวันที่]
- **Workshop:** Express.js Basics - Level 1 Guided Workshop

---

## การทดสอบ Endpoints

### 1. GET /api/users - Get All Users

**Request:**
```bash
curl http://localhost:3000/api/users
```

**Response:**
```json
[บันทึก response ที่ได้]
```

**สังเกต:**
- [บันทึกสิ่งที่สังเกตเห็น]
- [logger middleware แสดงผลอย่างไร]
- [request timer แสดงเวลาเท่าไหร่]

---

### 2. GET /api/users/:id - Get User by ID

**Request:**
```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [route parameter ทำงานถูกต้องหรือไม่]
- [ทดลองใส่ ID ที่ไม่มีอยู่แล้วได้ 404 หรือไม่]

---

### 3. GET /api/users?role=admin - Filter by Role

**Request:**
```bash
curl "http://localhost:3000/api/users?role=admin"
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [query parameter กรองข้อมูลได้ถูกต้องหรือไม่]
- [ลองกรอง role อื่นดู]

---

### 4. GET /api/users/search?q=john - Search Users (Challenge 1)

**Request:**
```bash
curl "http://localhost:3000/api/users/search?q=john"
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [ค้นหาใน name และ email ได้หรือไม่]
- [case-insensitive ทำงานหรือไม่]

---

### 5. GET /api/users?page=1&limit=2 - Pagination (Challenge 2)

**Request:**
```bash
curl "http://localhost:3000/api/users?page=1&limit=2"
```

**Response:**
```json
[บันทึก response พร้อม pagination metadata]
```

**สังเกต:**
- [pagination metadata มีครบหรือไม่]
- [ลองเปลี่ยน page และ limit ดู]
- [hasNextPage, hasPrevPage ทำงานถูกต้องหรือไม่]

---

### 6. POST /api/users - Create New User

**Request:**
```bash
curl -Method POST http://localhost:3000/api/users \
  -Headers @{"Content-Type"="application/json"} \
  -Body '{"name":"Alice","email":"alice@example.com","role":"user"}'
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [user ถูกสร้างด้วย ID อัตโนมัติหรือไม่]
- [status code 201 หรือไม่]

---

### 7. POST /api/users - Validation Testing (Challenge 3)

#### Test 1: Missing name
**Request:**
```bash
curl -Method POST http://localhost:3000/api/users \
  -Headers @{"Content-Type"="application/json"} \
  -Body '{"email":"test@example.com"}'
```

**Response:**
```json
[บันทึก error response]
```

**สังเกต:**
- [validateUser middleware ทำงานหรือไม่]
- [error message ชัดเจนหรือไม่]

#### Test 2: Invalid email format
**Request:**
```bash
curl -Method POST http://localhost:3000/api/users \
  -Headers @{"Content-Type"="application/json"} \
  -Body '{"name":"Test","email":"invalid-email"}'
```

**Response:**
```json
[บันทึก error response]
```

**สังเกต:**
- [email validation ทำงานถูกต้องหรือไม่]

#### Test 3: Name too short
**Request:**
```bash
curl -Method POST http://localhost:3000/api/users \
  -Headers @{"Content-Type"="application/json"} \
  -Body '{"name":"A","email":"test@example.com"}'
```

**Response:**
```json
[บันทึก error response]
```

**สังเกต:**
- [name length validation ทำงานหรือไม่]

---

### 8. PUT /api/users/:id - Update User

**Request:**
```bash
curl -Method PUT http://localhost:3000/api/users/1 \
  -Headers @{"Content-Type"="application/json"} \
  -Body '{"name":"John Updated"}'
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [validateUserUpdate middleware ทำงานหรือไม่]
- [update เฉพาะ field ที่ส่งมาได้หรือไม่]

---

### 9. DELETE /api/users/:id - Delete User

**Request:**
```bash
curl -Method DELETE http://localhost:3000/api/users/3
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [user ถูกลบจริงหรือไม่]
- [ลองเรียก GET อีกครั้งยังมี user นี้อยู่หรือไม่]

---

### 10. GET /nonexistent - Test 404 Handler

**Request:**
```bash
curl http://localhost:3000/nonexistent
```

**Response:**
```json
[บันทึก error response]
```

**สังเกต:**
- [notFoundHandler middleware ทำงานหรือไม่]
- [error message บอกว่า URL ไหน not found หรือไม่]

---

### 11. GET /health - Health Check

**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [แสดง uptime ถูกต้องหรือไม่]
- [timestamp เป็น ISO format หรือไม่]

---

### 12. GET /info - Server Info

**Request:**
```bash
curl http://localhost:3000/info
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [แสดงข้อมูล Node.js version, platform, memory usage]

---

## การทดสอบ Middleware

### 1. Logger Middleware

**สังเกตจาก Console:**
```
[บันทึก log messages ที่เห็นใน console]
เช่น: [2026-02-02T10:30:45.123Z] GET /api/users
```

**การทำงาน:**
- [ ] แสดง timestamp
- [ ] แสดง HTTP method
- [ ] แสดง URL path
- [ ] เรียกทุกครั้งที่มี request

---

### 2. Request Timer Middleware

**สังเกตจาก Console:**
```
[บันทึก timing messages]
เช่น: Request took 5ms
```

**การทำงาน:**
- [ ] คำนวณเวลาที่ใช้ใน request
- [ ] แสดงเวลาเป็น milliseconds
- [ ] ทำงานหลัง response

---

### 3. Morgan Middleware

**สังเกตจาก Console:**
```
[บันทึก morgan log format]
เช่น: GET /api/users 200 15.234 ms - 245
```

**การทำงาน:**
- [ ] แสดง HTTP method, path, status code
- [ ] แสดง response time
- [ ] แสดง response size

---

### 4. Error Handler Middleware

**การทดสอบ:**
- [ ] ทดสอบ 404 Not Found
- [ ] ทดสอบ validation errors (400)
- [ ] ตรวจสอบว่า stack trace แสดงใน development mode หรือไม่

**สังเกต:**
```
[บันทึกการทำงานของ error handler]
```

---

### 5. Static File Middleware

**การทดสอบ:**
- เปิด browser ไปที่ http://localhost:3000
- เปิด browser ไปที่ http://localhost:3000/index.html

**สังเกต:**
- [ ] แสดง HTML page สวยงาม
- [ ] แสดง endpoints documentation
- [ ] CSS styling ทำงานถูกต้อง

---

## การทดสอบ Products API

### GET /api/products

**Request:**
```bash
curl http://localhost:3000/api/products
```

**Response:**
```json
[บันทึก response]
```

---

### GET /api/products?category=electronics&minPrice=100

**Request:**
```bash
curl "http://localhost:3000/api/products?category=electronics&minPrice=100"
```

**Response:**
```json
[บันทึก response]
```

**สังเกต:**
- [กรองตาม category และ price ได้หรือไม่]

---

## ปัญหาที่พบและวิธีแก้ไข

### ปัญหา 1:
**คำอธิบาย:** [อธิบายปัญหาที่พบ]

**วิธีแก้ไข:** [อธิบายวิธีแก้ไข]

---

### ปัญหา 2:
**คำอธิบาย:** [อธิบายปัญหาที่พบ]

**วิธีแก้ไข:** [อธิบายวิธีแก้ไข]

---

## สรุปผลการทดลอง

### สิ่งที่ได้เรียนรู้

1. **Express.js Basics:**
   - [บันทึกสิ่งที่เรียนรู้เกี่ยวกับ Express.js]

2. **Middleware:**
   - [บันทึกความเข้าใจเกี่ยวกับ middleware]
   - Application-level middleware vs Router-level middleware

3. **Routing:**
   - [บันทึกความเข้าใจเกี่ยวกับ routing]
   - Route parameters vs Query strings

4. **Error Handling:**
   - [บันทึกความเข้าใจเกี่ยวกับ error handling]
   - 404 handler และ error handler แตกต่างกันอย่างไร

5. **Validation:**
   - [บันทึกความเข้าใจเกี่ยวกับ validation middleware]

---

### Challenges ที่ทำสำเร็จ

- [x] Challenge 1: Search Endpoint
- [x] Challenge 2: Pagination
- [x] Challenge 3: Validation Middleware

---

### ข้อเสนอแนะเพิ่มเติม

[บันทึกข้อเสนอแนะหรือสิ่งที่อยากเรียนรู้เพิ่มเติม]

---

### Screenshots

[แนบ screenshots ของผลการทดสอบ (ถ้ามี)]

---

## คะแนนประเมินตนเอง

- ความเข้าใจ Express.js: __/10
- ความเข้าใจ Middleware: __/10
- ความเข้าใจ Routing: __/10
- ความเข้าใจ Error Handling: __/10
- Challenge Completion: __/10

**รวม:** __/50

---

**หมายเหตุ:** ไฟล์นี้เป็นแบบฟอร์มสำหรับบันทึกผลการทดลอง กรุณากรอกข้อมูลให้ครบถ้วนหลังจากทำการทดสอบ
