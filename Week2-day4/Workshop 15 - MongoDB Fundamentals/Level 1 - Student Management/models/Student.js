const mongoose = require('mongoose');

// 1. Schema Definition
const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{8}$/, 'Student ID must be 8 digits']
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be less than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    age: {
      type: Number,
      min: [15, 'Age must be at least 15'],
      max: [100, 'Age must be less than 100']
    },
    major: {
      type: String,
      required: [true, 'Major is required'],
      enum: {
        values: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'],
        message: '{VALUE} is not a valid major'
      }
    },
    gpa: {
      type: Number,
      min: [0, 'GPA cannot be negative'],
      max: [4.0, 'GPA cannot exceed 4.0'],
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true, // เพิ่ม createdAt และ updatedAt อัตโนมัติ
    toJSON: { virtuals: true }, // รวม virtual fields ใน JSON
    toObject: { virtuals: true }
  }
);

// 2. Virtual Fields (ไม่ถูกเก็บใน database)
studentSchema.virtual('fullInfo').get(function() {
  return `${this.name} (${this.studentId}) - ${this.major}`;
});

studentSchema.virtual('grade').get(function() {
  if (this.gpa >= 3.5) return 'A';
  if (this.gpa >= 3.0) return 'B';
  if (this.gpa >= 2.5) return 'C';
  if (this.gpa >= 2.0) return 'D';
  return 'F';
});

// 3. Instance Methods (ใช้กับ document แต่ละตัว)
studentSchema.methods.getStatus = function() {
  return this.isActive ? 'Active Student' : 'Inactive Student';
};

studentSchema.methods.updateGPA = function(newGPA) {
  this.gpa = newGPA;
  return this.save();
};

// 4. Static Methods (ใช้กับ Model)
studentSchema.statics.findByMajor = function(major) {
  return this.find({ major, isActive: true });
};

studentSchema.statics.getTopStudents = function(limit = 5) {
  return this.find({ isActive: true })
    .sort({ gpa: -1 })
    .limit(limit);
};

studentSchema.statics.getStatsByMajor = async function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$major',
        count: { $sum: 1 },
        avgGPA: { $avg: '$gpa' },
        maxGPA: { $max: '$gpa' },
        minGPA: { $min: '$gpa' }
      }
    },
    { $sort: { avgGPA: -1 } }
  ]);
};

// 5. Middleware (Hooks)
studentSchema.pre('save', function(next) {
  console.log(`💾 Saving student: ${this.name}`);
  next();
});

studentSchema.post('save', function(doc) {
  console.log(`✅ Student saved: ${doc.name} (${doc.studentId})`);
});

studentSchema.pre('remove', function(next) {
  console.log(`🗑️ Removing student: ${this.name}`);
  next();
});

// 6. Indexes (เพิ่มประสิทธิภาพการค้นหา)
studentSchema.index({ email: 1 });
studentSchema.index({ major: 1, gpa: -1 });

// 7. Create Model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
