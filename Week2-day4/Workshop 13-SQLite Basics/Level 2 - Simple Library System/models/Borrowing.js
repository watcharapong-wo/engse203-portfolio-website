// models/Borrowing.js
// Model สำหรับจัดการการยืมหนังสือ

const { db } = require('../db');

class Borrowing {
  // ดึงการยืมทั้งหมด พร้อม JOIN
  static getAll() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        members.name as member,
        borrowings.borrow_date,
        borrowings.return_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
    `;
    return db.prepare(sql).all();
  }

  // ยืมหนังสือ
  static borrow(bookId, memberId) {
    // TODO: ทำ 2 อย่าง
    // 1. เพิ่มรายการใน borrowings
    // 2. อัพเดท books ให้ available = 0
    
    // YOUR CODE HERE
    // Hint: ใช้ 2 คำสั่ง SQL
    
    try {
      const insertBorrow = db.prepare(
        'INSERT INTO borrowings (book_id, member_id) VALUES (?, ?)'
      );
      insertBorrow.run(bookId, memberId);

      const updateBook = db.prepare('UPDATE books SET available = 0 WHERE id = ?');
      updateBook.run(bookId);

      console.log(`✅ Book #${bookId} borrowed by Member #${memberId}`);
    } catch (error) {
      console.error(`❌ Error borrowing book: ${error.message}`);
    }
  }

  // คืนหนังสือ
  static returnBook(borrowingId) {
    // TODO: ทำ 3 อย่าง
    // 1. หา book_id จาก borrowing
    // 2. อัพเดท borrowings ให้มี return_date
    // 3. อัพเดท books ให้ available = 1
    
    // YOUR CODE HERE
    
    try {
      // หา book_id
      const borrowing = db.prepare('SELECT book_id FROM borrowings WHERE id = ?').get(borrowingId);
      
      if (!borrowing) {
        console.log(`❌ Borrowing #${borrowingId} not found`);
        return;
      }

      // อัพเดท return_date
      const updateBorrow = db.prepare(
        'UPDATE borrowings SET return_date = CURRENT_TIMESTAMP WHERE id = ?'
      );
      updateBorrow.run(borrowingId);

      // อัพเดท available
      const updateBook = db.prepare('UPDATE books SET available = 1 WHERE id = ?');
      updateBook.run(borrowing.book_id);

      console.log(`✅ Book returned (Borrowing #${borrowingId})`);
    } catch (error) {
      console.error(`❌ Error returning book: ${error.message}`);
    }
  }

  // ดูหนังสือที่ยังไม่คืน
  static getUnreturned() {
    // TODO: ดึงการยืมที่ return_date IS NULL
    // Hint: WHERE return_date IS NULL
    
    // YOUR CODE HERE
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        members.name as member,
        borrowings.borrow_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      WHERE borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all();
  }

  // ดูประวัติการยืมของสมาชิก
  static getMemberHistory(memberId) {
    // TODO: ดึงประวัติการยืมทั้งหมด (รวมที่คืนแล้ว)
    
    // YOUR CODE HERE
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        borrowings.borrow_date,
        borrowings.return_date,
        CASE 
          WHEN return_date IS NULL THEN '⏳ ยังยืม'
          ELSE '✅ คืนแล้ว'
        END as status
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ?
      ORDER BY borrowings.borrow_date DESC
    `;
    return db.prepare(sql).all(memberId);
  }
}

module.exports = Borrowing;
