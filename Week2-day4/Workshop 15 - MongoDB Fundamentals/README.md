# Workshop 15: MongoDB Fundamentals

เรียนรู้พื้นฐานของ MongoDB - NoSQL Database ที่ได้รับความนิยม

## 🎯 เป้าหมาย

- เข้าใจโครงสร้างของ MongoDB (Database, Collections, Documents)
- ใช้งาน CRUD operations (Create, Read, Update, Delete)
- Query และ Filter ข้อมูลขั้นสูง
- ใช้ Aggregation Pipeline
- สร้าง Indexes เพื่อเพิ่มประสิทธิภาพ
- ออกแบบ Schema และความสัมพันธ์ (Embedded vs Referenced)
- เชื่อมต่อ MongoDB กับ Node.js ด้วย Mongoose

## 📚 Levels

### Level 1: Guided Workshop (พื้นฐาน)
**เรียนรู้**: CRUD Operations กับ MongoDB
- ติดตั้งและเชื่อมต่อ MongoDB
- สร้าง, อ่าน, อัพเดท, และลบ Documents
- Query ข้อมูลด้วย Filters
- ใช้ Mongoose ODM
- ตัวอย่าง: Student Management System

**เวลาโดยประมาณ**: 2-3 ชั่วโมง

### Level 2: Blog API (Challenge)
**สร้าง**: RESTful API สำหรับ Blog พร้อม Authentication
- Users, Posts, Comments, Categories
- JWT Authentication
- Aggregation Pipeline (Popular Posts, Stats)
- Pagination และ Search
- Image Upload (optional)
- Indexes สำหรับ Performance

**เวลาโดยประมาณ**: 3-4 ชั่วโมง

## 🛠️ เครื่องมือที่ต้องใช้

- **MongoDB**: Database (Community Edition หรือ MongoDB Atlas)
- **Node.js**: v16+ และ npm
- **MongoDB Compass**: GUI tool (optional)
- **Mongoose**: ODM library

## 📖 ทฤษฎีที่ควรรู้

### MongoDB vs SQL
```
SQL (Relational)     →  MongoDB (Document)
├── Database             Database
├── Table                Collection
├── Row                  Document
├── Column               Field
└── Primary Key          _id (auto-generated)
```

### ข้อดีของ MongoDB
- **Flexible Schema**: ไม่ต้องกำหนดโครงสร้างแน่นอน
- **Horizontal Scaling**: Sharding ง่าย
- **Rich Queries**: Query operators มากมาย
- **Aggregation**: Pipeline ที่ทรงพลัง
- **Native JSON**: เก็บข้อมูลเป็น BSON (Binary JSON)

### เมื่อไหร่ควรใช้ MongoDB
✅ **เหมาะกับ**:
- ข้อมูลที่มี Schema ยืดหยุ่น
- Rapid development
- ข้อมูลขนาดใหญ่
- Real-time analytics
- Content Management Systems

❌ **ไม่เหมาะกับ**:
- ต้องการ ACID transactions แบบซับซ้อน (แต่ MongoDB 4.0+ รองรับแล้ว)
- ความสัมพันธ์ซับซ้อนมาก (Multiple JOINs)
- ข้อมูลที่ต้องการ Strong Schema Validation

## 🚀 เริ่มต้น

### 1. ติดตั้ง MongoDB

#### Option 1: MongoDB Community (Local)
```bash
# Windows: Download จาก https://www.mongodb.com/try/download/community
# หลังติดตั้ง start service:
net start MongoDB
```

#### Option 2: MongoDB Atlas (Cloud - แนะนำ)
1. สมัครที่ https://www.mongodb.com/cloud/atlas (ฟรี 512MB)
2. สร้าง Cluster
3. เพิ่ม IP Address (0.0.0.0/0 สำหรับ development)
4. สร้าง Database User
5. คัดลอก Connection String

### 2. ติดตั้ง Dependencies
```bash
cd "Level 1 - Guided Workshop"
npm install mongoose dotenv
```

### 3. สร้างไฟล์ .env
```env
MONGODB_URI=mongodb://localhost:27017/workshop15
# หรือ MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workshop15
```

## 📝 ความรู้เบื้องต้น

### Document ตัวอย่าง
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  age: 25,
  hobbies: ["reading", "coding"],
  address: {
    street: "123 Main St",
    city: "Bangkok"
  },
  createdAt: ISODate("2026-02-03T00:00:00Z")
}
```

### CRUD Operations
```javascript
// Create
await Student.create({ name: "John", age: 20 });

// Read
const students = await Student.find({ age: { $gte: 18 } });
const student = await Student.findById(id);

// Update
await Student.findByIdAndUpdate(id, { age: 21 });

// Delete
await Student.findByIdAndDelete(id);
```

### Query Operators
```javascript
// Comparison
{ age: { $eq: 20 } }   // equal
{ age: { $gt: 18 } }   // greater than
{ age: { $gte: 18 } }  // greater than or equal
{ age: { $in: [18, 19, 20] } }  // in array

// Logical
{ $and: [{ age: { $gte: 18 } }, { status: "active" }] }
{ $or: [{ age: { $lt: 18 } }, { status: "inactive" }] }

// Element
{ email: { $exists: true } }
{ hobbies: { $type: "array" } }

// Array
{ hobbies: { $all: ["reading", "coding"] } }
{ hobbies: { $size: 2 } }
```

## 🔥 Best Practices

1. **ใช้ Indexes**: สำหรับ fields ที่ query บ่อย
2. **Avoid Deep Nesting**: ไม่ควรซ้อนเกิน 3-4 ระดับ
3. **Use Projection**: เลือกเฉพาะ fields ที่ต้องการ
4. **Validate Input**: ใช้ Mongoose Schema Validation
5. **Handle Errors**: try-catch และ error middleware
6. **Use Environment Variables**: อย่า hardcode connection strings

## 📚 เอกสารอ้างอิง

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) - ฟรี!
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🎓 หลังจาก Workshop

- ลอง MongoDB Aggregation Pipeline
- เรียนรู้ Indexes (Compound, Text, Geospatial)
- ศึกษา Transactions
- ทดลอง Change Streams (Real-time)
- ลองใช้ MongoDB Atlas Search

---

**Happy Coding! 🚀**
