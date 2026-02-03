const database = require('./config/database');
const Student = require('./models/Student');

async function main() {
  try {
    // เชื่อมต่อ database
    await database.connect();

    console.log('\n🚀 Starting MongoDB CRUD Operations...\n');

    // ========================================
    // 1. CREATE - สร้าง Documents
    // ========================================
    console.log('📝 1. CREATE Operations\n');

    // 1.1 สร้างนักเรียนคนเดียว
    const student1 = await Student.create({
      studentId: 'STD0001',
      firstName: 'Somchai',
      lastName: 'Jaidee',
      email: 'somchai@example.com',
      age: 20,
      major: 'Computer Science',
      gpa: 3.75,
      enrollmentYear: 2023,
      hobbies: ['coding', 'gaming'],
      address: {
        city: 'Bangkok',
        province: 'Bangkok',
      },
    });
    console.log('✅ Created student:', student1.getInfo());

    // 1.2 สร้างหลายคนพร้อมกัน
    const students = await Student.insertMany([
      {
        studentId: 'STD0002',
        firstName: 'Suda',
        lastName: 'Kaewmee',
        email: 'suda@example.com',
        age: 19,
        major: 'Engineering',
        gpa: 3.50,
        enrollmentYear: 2024,
        hobbies: ['reading', 'music'],
        address: { city: 'Chiang Mai', province: 'Chiang Mai' },
      },
      {
        studentId: 'STD0003',
        firstName: 'Nattapong',
        lastName: 'Saetang',
        email: 'nattapong@example.com',
        age: 21,
        major: 'Business',
        gpa: 3.25,
        enrollmentYear: 2022,
        hobbies: ['sports', 'traveling'],
        address: { city: 'Phuket', province: 'Phuket' },
      },
      {
        studentId: 'STD0004',
        firstName: 'Araya',
        lastName: 'Wongsawat',
        email: 'araya@example.com',
        age: 20,
        major: 'Computer Science',
        gpa: 3.90,
        enrollmentYear: 2023,
        hobbies: ['coding', 'design'],
        address: { city: 'Bangkok', province: 'Bangkok' },
      },
      {
        studentId: 'STD0005',
        firstName: 'Krit',
        lastName: 'Pholprasit',
        email: 'krit@example.com',
        age: 22,
        major: 'Arts',
        gpa: 3.10,
        enrollmentYear: 2021,
        status: 'inactive',
        hobbies: ['painting', 'photography'],
        address: { city: 'Khon Kaen', province: 'Khon Kaen' },
      },
    ]);
    console.log(`✅ Created ${students.length} students\n`);

    // ========================================
    // 2. READ - อ่าน Documents
    // ========================================
    console.log('📖 2. READ Operations\n');

    // 2.1 หาทั้งหมด
    const allStudents = await Student.find();
    console.log(`Total students: ${allStudents.length}`);

    // 2.2 หาด้วย ID
    const foundStudent = await Student.findById(student1._id);
    console.log('Found by ID:', foundStudent.fullName);

    // 2.3 หาด้วย query
    const csStudents = await Student.find({ major: 'Computer Science' });
    console.log(`CS students: ${csStudents.length}`);

    // 2.4 หาคนแรก
    const firstStudent = await Student.findOne({ major: 'Engineering' });
    console.log('First Engineering student:', firstStudent.fullName);

    // 2.5 Query operators
    const activeStudents = await Student.find({
      status: 'active',
      gpa: { $gte: 3.5 }, // GPA >= 3.5
    });
    console.log(`Active students with GPA >= 3.5: ${activeStudents.length}`);

    // 2.6 Projection (เลือกเฉพาะ fields)
    const names = await Student.find({}, 'firstName lastName email');
    console.log('Student names:', names.map((s) => s.fullName).join(', '));

    // 2.7 Sort และ Limit
    const topStudents = await Student.find({ status: 'active' })
      .sort({ gpa: -1 }) // เรียงจากมากไปน้อย
      .limit(3);
    console.log(
      'Top 3 students:',
      topStudents.map((s) => `${s.fullName} (GPA: ${s.gpa})`).join(', ')
    );

    // 2.8 Count
    const count = await Student.countDocuments({ major: 'Computer Science' });
    console.log(`Number of CS students: ${count}`);

    // 2.9 ใช้ static method
    const engineeringStudents = await Student.findByMajor('Engineering');
    console.log(`Engineering students: ${engineeringStudents.length}\n`);

    // ========================================
    // 3. UPDATE - อัพเดท Documents
    // ========================================
    console.log('✏️  3. UPDATE Operations\n');

    // 3.1 Update ด้วย findByIdAndUpdate
    const updatedStudent = await Student.findByIdAndUpdate(
      student1._id,
      { gpa: 3.85 },
      { new: true } // return ข้อมูลใหม่
    );
    console.log('Updated GPA:', updatedStudent.gpa);

    // 3.2 Update หลาย documents
    const result = await Student.updateMany(
      { major: 'Business', gpa: { $lt: 3.5 } },
      { $set: { status: 'active' } }
    );
    console.log(`Updated ${result.modifiedCount} documents`);

    // 3.3 Update operators
    await Student.findByIdAndUpdate(student1._id, {
      $push: { hobbies: 'reading' }, // เพิ่มใน array
      $inc: { gpa: 0.05 }, // เพิ่มค่า
    });

    const studentWithNewHobby = await Student.findById(student1._id);
    console.log('Updated hobbies:', studentWithNewHobby.hobbies);
    console.log('Updated GPA:', studentWithNewHobby.gpa + '\n');

    // ========================================
    // 4. DELETE - ลบ Documents
    // ========================================
    console.log('🗑️  4. DELETE Operations\n');

    // 4.1 ลบ 1 document
    const deletedStudent = await Student.findOneAndDelete({ studentId: 'STD0005' });
    console.log('Deleted student:', deletedStudent?.studentId);

    // 4.2 ลบหลาย documents
    const deleteResult = await Student.deleteMany({ status: 'inactive' });
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);

    // ========================================
    // 5. ADVANCED QUERIES
    // ========================================
    console.log('🔍 5. ADVANCED Queries\n');

    // 5.1 Logical operators
    const results1 = await Student.find({
      $or: [{ major: 'Computer Science' }, { major: 'Engineering' }],
      gpa: { $gte: 3.5 },
    });
    console.log(`CS or Engineering with GPA >= 3.5: ${results1.length}`);

    // 5.2 Regex search
    const results2 = await Student.find({
      firstName: { $regex: /^S/i }, // ชื่อขึ้นต้นด้วย S (case insensitive)
    });
    console.log(`Names starting with S: ${results2.length}`);

    // 5.3 Array queries
    const results3 = await Student.find({
      hobbies: { $in: ['coding', 'design'] }, // มี hobby อย่างใดอย่างหนึ่ง
    });
    console.log(`Students with coding or design hobby: ${results3.length}`);

    // 5.4 Nested document query
    const results4 = await Student.find({ 'address.city': 'Bangkok' });
    console.log(`Students in Bangkok: ${results4.length}\n`);

    // ========================================
    // 6. AGGREGATION
    // ========================================
    console.log('📊 6. AGGREGATION Pipeline\n');

    const stats = await Student.aggregate([
      { $match: { status: 'active' } }, // Filter
      {
        $group: {
          // Group by major
          _id: '$major',
          count: { $sum: 1 },
          avgGPA: { $avg: '$gpa' },
          maxGPA: { $max: '$gpa' },
          minGPA: { $min: '$gpa' },
        },
      },
      { $sort: { avgGPA: -1 } }, // Sort
    ]);

    console.log('Statistics by Major:');
    stats.forEach((s) => {
      console.log(`  ${s._id}:`);
      console.log(`    Count: ${s.count}`);
      console.log(`    Avg GPA: ${s.avgGPA.toFixed(2)}`);
      console.log(`    Max GPA: ${s.maxGPA}`);
      console.log(`    Min GPA: ${s.minGPA}`);
    });

    // ========================================
    // 7. FINAL SUMMARY
    // ========================================
    console.log('\n📈 Final Summary\n');
    const finalCount = await Student.countDocuments();
    const avgGPA = await Student.aggregate([
      { $group: { _id: null, avg: { $avg: '$gpa' } } },
    ]);

    console.log(`Total students: ${finalCount}`);
    console.log(`Average GPA: ${avgGPA[0]?.avg.toFixed(2) || 'N/A'}`);

    const allFinal = await Student.find().select('studentId firstName lastName gpa');
    console.log('\nAll Students:');
    allFinal.forEach((s) => {
      console.log(`  ${s.studentId}: ${s.firstName} ${s.lastName} (GPA: ${s.gpa})`);
    });

    console.log('\n✅ All operations completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    // ปิดการเชื่อมต่อ
    await database.disconnect();
  }
}

// Run
main();
