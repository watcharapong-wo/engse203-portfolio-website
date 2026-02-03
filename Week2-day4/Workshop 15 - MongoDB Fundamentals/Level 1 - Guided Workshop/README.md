# Level 1: MongoDB CRUD Operations

เรียนรู้พื้นฐาน MongoDB และ Mongoose ผ่านระบบจัดการข้อมูลนักเรียน

## 🎯 เป้าหมาย

- เชื่อมต่อ MongoDB ด้วย Mongoose
- สร้าง Schema และ Model
- CRUD Operations (Create, Read, Update, Delete)
- Query และ Filter ข้อมูล
- Aggregation Pipeline พื้นฐาน
- Validation และ Middleware

## 📚 สิ่งที่จะได้เรียนรู้

### 1. MongoDB Connection
```javascript
mongoose.connect(MONGODB_URI)
```

### 2. Schema Definition
```javascript
const schema = new mongoose.Schema({
  field: { type: String, required: true }
})
```

### 3. CRUD Operations
- **Create**: `create()`, `insertMany()`
- **Read**: `find()`, `findById()`, `findOne()`
- **Update**: `findByIdAndUpdate()`, `updateMany()`
- **Delete**: `findByIdAndDelete()`, `deleteMany()`

### 4. Query Operators
- `$eq`, `$gt`, `$gte`, `$lt`, `$lte`
- `$in`, `$nin`
- `$and`, `$or`, `$not`
- `$regex`, `$exists`

### 5. Aggregation
```javascript
Student.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$major', count: { $sum: 1 } } }
])
```

## 🚀 เริ่มต้น

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไข `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/workshop15_students
# หรือใช้ MongoDB Atlas (แนะนำ)
```

### 3. รันโปรแกรม

```bash
npm start
```

หรือใช้ watch mode:
```bash
npm run dev
```

## 📂 โครงสร้างโปรเจค

```
Level 1 - Guided Workshop/
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   └── Student.js        # Student Schema และ Model
├── index.js              # Main program - CRUD operations
├── package.json
├── .env.example
└── .gitignore
```

## 📖 Code ที่สำคัญ

### Schema Definition (models/Student.js)

```javascript
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: Number,
  major: {
    type: String,
    enum: ['Computer Science', 'Engineering', 'Business']
  },
  gpa: {
    type: Number,
    min: 0.0,
    max: 4.0
  }
}, {
  timestamps: true // createdAt, updatedAt
})
```

### Virtual Fields

```javascript
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})
```

### Indexes

```javascript
studentSchema.index({ email: 1 })
studentSchema.index({ major: 1, gpa: -1 }) // Compound index
```

### Instance Methods

```javascript
studentSchema.methods.getInfo = function() {
  return {
    id: this.studentId,
    name: this.fullName,
    gpa: this.gpa
  }
}
```

### Static Methods

```javascript
studentSchema.statics.findByMajor = function(major) {
  return this.find({ major, status: 'active' })
}
```

## 🧪 ตัวอย่าง Operations

### Create
```javascript
const student = await Student.create({
  studentId: 'STD0001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 20,
  major: 'Computer Science',
  gpa: 3.75
})
```

### Read
```javascript
// Find all
const students = await Student.find()

// Find with conditions
const csStudents = await Student.find({ 
  major: 'Computer Science',
  gpa: { $gte: 3.5 }
})

// Find one
const student = await Student.findById(id)
```

### Update
```javascript
const updated = await Student.findByIdAndUpdate(
  id,
  { gpa: 3.85 },
  { new: true } // return updated document
)
```

### Delete
```javascript
await Student.findByIdAndDelete(id)
await Student.deleteMany({ status: 'inactive' })
```

### Advanced Queries
```javascript
// OR condition
const results = await Student.find({
  $or: [
    { major: 'Computer Science' },
    { major: 'Engineering' }
  ]
})

// Regex search
const results = await Student.find({
  firstName: { $regex: /^J/i }
})

// Sort and limit
const top3 = await Student.find()
  .sort({ gpa: -1 })
  .limit(3)
```

### Aggregation
```javascript
const stats = await Student.aggregate([
  { $match: { status: 'active' } },
  { $group: {
    _id: '$major',
    count: { $sum: 1 },
    avgGPA: { $avg: '$gpa' }
  }},
  { $sort: { avgGPA: -1 } }
])
```

## 🎓 ท้าทาย

หลังจากเข้าใจโค้ดแล้ว ลองเพิ่ม:

1. ✅ เพิ่มฟิลด์ `phoneNumber` พร้อม validation
2. ✅ สร้าง method `updateGPA(newGPA)` ใน Student model
3. ✅ Query หานักเรียนที่อายุ 20-22 ปี
4. ✅ Aggregation หาค่าเฉลี่ย GPA แยกตามปีที่เข้าเรียน
5. ✅ เพิ่ม Compound Index สำหรับ `major` + `enrollmentYear`

## 📚 เอกสารอ้างอิง

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Query Operators](https://docs.mongodb.com/manual/reference/operator/query/)
- [Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)

## ⚠️ หมายเหตุ

- ตรวจสอบว่า MongoDB รันอยู่ก่อนใช้งาน
- ใช้ MongoDB Atlas (cloud) จะสะดวกกว่าติดตั้งเอง
- ดู MongoDB Compass (GUI) เพื่อดูข้อมูลใน database

---

**หลังจากทำ Level 1 เสร็จ → ไป Level 2: Blog API! 🚀**
