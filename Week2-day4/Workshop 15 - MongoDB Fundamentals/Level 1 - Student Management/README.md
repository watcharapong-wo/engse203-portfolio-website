# Level 1: Student Management System

เรียนรู้พื้นฐาน MongoDB + Mongoose ผ่านระบบจัดการนักเรียน

## 🎯 เป้าหมาย

- เชื่อมต่อ MongoDB ด้วย Mongoose
- สร้าง Schema และ Model
- CRUD Operations
- Validation
- Virtual Fields
- Instance & Static Methods
- Middleware/Hooks
- Aggregation Pipeline

## 📂 โครงสร้างโปรเจค

```
Level 1 - Student Management/
├── .env.example
├── .gitignore
├── package.json
├── index.js           # ไฟล์หลักสำหรับทดสอบ
│
├── config/
│   └── database.js    # การเชื่อมต่อ MongoDB
│
└── models/
    └── Student.js     # Mongoose Schema & Model
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
MONGODB_URI=mongodb://localhost:27017/student_db
# หรือใช้ MongoDB Atlas
NODE_ENV=development
```

### 3. รันโปรแกรม

```bash
npm start
# หรือ
npm run dev  # with nodemon
```

## 📖 Student Schema

```javascript
{
  studentId: String,     // required, unique, 8 digits
  name: String,          // required, 2-100 chars
  email: String,         // required, unique, valid email
  age: Number,           // 15-100
  major: String,         // enum: CS, Engineering, Business, Arts, Science
  gpa: Number,           // 0-4.0
  isActive: Boolean,     // default: true
  enrollmentDate: Date,  // default: now
  createdAt: Date,       // auto
  updatedAt: Date        // auto
}
```

## 💡 จุดเด่น

### 1. Schema Validation

```javascript
studentId: {
  type: String,
  required: [true, 'Student ID is required'],
  unique: true,
  match: [/^[0-9]{8}$/, 'Student ID must be 8 digits']
}
```

### 2. Enum Values

```javascript
major: {
  type: String,
  enum: {
    values: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'],
    message: '{VALUE} is not a valid major'
  }
}
```

### 3. Virtual Fields

```javascript
studentSchema.virtual('fullInfo').get(function() {
  return `${this.name} (${this.studentId}) - ${this.major}`;
});

studentSchema.virtual('grade').get(function() {
  if (this.gpa >= 3.5) return 'A';
  // ...
});
```

### 4. Instance Methods

```javascript
student.getStatus()        // 'Active Student' or 'Inactive Student'
student.updateGPA(3.85)    // อัพเดท GPA
```

### 5. Static Methods

```javascript
Student.findByMajor('Computer Science')  // หานักเรียนตาม major
Student.getTopStudents(5)                // Top 5 นักเรียน
Student.getStatsByMajor()                // สถิติแต่ละ major
```

### 6. Middleware (Hooks)

```javascript
studentSchema.pre('save', function(next) {
  console.log(`💾 Saving student: ${this.name}`);
  next();
});

studentSchema.post('save', function(doc) {
  console.log(`✅ Student saved: ${doc.name}`);
});
```

### 7. Aggregation Pipeline

```javascript
Student.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: '$major',
      count: { $sum: 1 },
      avgGPA: { $avg: '$gpa' }
    }
  }
])
```

### 8. Indexes

```javascript
studentSchema.index({ email: 1 });
studentSchema.index({ major: 1, gpa: -1 });
```

## 🧪 ตัวอย่างผลลัพธ์

```
=== MongoDB + Mongoose Demo ===

1️⃣ Creating students...
💾 Saving student: Somchai Jaidee
✅ Student saved: Somchai Jaidee (65010001)
...
✅ Created 5 students

2️⃣ Reading students...
📚 Total students: 5
💻 CS students: 3
👤 Found: Somchai Jaidee

3️⃣ Using virtual fields...
📋 Full Info: Somchai Jaidee (65010001) - Computer Science
🎓 Grade: A

4️⃣ Using instance methods...
📊 Status: Active Student
📈 Updated GPA: 3.85

5️⃣ Using static methods...
💻 CS Students (3):
   - Somchai Jaidee (GPA: 3.85)
   - Wichai Sukkasem (GPA: 3.90)
   - Anon Namwong (GPA: 2.85)

🏆 Top 3 Students:
   1. Wichai Sukkasem - GPA: 3.9
   2. Somchai Jaidee - GPA: 3.85
   3. Somsri Rakdee - GPA: 3.45

6️⃣ Using aggregation...
📊 Statistics by Major:
   Computer Science:
      - Count: 3
      - Avg GPA: 3.53
      - Max GPA: 3.90
      - Min GPA: 2.85
   Engineering:
      - Count: 1
      - Avg GPA: 3.45
      - Max GPA: 3.45
      - Min GPA: 3.45
   ...

✅ Demo completed successfully!
```

## 🎓 สิ่งที่เรียนรู้

1. ✅ MongoDB Connection
2. ✅ Mongoose Schema & Models
3. ✅ Data Validation
4. ✅ CRUD Operations
5. ✅ Virtual Fields
6. ✅ Instance Methods
7. ✅ Static Methods
8. ✅ Middleware/Hooks
9. ✅ Aggregation Pipeline
10. ✅ Indexes

## 📚 เอกสารอ้างอิง

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [Schema Validation](https://mongoosejs.com/docs/validation.html)

## ⚠️ หมายเหตุ

- ต้องมี MongoDB ติดตั้งและรันอยู่
- หรือใช้ MongoDB Atlas (cloud) แทน
- ใช้ MongoDB Compass (GUI) เพื่อดูข้อมูล

---

**เสร็จแล้วลอง Level 2: Blog API! 🚀**
