const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/database.db';

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('❌ Database connection error:', err.message);
          reject(err);
        } else {
          // Enable foreign keys
          this.db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) reject(err);
            else {
              console.log('✅ Database connected:', DB_PATH);
              resolve(this.db);
            }
          });
        }
      });
    });
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  runScript(scriptPath) {
    return new Promise((resolve, reject) => {
      try {
        const sql = fs.readFileSync(scriptPath, 'utf-8');
        this.db.exec(sql, (err) => {
          if (err) {
            console.error(`❌ Error running script ${scriptPath}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Executed script: ${scriptPath}`);
            resolve();
          }
        });
      } catch (error) {
        console.error(`❌ Error reading script ${scriptPath}:`, error.message);
        reject(error);
      }
    });
  }

  async createSchema() {
    try {
      await this.runScript(path.join(__dirname, '../database/schema.sql'));
    } catch (error) {
      console.error('❌ Error creating schema:', error.message);
      throw error;
    }
  }

  async seedData() {
    try {
      await this.runScript(path.join(__dirname, '../database/seed.sql'));
    } catch (error) {
      console.error('❌ Error seeding data:', error.message);
      throw error;
    }
  }

  async reset() {
    try {
      // Close existing connection
      if (this.db) {
        await new Promise((resolve) => this.db.close(resolve));
        this.db = null;
      }

      // Delete database file if exists
      if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('📦 Database file deleted');
      }

      // Reconnect and recreate
      await this.connect();
      await this.createSchema();
      await this.seedData();
      console.log('✅ Database reset complete');
    } catch (error) {
      console.error('❌ Error resetting database:', error.message);
      throw error;
    }
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close(() => {
          console.log('📦 Database closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
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
