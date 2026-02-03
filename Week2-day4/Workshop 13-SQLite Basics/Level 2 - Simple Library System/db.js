// db.js
// ตั้งค่า database

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('library.db');

// รัน SQL file ทั้งหมด
function runSQL(filename) {
  const filepath = path.join(__dirname, filename);
  const sql = fs.readFileSync(filepath, 'utf-8');
  db.exec(sql);
  console.log(`✅ ${filename} executed`);
}

// สร้าง tables และใส่ข้อมูล
function reset() {
  console.log('🔄 Resetting database...');
  runSQL('schema.sql');
  runSQL('seed.sql');
  console.log('✅ Database ready!');
}

module.exports = { db, reset };
