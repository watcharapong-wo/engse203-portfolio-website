// models/Member.js
// Model สำหรับจัดการข้อมูลสมาชิก

const { db } = require('../db');

class Member {
  // ดึงสมาชิกทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM members';
    return db.prepare(sql).all();
  }

  // ดูหนังสือที่สมาชิกยืมอยู่
  static getBorrowedBooks(memberId) {
    // ✅ เฉลยให้แล้ว: JOIN กับ books และ borrowings
    // แสดง: book title, author, borrow_date
    // เฉพาะที่ยังไม่คืน (return_date IS NULL)
    
    const sql = `
      SELECT 
        borrowings.id,
        books.title,
        books.author,
        borrowings.borrow_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ? AND borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all(memberId);
  }

  // เพิ่มสมาชิกใหม่
  static add(name, email, phone = null) {
    // TODO: เพิ่มสมาชิกใหม่
    // Hint: INSERT INTO members (name, email, phone) VALUES (?, ?, ?)
    
    // YOUR CODE HERE
    const insert = db.prepare('INSERT INTO members (name, email, phone) VALUES (?, ?, ?)');
    const result = insert.run(name, email, phone);
    console.log(`✅ Added member: "${name}" (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  }

  // ดูสถิติการยืมของสมาชิก
  static getBorrowingStats(memberId) {
    // TODO: นับจำนวนหนังสือที่ยืมอยู่และเคยยืม
    // Hint: COUNT(*) และ GROUP BY return_date IS NULL
    
    // YOUR CODE HERE
    const sql = `
      SELECT 
        COUNT(CASE WHEN return_date IS NULL THEN 1 END) as currently_borrowed,
        COUNT(CASE WHEN return_date IS NOT NULL THEN 1 END) as returned
      FROM borrowings
      WHERE member_id = ?
    `;
    return db.prepare(sql).get(memberId);
  }
}

module.exports = Member;
