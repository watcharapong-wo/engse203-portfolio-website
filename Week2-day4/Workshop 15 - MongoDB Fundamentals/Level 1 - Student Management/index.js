const connectDB = require('./config/database');
const Student = require('./models/Student');

// เชื่อมต่อ MongoDB
connectDB();

// ฟังก์ชันหลักสำหรับทดสอบ
async function main() {
  try {
    console.log('\n=== MongoDB + Mongoose Demo ===\n');

    // 1. CREATE - สร้างนักเรียนใหม่
    console.log('1️⃣ Creating students...');
    
    await Student.deleteMany({}); // ลบข้อมูลเก่าทั้งหมด
    
    const students = await Student.create([
      {
        studentId: '65010001',
        name: 'Somchai Jaidee',
        email: 'somchai@email.com',
        age: 20,
        major: 'Computer Science',
        gpa: 3.75
      },
      {
        studentId: '65010002',
        name: 'Somsri Rakdee',
        email: 'somsri@email.com',
        age: 21,
        major: 'Engineering',
        gpa: 3.45
      },
      {
        studentId: '65010003',
        name: 'Wichai Sukkasem',
        email: 'wichai@email.com',
        age: 19,
        major: 'Computer Science',
        gpa: 3.90
      },
      {
        studentId: '65010004',
        name: 'Pranee Samart',
        email: 'pranee@email.com',
        age: 22,
        major: 'Business',
        gpa: 3.20
      },
      {
        studentId: '65010005',
        name: 'Anon Namwong',
        email: 'anon@email.com',
        age: 20,
        major: 'Computer Science',
        gpa: 2.85
      }
    ]);
    
    console.log(`✅ Created ${students.length} students\n`);

    // 2. READ - อ่านข้อมูล
    console.log('2️⃣ Reading students...');
    
    // ดึงทั้งหมด
    const allStudents = await Student.find();
    console.log(`📚 Total students: ${allStudents.length}`);
    
    // ดึงตามเงื่อนไข
    const csStudents = await Student.find({ major: 'Computer Science' });
    console.log(`💻 CS students: ${csStudents.length}`);
    
    // ดึงตาม ID
    const student = await Student.findOne({ studentId: '65010001' });
    console.log(`👤 Found: ${student.name}\n`);

    // 3. Virtual Fields
    console.log('3️⃣ Using virtual fields...');
    console.log(`📋 Full Info: ${student.fullInfo}`);
    console.log(`🎓 Grade: ${student.grade}\n`);

    // 4. Instance Methods
    console.log('4️⃣ Using instance methods...');
    console.log(`📊 Status: ${student.getStatus()}`);
    await student.updateGPA(3.85);
    console.log(`📈 Updated GPA: ${student.gpa}\n`);

    // 5. Static Methods
    console.log('5️⃣ Using static methods...');
    
    const csStudentsList = await Student.findByMajor('Computer Science');
    console.log(`💻 CS Students (${csStudentsList.length}):`);
    csStudentsList.forEach(s => console.log(`   - ${s.name} (GPA: ${s.gpa})`));
    
    const topStudents = await Student.getTopStudents(3);
    console.log(`\n🏆 Top 3 Students:`);
    topStudents.forEach((s, i) => console.log(`   ${i + 1}. ${s.name} - GPA: ${s.gpa}`));

    // 6. Aggregation
    console.log('\n6️⃣ Using aggregation...');
    const stats = await Student.getStatsByMajor();
    console.log('📊 Statistics by Major:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}:`);
      console.log(`      - Count: ${stat.count}`);
      console.log(`      - Avg GPA: ${stat.avgGPA.toFixed(2)}`);
      console.log(`      - Max GPA: ${stat.maxGPA.toFixed(2)}`);
      console.log(`      - Min GPA: ${stat.minGPA.toFixed(2)}`);
    });

    // 7. UPDATE
    console.log('\n7️⃣ Updating student...');
    const updated = await Student.findOneAndUpdate(
      { studentId: '65010002' },
      { gpa: 3.65, age: 22 },
      { new: true } // return updated document
    );
    console.log(`✅ Updated: ${updated.name} - New GPA: ${updated.gpa}\n`);

    // 8. DELETE
    console.log('8️⃣ Deleting student...');
    const deleted = await Student.findOneAndDelete({ studentId: '65010005' });
    console.log(`🗑️ Deleted: ${deleted.name}\n`);

    // แสดงผลลัพธ์สุดท้าย
    console.log('9️⃣ Final student list:');
    const finalStudents = await Student.find().select('name studentId major gpa');
    finalStudents.forEach(s => {
      console.log(`   - ${s.name} (${s.studentId}) - ${s.major} - GPA: ${s.gpa}`);
    });

    console.log('\n✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // ปิดการเชื่อมต่อ
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit(0);
  }
}

// รัน
main();
