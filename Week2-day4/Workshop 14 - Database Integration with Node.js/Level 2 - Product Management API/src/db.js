const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/database.db';

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  connect() {
    try {
      this.db = new Database(DB_PATH, {
        verbose: process.env.NODE_ENV === 'development' ? console.log : null,
      });

      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');
      
      console.log('✅ Database connected:', DB_PATH);
      return this.db;
    } catch (error) {
      console.error('❌ Database connection error:', error.message);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }

  runScript(scriptPath) {
    try {
      const sql = fs.readFileSync(scriptPath, 'utf-8');
      this.db.exec(sql);
      console.log(`✅ Executed script: ${scriptPath}`);
    } catch (error) {
      console.error(`❌ Error running script ${scriptPath}:`, error.message);
      throw error;
    }
  }

  createSchema() {
    try {
      this.runScript(path.join(__dirname, '../database/schema.sql'));
    } catch (error) {
      console.error('❌ Error creating schema:', error.message);
      throw error;
    }
  }

  seedData() {
    try {
      this.runScript(path.join(__dirname, '../database/seed.sql'));
    } catch (error) {
      console.error('❌ Error seeding data:', error.message);
      throw error;
    }
  }

  reset() {
    try {
      // Delete database file if exists
      if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('📦 Database file deleted');
      }

      // Reconnect and recreate
      this.db = null;
      this.connect();
      this.createSchema();
      this.seedData();
      console.log('✅ Database reset complete');
    } catch (error) {
      console.error('❌ Error resetting database:', error.message);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log('📦 Database closed');
    }
  }
}

// Singleton instance
let instance = null;

function getDatabaseManager() {
  if (!instance) {
    instance = new DatabaseManager();
  }
  return instance;
}

// Handle CLI reset
if (process.argv[2] === '--reset') {
  const dbManager = getDatabaseManager();
  dbManager.connect();
  dbManager.reset();
  dbManager.close();
  process.exit(0);
}

module.exports = getDatabaseManager();
