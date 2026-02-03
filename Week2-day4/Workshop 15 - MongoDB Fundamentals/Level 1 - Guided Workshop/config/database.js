const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      this.connection = await mongoose.connect(process.env.MONGODB_URI, options);
      
      console.log('✅ MongoDB Connected:', mongoose.connection.name);
      console.log('📊 Database:', mongoose.connection.db.databaseName);
      console.log('🔗 Host:', mongoose.connection.host);

      // Event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB Error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('📦 MongoDB Disconnected');
      });

      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB Connection Closed');
    } catch (error) {
      console.error('❌ Error closing connection:', error.message);
    }
  }

  getConnection() {
    return this.connection;
  }
}

// Singleton instance
const database = new Database();

module.exports = database;
