# Level 1: Todo App with MongoDB

เรียนรู้พื้นฐาน MongoDB + Mongoose ผ่านการสร้าง Todo API

## 🎯 เป้าหมาย

- เชื่อมต่อ MongoDB ด้วย Mongoose
- สร้าง Schema และ Model
- CRUD Operations
- Query Filters และ Sorting
- Validation
- Aggregation Pipeline

## 📚 API Endpoints

```
GET    /api/todos          → ดึงทั้งหมด (filter, sort)
GET    /api/todos/:id      → ดึงตาม ID
POST   /api/todos          → สร้างใหม่
PUT    /api/todos/:id      → แก้ไขทั้งหมด
PATCH  /api/todos/:id/done → toggle สถานะ
DELETE /api/todos/:id      → ลบ
GET    /api/todos/stats    → สถิติ (aggregation)
```

## 📂 โครงสร้างโปรเจค

```
Level 1 - Guided Workshop/
├── .env.example
├── .gitignore
├── package.json
├── server.js              # Entry point
│
└── src/
    ├── app.js             # Express app setup
    │
    ├── config/
    │   └── database.js    # MongoDB connection
    │
    ├── models/
    │   └── Todo.js        # Mongoose schema
    │
    ├── controllers/
    │   └── todoController.js
    │
    └── routes/
        └── todos.js
```

## 🚀 เริ่มต้น

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไข `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
# หรือใช้ MongoDB Atlas
NODE_ENV=development
```

### 3. รัน Server

```bash
npm start
# หรือ
npm run dev  # with nodemon
```

Server จะรันที่: http://localhost:3000

## 📖 Todo Schema

```javascript
{
  task: String,        // required, max 200 chars
  done: Boolean,       // default: false
  priority: String,    // 'low' | 'medium' | 'high'
  dueDate: Date,
  createdAt: Date,     // auto
  updatedAt: Date      // auto
}
```

### Features:
- ✅ Virtual field: `fullInfo`
- ✅ Instance method: `toggleDone()`
- ✅ Static method: `getStats()`
- ✅ Pre/Post save hooks

## 🧪 ทดสอบ API

### 1. สร้าง Todo

```http
POST http://localhost:3000/api/todos
Content-Type: application/json

{
  "task": "Learn MongoDB",
  "priority": "high",
  "dueDate": "2026-02-10"
}
```

### 2. ดึงทั้งหมด

```http
GET http://localhost:3000/api/todos
```

**Filter by status:**
```http
GET http://localhost:3000/api/todos?done=false
```

**Filter by priority:**
```http
GET http://localhost:3000/api/todos?priority=high
```

**Sort:**
```http
GET http://localhost:3000/api/todos?sort=newest
GET http://localhost:3000/api/todos?sort=oldest
GET http://localhost:3000/api/todos?sort=priority
```

### 3. ดึงตาม ID

```http
GET http://localhost:3000/api/todos/:id
```

### 4. แก้ไข

```http
PUT http://localhost:3000/api/todos/:id
Content-Type: application/json

{
  "task": "Learn MongoDB & Mongoose",
  "done": true,
  "priority": "high"
}
```

### 5. Toggle Status

```http
PATCH http://localhost:3000/api/todos/:id/done
```

### 6. ลบ

```http
DELETE http://localhost:3000/api/todos/:id
```

### 7. ดูสถิติ

```http
GET http://localhost:3000/api/todos/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 3,
    "pending": 7
  }
}
```

## 💡 จุดเด่น

### 1. Mongoose Schema Validation

```javascript
task: {
  type: String,
  required: [true, 'Task is required'],
  trim: true,
  maxlength: [200, 'Task must be less than 200 characters']
}
```

### 2. Enum Values

```javascript
priority: {
  type: String,
  enum: ['low', 'medium', 'high'],
  default: 'medium'
}
```

### 3. Virtual Fields

```javascript
todoSchema.virtual('fullInfo').get(function() {
  return `${this.task} [${this.done ? 'Done' : 'Pending'}]`;
});
```

### 4. Instance Methods

```javascript
todo.toggleDone()  // ใช้งานกับ document instance
```

### 5. Static Methods

```javascript
Todo.getStats()  // ใช้งานกับ Model
```

### 6. Middleware (Hooks)

```javascript
todoSchema.pre('save', function(next) {
  console.log('💾 Saving todo:', this.task);
  next();
});

todoSchema.post('save', function(doc) {
  console.log('✅ Todo saved:', doc._id);
});
```

### 7. Aggregation Pipeline

```javascript
Todo.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      completed: { $sum: { $cond: ['$done', 1, 0] } }
    }
  }
])
```

## 🎓 สิ่งที่เรียนรู้

1. ✅ MongoDB Connection
2. ✅ Mongoose Schema & Models
3. ✅ CRUD Operations
4. ✅ Query Filters
5. ✅ Sorting
6. ✅ Validation
7. ✅ Virtual Fields
8. ✅ Instance & Static Methods
9. ✅ Middleware/Hooks
10. ✅ Aggregation Pipeline
11. ✅ Error Handling

## 🔍 Error Handling

### Validation Error
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": ["Task is required"]
  }
}
```

### Not Found
```json
{
  "success": false,
  "error": {
    "message": "Todo not found"
  }
}
```

### Invalid ID
```json
{
  "success": false,
  "error": {
    "message": "Invalid todo ID"
  }
}
```

## 📚 เอกสารอ้างอิง

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## ⚠️ หมายเหตุ

- ต้องมี MongoDB ติดตั้งและรันอยู่
- หรือใช้ MongoDB Atlas (cloud) แทน
- ใช้ MongoDB Compass (GUI) เพื่อดูข้อมูล

---

**หลังจากทำ Level 1 เสร็จ → ไป Level 2: Blog API! 🚀**
