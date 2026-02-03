// src/models/Todo.js (UPDATED)
// Todo model - with filter, search, and pagination support

const dbManager = require('../db');

class Todo {
  constructor() {
    this.db = dbManager.getDb();
  }

  /**
   * ดึง todos ทั้งหมด (with optional filters, search, pagination)
   * @param {Object} options - { done, search, page, limit }
   */
  getAll(options = {}) {
    let sql = `SELECT * FROM todos`;
    const params = [];
    const conditions = [];

    // ✅ Challenge 1: Filter by status
    if (options.done !== undefined && options.done !== null && options.done !== '') {
      const doneValue = options.done === 'true' || options.done === true || options.done === 1 ? 1 : 0;
      conditions.push('done = ?');
      params.push(doneValue);
    }

    // ✅ Challenge 2: Search by task name
    if (options.search && options.search.trim() !== '') {
      conditions.push('task LIKE ?');
      params.push(`%${options.search}%`);
    }

    // Add WHERE clause
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ORDER BY
    sql += ' ORDER BY created_at DESC';

    // ✅ Challenge 3: Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const offset = (page - 1) * limit;

    const sql_paginated = sql + ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Get total count for pagination metadata
    const countSql = sql.replace(/ORDER BY.*$/i, '');
    const countParams = params.slice(0, conditions.length);
    const countResult = this.db.prepare(countSql).get(...countParams) || { 'COUNT(*)': 0 };
    const total = countResult['COUNT(*)'];

    // Get paginated data
    const data = this.db.prepare(sql_paginated).all(...params);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * ดึง todo ตาม ID
   */
  getById(id) {
    const sql = `SELECT * FROM todos WHERE id = ?`;
    return this.db.prepare(sql).get(id);
  }

  /**
   * สร้าง todo ใหม่
   */
  create(task) {
    const sql = `
      INSERT INTO todos (task)
      VALUES (?)
    `;
    const result = this.db.prepare(sql).run(task);
    return this.getById(result.lastInsertRowid);
  }

  /**
   * อัพเดทสถานะ
   */
  updateStatus(id, done) {
    const sql = `
      UPDATE todos
      SET done = ?
      WHERE id = ?
    `;
    const result = this.db.prepare(sql).run(done, id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.getById(id);
  }

  /**
   * ลบ todo
   */
  delete(id) {
    const sql = `DELETE FROM todos WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  /**
   * ดูสถิติ
   */
  getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    return this.db.prepare(sql).get();
  }
}

module.exports = new Todo();
