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

class Product {
  static async getAll(options = {}) {
    const db = dbManager.getDb();
    const {
      category_id,
      search,
      min_price,
      max_price,
      in_stock,
      sort = 'name',
      order = 'ASC',
      page = 1,
      limit = 10
    } = options;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (min_price !== undefined) {
      sql += ' AND price >= ?';
      params.push(min_price);
    }

    if (max_price !== undefined) {
      sql += ' AND price <= ?';
      params.push(max_price);
    }

    if (in_stock !== undefined) {
      if (in_stock === true || in_stock === 'true') {
        sql += ' AND stock > 0';
      } else {
        sql += ' AND stock = 0';
      }
    }

    // Sort
    const validSorts = ['name', 'price', 'stock', 'created_at'];
    const validOrders = ['ASC', 'DESC'];
    const sortBy = validSorts.includes(sort) ? sort : 'name';
    const orderBy = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

    sql += ` ORDER BY ${sortBy} ${orderBy}`;

    // Pagination
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await dbAll(db, sql, params);
  }

  static async getById(id) {
    const db = dbManager.getDb();
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    return await dbGet(db, sql, [id]);
  }

  static async create(data) {
    const db = dbManager.getDb();
    const { name, description, price, stock, category_id } = data;

    const sql = `
      INSERT INTO products (name, description, price, stock, category_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await dbRun(db, sql, [
      name,
      description || null,
      price,
      stock || 0,
      category_id
    ]);

    return await this.getById(result.lastID);
  }

  static async update(id, data) {
    const db = dbManager.getDb();
    const { name, description, price, stock, category_id } = data;

    const sql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
      WHERE id = ?
    `;

    await dbRun(db, sql, [
      name,
      description || null,
      price,
      stock,
      category_id,
      id
    ]);

    return await this.getById(id);
  }

  static async delete(id) {
    const db = dbManager.getDb();
    const sql = 'DELETE FROM products WHERE id = ?';
    const result = await dbRun(db, sql, [id]);
    return result.changes > 0;
  }

  static async search(query) {
    const db = dbManager.getDb();
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name LIKE ? OR p.description LIKE ?
      ORDER BY p.name ASC
    `;

    const searchTerm = `%${query}%`;
    return await dbAll(db, sql, [searchTerm, searchTerm]);
  }

  static async getByCategory(categoryId) {
    const db = dbManager.getDb();
    const sql = `
      SELECT * FROM products 
      WHERE category_id = ?
      ORDER BY name ASC
    `;

    return await dbAll(db, sql, [categoryId]);
  }

  static async getStats() {
    const db = dbManager.getDb();
    const sql = `
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock > 0 THEN 1 END) as in_stock,
        COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        SUM(stock) as total_stock
      FROM products
    `;

    return await dbGet(db, sql);
  }

  static async count(filters = {}) {
    const db = dbManager.getDb();
    const { category_id, search, min_price, max_price, in_stock } = filters;

    let sql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];

    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (min_price !== undefined) {
      sql += ' AND price >= ?';
      params.push(min_price);
    }

    if (max_price !== undefined) {
      sql += ' AND price <= ?';
      params.push(max_price);
    }

    if (in_stock !== undefined) {
      if (in_stock === true || in_stock === 'true') {
        sql += ' AND stock > 0';
      } else {
        sql += ' AND stock = 0';
      }
    }

    const result = await dbGet(db, sql, params);
    return result.total;
  }
}

module.exports = Product;
