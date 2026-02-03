const dbManager = require('../db');

// Helper to promisify database methods
const dbAll = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

class Category {
  static async getAll(options = {}) {
    const db = dbManager.getDb();
    const { search } = options;

    let sql = 'SELECT * FROM categories';
    const params = [];

    if (search) {
      sql += ' WHERE name LIKE ? OR description LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY name ASC';

    return await dbAll(db, sql, params);
  }

  static async getById(id) {
    const db = dbManager.getDb();
    const sql = 'SELECT * FROM categories WHERE id = ?';
    return await dbGet(db, sql, [id]);
  }

  static async create(data) {
    const db = dbManager.getDb();
    const { name, description } = data;

    const sql = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;

    const result = await dbRun(db, sql, [name, description || null]);
    return await this.getById(result.lastID);
  }

  static async update(id, data) {
    const db = dbManager.getDb();
    const { name, description } = data;

    const sql = `
      UPDATE categories 
      SET name = ?, description = ?
      WHERE id = ?
    `;

    await dbRun(db, sql, [name, description || null, id]);
    return await this.getById(id);
  }

  static async delete(id) {
    const db = dbManager.getDb();
    const sql = 'DELETE FROM categories WHERE id = ?';
    const result = await dbRun(db, sql, [id]);
    return result.changes > 0;
  }

  static async getStats() {
    const db = dbManager.getDb();
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description
      ORDER BY product_count DESC, c.name ASC
    `;

    return await dbAll(db, sql);
  }
}

module.exports = Category;
