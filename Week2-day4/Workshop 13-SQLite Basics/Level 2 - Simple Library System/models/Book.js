// models/Book.js
// Model สำหรับจัดการข้อมูลหนังสือ

const { db } = require('../db');

class Book {
  // ดึงหนังสือทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM books';
    return db.prepare(sql).all();
  }

  // ดึงหนังสือที่ว่าง (available = 1)
  static getAvailable() {
    // TODO: เขียน SQL query เพื่อดึงหนังสือที่ available = 1
    // Hint: WHERE available = 1
    
    // YOUR CODE HERE
    const sql = `
      SELECT * FROM books WHERE available = 1
    `;
    return db.prepare(sql).all();
  }

  // ค้นหาหนังสือ
  static search(keyword) {
    // TODO: ค้นหาจาก title หรือ author
    // Hint: ใช้ LIKE '%keyword%'
    
    // YOUR CODE HERE
    const sql = `
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ?
    `;
    return db.prepare(sql).all(`%${keyword}%`, `%${keyword}%`);
  }

  // เพิ่มหนังสือใหม่
  static add(title, author) {
    // TODO: เพิ่มหนังสือใหม่
    // Hint: INSERT INTO books (title, author) VALUES (?, ?)
    
    // YOUR CODE HERE
    const insert = db.prepare('INSERT INTO books (title, author) VALUES (?, ?)');
    const result = insert.run(title, author);
    console.log(`✅ Added book: "${title}" by ${author} (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  }
}

module.exports = Book;
