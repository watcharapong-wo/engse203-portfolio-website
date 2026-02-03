const db = require('../db');

/**
 * Category Model
 * Handles all category-related database operations
 */
class Category {
  static getAll(options = {}) {
    try {
      let sql = 'SELECT id, name, description, created_at, updated_at FROM categories';
      const params = [];

      // Search by name
      if (options.search) {
        sql += ' WHERE name LIKE ?';
        params.push(`%${options.search}%`);
      }

      sql += ' ORDER BY name ASC';

      const stmt = db.getDb().prepare(sql);
      return stmt.all(...params);
    } catch (error) {
      console.error('❌ Error in Category.getAll():', error.message);
      throw error;
    }
  }

  static getById(id) {
    try {
      const sql = `
        SELECT id, name, description, created_at, updated_at 
        FROM categories 
        WHERE id = ?
      `;
      const stmt = db.getDb().prepare(sql);
      return stmt.get(id);
    } catch (error) {
      console.error('❌ Error in Category.getById():', error.message);
      throw error;
    }
  }

  static create(data) {
    try {
      const { name, description = '' } = data;

      // Validate required fields
      if (!name) {
        throw new Error('Category name is required');
      }

      const sql = `
        INSERT INTO categories (name, description) 
        VALUES (?, ?)
      `;
      const stmt = db.getDb().prepare(sql);
      const result = stmt.run(name, description);

      // Return created category
      return this.getById(result.lastInsertRowid);
    } catch (error) {
      console.error('❌ Error in Category.create():', error.message);
      throw error;
    }
  }

  static update(id, data) {
    try {
      const { name, description } = data;

      if (!name) {
        throw new Error('Category name is required');
      }

      const sql = `
        UPDATE categories 
        SET name = ?, description = ? 
        WHERE id = ?
      `;
      const stmt = db.getDb().prepare(sql);
      const result = stmt.run(name, description, id);

      if (result.changes === 0) {
        return null;
      }

      return this.getById(id);
    } catch (error) {
      console.error('❌ Error in Category.update():', error.message);
      throw error;
    }
  }

  static delete(id) {
    try {
      const sql = 'DELETE FROM categories WHERE id = ?';
      const stmt = db.getDb().prepare(sql);
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('❌ Error in Category.delete():', error.message);
      throw error;
    }
  }

  static getStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total,
          COUNT(DISTINCT c.id) as totalCategories,
          COUNT(p.id) as totalProducts
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
      `;
      const stmt = db.getDb().prepare(sql);
      return stmt.get();
    } catch (error) {
      console.error('❌ Error in Category.getStats():', error.message);
      throw error;
    }
  }
}

module.exports = Category;
