const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^STD\d{4}$/, 'Student ID must be in format STD0001'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [15, 'Age must be at least 15'],
      max: [100, 'Age cannot exceed 100'],
    },
    major: {
      type: String,
      required: [true, 'Major is required'],
      enum: {
        values: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'],
        message: '{VALUE} is not a valid major',
      },
    },
    gpa: {
      type: Number,
      min: [0.0, 'GPA cannot be negative'],
      max: [4.0, 'GPA cannot exceed 4.0'],
      default: 0.0,
    },
    enrollmentYear: {
      type: Number,
      required: [true, 'Enrollment year is required'],
      min: [2000, 'Enrollment year must be 2000 or later'],
      max: [new Date().getFullYear(), 'Enrollment year cannot be in the future'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated'],
      default: 'active',
    },
    hobbies: {
      type: [String],
      default: [],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      province: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false, // ไม่ต้องการ __v
  }
);

// Indexes
studentSchema.index({ email: 1 }); // Ascending
studentSchema.index({ studentId: 1 });
studentSchema.index({ major: 1, gpa: -1 }); // Compound index

// Virtual field (ไม่เก็บใน database)
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Instance method
studentSchema.methods.getInfo = function () {
  return {
    id: this.studentId,
    name: this.fullName,
    major: this.major,
    gpa: this.gpa,
  };
};

// Static method
studentSchema.statics.findByMajor = function (major) {
  return this.find({ major, status: 'active' });
};

// Pre-save middleware
studentSchema.pre('save', function (next) {
  console.log(`📝 Saving student: ${this.studentId}`);
  next();
});

// Post-save middleware
studentSchema.post('save', function (doc) {
  console.log(`✅ Student saved: ${doc.studentId}`);
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
