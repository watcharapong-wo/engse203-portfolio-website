# Challenge Tasks - Workshop 14 Level 1

## 🎯 3 ฟีเจอร์ที่ต้องการเพิ่ม

### Challenge 1: Filter by Status ✅

**เป้าหมาย:** ให้สามารถดึง todos ตามสถานะ (done/pending)

**Endpoint:**
```
GET /api/todos?done=true    → ดึงเฉพาะที่เสร็จแล้ว
GET /api/todos?done=false   → ดึงเฉพาะที่ยังไม่เสร็จ
GET /api/todos              → ดึงทั้งหมด
```

**Test Cases:**
```bash
# ได้ทั้งหมด 5 todos
curl http://localhost:3000/api/todos

# ได้เฉพาะที่เสร็จแล้ว (done=1)
curl "http://localhost:3000/api/todos?done=true"

# ได้เฉพาะที่ยังไม่เสร็จ (done=0)
curl "http://localhost:3000/api/todos?done=false"
```

**Implementation Hints:**
```javascript
if (options.done !== undefined) {
  const doneValue = options.done === 'true' ? 1 : 0;
  conditions.push('done = ?');
  params.push(doneValue);
}
```

---

### Challenge 2: Search by Task Name ✅

**เป้าหมาย:** ให้สามารถค้นหา todos จากชื่อ task

**Endpoint:**
```
GET /api/todos?search=ซื้อ          → ค้นหา task ที่มีคำว่า "ซื้อ"
GET /api/todos?search=คณิตศาสตร์    → ค้นหา task ที่มีคำว่า "คณิตศาสตร์"
```

**Test Cases:**
```bash
# ค้นหา task ที่มีคำว่า "ซื้อ"
curl "http://localhost:3000/api/todos?search=ซื้อ"

# Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task": "ซื้อของที่ตลาด",
      "done": 0
    }
  ]
}

# ค้นหา task ที่มีคำว่า "คณิต"
curl "http://localhost:3000/api/todos?search=คณิต"

# ค้นหาแบบไม่ระบุตัวพิมพ์เล็ก/ใหญ่
curl "http://localhost:3000/api/todos?search=ออก"
```

**Implementation Hints:**
```javascript
if (options.search && options.search.trim() !== '') {
  conditions.push('task LIKE ?');
  params.push(`%${options.search}%`);
}
```

---

### Challenge 3: Pagination ✅

**เป้าหมาย:** ให้สามารถแบ่งผลลัพธ์เป็นหน้า

**Endpoint:**
```
GET /api/todos?page=1&limit=10    → หน้า 1 (10 รายการต่อหน้า)
GET /api/todos?page=2&limit=10    → หน้า 2 (10 รายการต่อหน้า)
GET /api/todos?page=1&limit=5     → หน้า 1 (5 รายการต่อหน้า)
```

**Test Cases:**
```bash
# หน้า 1 (10 รายการ)
curl "http://localhost:3000/api/todos?page=1&limit=10"

# Response:
{
  "success": true,
  "data": [... 10 items ...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,           // จำนวนทั้งหมด
    "totalPages": 5,       // หน้าทั้งหมด
    "hasNextPage": true,   // มีหน้าถัดไป?
    "hasPrevPage": false   // มีหน้าก่อนหน้า?
  }
}

# หน้า 2 (5 รายการ)
curl "http://localhost:3000/api/todos?page=2&limit=5"

# Response:
{
  "data": [... 5 items ...],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 50,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}

# Default (ไม่ระบุ page/limit)
curl http://localhost:3000/api/todos
# Default: page=1, limit=10
```

**Implementation Hints:**
```javascript
const page = parseInt(options.page) || 1;
const limit = parseInt(options.limit) || 10;
const offset = (page - 1) * limit;

const sql_paginated = sql + ' LIMIT ? OFFSET ?';
params.push(limit, offset);

// Calculate pagination metadata
const total = countResult['COUNT(*)'];
const totalPages = Math.ceil(total / limit);
const hasNextPage = page < totalPages;
const hasPrevPage = page > 1;
```

---

## 🔗 Combining All Challenges

ฟีเจอร์เหล่านี้สามารถใช้ร่วมกันได้:

```bash
# Filter + Search + Pagination
curl "http://localhost:3000/api/todos?done=true&search=ซื้อ&page=1&limit=5"

# Response: เฉพาะ todos ที่เสร็จแล้ว ที่มี "ซื้อ" ในชื่อ หน้า 1

# Filter + Pagination
curl "http://localhost:3000/api/todos?done=false&page=2&limit=10"

# Search + Pagination
curl "http://localhost:3000/api/todos?search=ทำ&page=1&limit=5"
```

---

## 📝 Implementation Steps

### Step 1: Update src/models/Todo.js

1. แก้ไข `getAll()` method เพื่อรับ options parameter
2. เพิ่ม WHERE conditions สำหรับ filter, search
3. เพิ่ม LIMIT/OFFSET สำหรับ pagination
4. Return pagination metadata

### Step 2: Update src/controllers/todoController.js

1. ดึง query parameters: `done`, `search`, `page`, `limit`
2. ส่งไปยัง `Todo.getAll()` method
3. Return response พร้อม pagination info

### Step 3: Test ทั้ง 3 ฟีเจอร์

```bash
# Start server
npm run dev

# Test Challenge 1
curl "http://localhost:3000/api/todos?done=true"

# Test Challenge 2
curl "http://localhost:3000/api/todos?search=ซื้อ"

# Test Challenge 3
curl "http://localhost:3000/api/todos?page=1&limit=5"

# Test Combined
curl "http://localhost:3000/api/todos?done=false&search=ทำ&page=1&limit=10"
```

---

## 🎓 Learning Outcomes

✅ Query parameters handling
✅ SQL WHERE conditions (dynamic)
✅ SQL LIKE operator (search)
✅ SQL LIMIT/OFFSET (pagination)
✅ COUNT() queries (total count)
✅ Pagination metadata calculation
✅ Combining multiple filters

---

## 📚 Files Provided

- `Todo-CHALLENGES.js` - Updated Todo model with all features
- `todoController-CHALLENGES.js` - Updated controller with query params

---

## 💡 Tips

1. **Default Values:**
   - `page` default = 1
   - `limit` default = 10

2. **SQL LIKE Syntax:**
   - `LIKE '%term%'` - term อยู่ที่ใดก็ได้
   - `LIKE 'term%'` - term ที่ขึ้นต้น
   - `LIKE '%term'` - term ที่ลงท้าย

3. **LIMIT/OFFSET:**
   - `LIMIT 10 OFFSET 0` = หน้า 1
   - `LIMIT 10 OFFSET 10` = หน้า 2
   - `LIMIT 10 OFFSET 20` = หน้า 3

4. **Query String Safe:**
   - ใช้ `%` เป็น wildcard ไม่ใช่ `*`
   - ใช้ `?` parameter binding เพื่อป้องกัน SQL injection

---

## 🚀 Ready to Code?

1. Copy code จาก `*-CHALLENGES.js` files
2. Replace ไฟล์เดิม
3. Test ทั้งหมด
4. Commit & Push!

```bash
git add src/
git commit -m "feat: Add filter, search, and pagination"
git push origin master
```
