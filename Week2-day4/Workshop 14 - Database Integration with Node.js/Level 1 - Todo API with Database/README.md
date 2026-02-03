# Workshop 14 - Level 1: Todo API with Database

📌 **ภาพรวม**

Workshop นี้สอนการสร้าง Todo API ที่เชื่อมต่อกับ SQLite database โดยครอบคลุม:

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ RESTful endpoints
- ✅ Error handling
- ✅ Input validation
- ✅ Database integration

## 🎯 API Endpoints

```
GET    /api/todos          → ดึง todos ทั้งหมด
GET    /api/todos/:id      → ดึง todo ตาม ID
POST   /api/todos          → สร้าง todo ใหม่
PATCH  /api/todos/:id      → อัพเดทสถานะ
DELETE /api/todos/:id      → ลบ todo
GET    /api/todos/stats    → ดูสถิติ
```

## 📁 โครงสร้างโปรเจค

```
Level 1 - Todo API with Database/
├── .env                        # Environment variables
├── .gitignore
├── package.json
├── server.js                   # Entry point
│
├── database/
│   ├── schema.sql             # Database structure
│   ├── seed.sql               # Sample data
│   └── database.db            # (auto-created)
│
└── src/
    ├── app.js                 # Express setup
    ├── db.js                  # Database connection
    │
    ├── models/
    │   └── Todo.js            # Database queries
    │
    ├── controllers/
    │   └── todoController.js  # Business logic
    │
    └── routes/
        └── todos.js           # API endpoints
```

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Reset Database (Create schema + seed data)

```bash
npm run db:reset
```

### 3. Start Development Server

```bash
npm run dev
```

Output:
```
✅ Connected to database
🚀 Server running on http://localhost:3000
📚 API docs: http://localhost:3000/api/todos
```

## 🧪 API Testing

### 1. Get All Todos

```bash
curl http://localhost:3000/api/todos
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task": "ซื้อของที่ตลาด",
      "done": 0,
      "created_at": "2024-01-31 10:00:00",
      "updated_at": "2024-01-31 10:00:00"
    }
  ]
}
```

### 2. Create Todo

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"task":"เรียน MongoDB"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 6,
    "task": "เรียน MongoDB",
    "done": 0,
    "created_at": "2024-01-31 11:00:00",
    "updated_at": "2024-01-31 11:00:00"
  }
}
```

### 3. Update Status

```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

### 4. Delete Todo

```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

### 5. Get Stats

```bash
curl http://localhost:3000/api/todos/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "total": 5,
    "completed": 2,
    "pending": 3
  }
}
```

## 📚 Key Concepts

### Database Module (src/db.js)

- Manages SQLite connection
- Handles schema creation
- Provides seed data functionality
- Singleton pattern for single connection

### Model Layer (src/models/Todo.js)

- Encapsulates all database queries
- Uses prepared statements (SQL injection prevention)
- Clean separation of concerns

### Controller Layer (src/controllers/todoController.js)

- Handles request/response
- Input validation
- Error handling
- Business logic

### Routes (src/routes/todos.js)

- Maps HTTP methods to controllers
- Route order matters: `/stats` before `/:id`

## 🔒 Security Features

- ✅ Prepared statements (prevents SQL injection)
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Status codes (201 for creation, 204 for deletion, 404 for not found)

## 📖 Learning Points

1. **RESTful API design** - Proper use of HTTP methods
2. **Database integration** - CRUD operations with SQLite
3. **Error handling** - Try-catch blocks and status codes
4. **Separation of concerns** - Models, Controllers, Routes
5. **Middleware** - CORS, JSON parsing, logging
6. **Validation** - Input sanitization and error responses

## 🎓 Challenge Tasks

1. ✅ Add task filtering by status (done/pending)
2. ✅ Add search functionality by task name
3. ✅ Add pagination support
4. ✅ Add date filtering (created between dates)
5. ✅ Add priority levels to todos

## 📝 Notes

- Database is SQLite (file-based)
- All timestamps use ISO format
- Response format is consistent JSON
- Error messages are descriptive and include error codes
