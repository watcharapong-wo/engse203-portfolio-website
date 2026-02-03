# Level 2: Blog API with MongoDB

สร้าง REST API สำหรับระบบ Blog พร้อม Authentication, Authorization, และฟีเจอร์ขั้นสูง

## 🎯 เป้าหมาย

- สร้าง RESTful API ด้วย Express + MongoDB
- JWT Authentication และ Authorization
- CRUD Operations สำหรับ Users, Posts, Comments, Categories
- Aggregation Pipeline สำหรับ Statistics
- Pagination, Sorting, Filtering, Search
- Relationships (Referenced Documents)
- Advanced Mongoose Features

## 🏗️ โครงสร้างโปรเจค

```
Level 2 - Blog API/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User schema (authentication)
│   ├── Category.js          # Category schema
│   ├── Post.js              # Post schema
│   └── Comment.js           # Comment schema
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   └── errorHandler.js      # Global error handler
├── utils/
│   └── auth.js              # JWT utilities
├── routes/                  # API routes (TODO)
├── controllers/             # Route handlers (TODO)
├── app.js                   # Express app
├── server.js                # Entry point
├── seed.js                  # Seed data (TODO)
├── package.json
└── .env
```

## 📊 Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  name: String,
  bio: String,
  avatar: String,
  role: 'user' | 'admin',
  isActive: Boolean
}
```

### Category
```javascript
{
  name: String (unique),
  slug: String (auto-generated),
  description: String,
  color: String (hex color)
}
```

### Post
```javascript
{
  title: String,
  slug: String (auto-generated),
  content: String,
  excerpt: String (auto-generated),
  author: ObjectId → User,
  category: ObjectId → Category,
  tags: [String],
  featuredImage: String,
  status: 'draft' | 'published' | 'archived',
  views: Number,
  likes: Number,
  publishedAt: Date
}
```

### Comment
```javascript
{
  post: ObjectId → Post,
  author: ObjectId → User,
  content: String,
  parentComment: ObjectId → Comment (for replies),
  isEdited: Boolean
}
```

## 🚀 เริ่มต้น

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment
```bash
cp .env.example .env
```

แก้ไข `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/workshop15_blog
# หรือใช้ MongoDB Atlas

JWT_SECRET=your-secret-key-change-this
PORT=3000
```

### 3. รัน Server
```bash
npm start
# หรือ
npm run dev  # with nodemon
```

## 📝 API Endpoints (TODO)

### Authentication
- `POST /api/auth/register` - ลงทะเบียน
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดูข้อมูลตัวเอง (ต้อง login)

### Users
- `GET /api/users` - ดู users ทั้งหมด
- `GET /api/users/:id` - ดู user ตาม ID
- `PUT /api/users/:id` - แก้ไขข้อมูล (ตัวเองหรือ admin)
- `DELETE /api/users/:id` - ลบ user (admin only)

### Categories
- `GET /api/categories` - ดู categories ทั้งหมด
- `GET /api/categories/:id` - ดู category ตาม ID
- `POST /api/categories` - สร้าง category (admin)
- `PUT /api/categories/:id` - แก้ไข category (admin)
- `DELETE /api/categories/:id` - ลบ category (admin)

### Posts
- `GET /api/posts` - ดู posts (with pagination, filter, search)
- `GET /api/posts/:id` - ดู post ตาม ID
- `GET /api/posts/slug/:slug` - ดู post ตาม slug
- `POST /api/posts` - สร้าง post (ต้อง login)
- `PUT /api/posts/:id` - แก้ไข post (author หรือ admin)
- `DELETE /api/posts/:id` - ลบ post (author หรือ admin)
- `POST /api/posts/:id/like` - กด like
- `GET /api/posts/stats/popular` - posts ยอดนิยม (aggregation)

### Comments
- `GET /api/posts/:postId/comments` - ดู comments ของ post
- `POST /api/posts/:postId/comments` - สร้าง comment (ต้อง login)
- `PUT /api/comments/:id` - แก้ไข comment (author หรือ admin)
- `DELETE /api/comments/:id` - ลบ comment (author หรือ admin)

## 🔐 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

### ใช้ Token
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Advanced Features

### Pagination
```http
GET /api/posts?page=2&limit=10
```

### Sorting
```http
GET /api/posts?sort=-createdAt  # เรียงจากใหม่ไปเก่า
GET /api/posts?sort=title       # เรียงตาม title A-Z
```

### Filtering
```http
GET /api/posts?category=65abc123&status=published
GET /api/posts?author=65def456
```

### Search
```http
GET /api/posts?search=mongodb
```

### Aggregation (Popular Posts)
```javascript
const popularPosts = await Post.aggregate([
  { $match: { status: 'published' } },
  { $sort: { views: -1, likes: -1 } },
  { $limit: 10 },
  { $lookup: {
    from: 'users',
    localField: 'author',
    foreignField: '_id',
    as: 'authorInfo'
  }},
  { $lookup: {
    from: 'categories',
    localField: 'category',
    foreignField: '_id',
    as: 'categoryInfo'
  }}
])
```

## 🎯 Tasks (ให้นักเรียนทำเอง)

### Phase 1: Authentication (ขั้นต้น)
- [ ] สร้าง auth routes และ controller
- [ ] Implement register, login
- [ ] Test authentication ด้วย Postman/Thunder Client

### Phase 2: CRUD Operations
- [ ] สร้าง Categories routes + controller
- [ ] สร้าง Posts routes + controller  
- [ ] สร้าง Comments routes + controller
- [ ] Test CRUD operations ทั้งหมด

### Phase 3: Advanced Features
- [ ] เพิ่ม Pagination, Sorting, Filtering
- [ ] เพิ่ม Search (text search)
- [ ] สร้าง Aggregation สำหรับ Statistics
- [ ] เพิ่ม Like functionality

### Phase 4: Bonus
- [ ] Implement nested comments (replies)
- [ ] Add file upload สำหรับ avatar/images
- [ ] Add email verification
- [ ] Add rate limiting
- [ ] Add caching (Redis)

## 🧪 Testing

### ใช้ Postman/Thunder Client
1. Import API collection (TODO: สร้าง collection file)
2. Test endpoints ทีละตัว
3. ทดสอบ Authentication flow
4. ทดสอบ Authorization (user vs admin)

### ตัวอย่าง Test Flow
1. Register user ใหม่
2. Login เพื่อรับ token
3. สร้าง category (ต้องเป็น admin)
4. สร้าง post ด้วย token
5. Comment ใน post
6. ดึง popular posts
7. Search posts

## 💡 Tips

- ใช้ `populate()` เพื่อ join กับ documents อื่น
- ใช้ `select()` เพื่อเลือกเฉพาะ fields ที่ต้องการ
- สร้าง indexes สำหรับ fields ที่ query บ่อย
- ใช้ Mongoose middleware สำหรับ auto-generation (slug, excerpt)
- Validate input ด้วย Mongoose schema validation
- Handle errors แบบ centralized

## 📚 เอกสารอ้างอิง

- [Mongoose Populate](https://mongoosejs.com/docs/populate.html)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [JWT Best Practices](https://jwt.io/introduction)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**เริ่มทำได้เลย! สร้าง routes และ controllers ตามโครงสร้างข้างบน 🚀**
