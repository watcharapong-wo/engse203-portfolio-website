# Todo API - Postman Test Collection

## Base URL
```
http://localhost:3000/api/todos
```

---

## 1. CREATE Todo

**POST** `http://localhost:3000/api/todos`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "task": "เรียน MongoDB",
  "priority": "high"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65b9f5e9c8d0a1234567890a",
    "task": "เรียน MongoDB",
    "done": false,
    "priority": "high",
    "createdAt": "2024-01-31T10:00:00.000Z",
    "updatedAt": "2024-01-31T10:00:00.000Z",
    "__v": 0
  }
}
```

---

## 2. GET All Todos

**GET** `http://localhost:3000/api/todos`

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

## 3. GET with Filters

**GET** `http://localhost:3000/api/todos?done=false&priority=high`

Filter by done status and priority

---

## 4. GET with Sorting

**GET** `http://localhost:3000/api/todos?sort=newest`

Options: `newest`, `oldest`, `priority`

---

## 🌟 CHALLENGE 1: Search

**GET** `http://localhost:3000/api/todos?search=เรียน`

Search in task field (case-insensitive)

---

## 🌟 CHALLENGE 2: Pagination

**GET** `http://localhost:3000/api/todos?page=1&limit=10`

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response includes:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

---

## 🌟 CHALLENGE 3: Overdue Filter

**GET** `http://localhost:3000/api/todos?overdue=true`

Shows only incomplete todos past their due date

---

## 🌟 Combined Filters Example

**GET** `http://localhost:3000/api/todos?search=เรียน&priority=high&done=false&page=1&limit=5`

Combine multiple filters together!

---

## 5. GET by ID

**GET** `http://localhost:3000/api/todos/:id`

Replace `:id` with actual todo ID

---

## 6. UPDATE Todo (Full)

**PUT** `http://localhost:3000/api/todos/:id`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "task": "เรียน MongoDB และ Mongoose",
  "done": true,
  "priority": "high"
}
```

---

## 7. TOGGLE Done Status

**PATCH** `http://localhost:3000/api/todos/:id/done`

Toggles the `done` status (true ↔ false)

---

## 8. DELETE Todo

**DELETE** `http://localhost:3000/api/todos/:id`

---

## 9. GET Statistics

**GET** `http://localhost:3000/api/todos/stats`

**Expected Response:**
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

---

## Test Sequence

1. Create 3-5 todos with different priorities
2. Get all todos
3. Filter by `done=false`
4. Toggle done status on one todo
5. Update a todo
6. Get statistics
7. Delete a todo
8. Verify deletion

---

## Notes

- Replace `:id` with actual MongoDB ObjectID from responses
- Server must be running on port 3000
- MongoDB must be connected
- All responses include `success` field
