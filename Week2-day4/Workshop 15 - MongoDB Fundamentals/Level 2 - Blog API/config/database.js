const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📦 MongoDB Disconnected');
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
