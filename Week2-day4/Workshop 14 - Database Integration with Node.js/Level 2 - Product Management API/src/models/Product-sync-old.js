const db = require('../db');

/**
 * Product Model
 * Handles all product-related database operations
 */
class Product {
  static getAll(options = {}) {
    try {
      let sql = `
        SELECT 
          p.id, p.name, p.description, p.price, p.stock, 
          p.category_id, c.name as category_name, 
          p.created_at, p.updated_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
      `;
      const params = [];
      const conditions = [];

      // Filter by category
      if (options.category_id) {
        conditions.push('p.category_id = ?');
        params.push(options.category_id);
      }

      // Search by name or description
      if (options.search) {
        conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        params.push(`%${options.search}%`, `%${options.search}%`);
      }

      // Filter by price range
      if (options.min_price) {
        conditions.push('p.price >= ?');
        params.push(options.min_price);
      }

      if (options.max_price) {
        conditions.push('p.price <= ?');
        params.push(options.max_price);
      }

      // Filter by stock availability
      if (options.in_stock) {
        conditions.push('p.stock > 0');
      }

      // Add WHERE clause if conditions exist
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      // Sorting
      const sortField = options.sort || 'p.name';
      const sortOrder = options.order === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${sortField} ${sortOrder}`;

      // Pagination
      if (options.page && options.limit) {
        const offset = (options.page - 1) * options.limit;
        sql += ` LIMIT ? OFFSET ?`;
        params.push(options.limit, offset);
      } else if (options.limit) {
        sql += ` LIMIT ?`;
        params.push(options.limit);
      }

      const stmt = db.getDb().prepare(sql);
      return stmt.all(...params);
    } catch (error) {
      console.error('❌ Error in Product.getAll():', error.message);
      throw error;
    }
  }

  static getById(id) {
    try {
      const sql = `
        SELECT 
          p.id, p.name, p.description, p.price, p.stock, 
          p.category_id, c.name as category_name,
          p.created_at, p.updated_at
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
      const stmt = db.getDb().prepare(sql);
      return stmt.get(id);
    } catch (error) {
      console.error('❌ Error in Product.getById():', error.message);
      throw error;
    }
  }

  static create(data) {
    try {
      const { name, description = '', price, stock = 0, category_id } = data;

      // Validate required fields
      if (!name) throw new Error('Product name is required');
      if (price === undefined || price === null) throw new Error('Price is required');
      if (!category_id) throw new Error('Category ID is required');

      // Validate data types
      if (typeof price !== 'number' || price <= 0) {
        throw new Error('Price must be a positive number');
      }
      if (typeof stock !== 'number' || stock < 0) {
        throw new Error('Stock must be a non-negative number');
      }

      const sql = `
        INSERT INTO products (name, description, price, stock, category_id) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const stmt = db.getDb().prepare(sql);
      const result = stmt.run(name, description, price, stock, category_id);

      return this.getById(result.lastInsertRowid);
    } catch (error) {
      console.error('❌ Error in Product.create():', error.message);
      throw error;
    }
  }

  static update(id, data) {
    try {
      const { name, description, price, stock, category_id } = data;

      // Build dynamic UPDATE statement
      const fields = [];
      const params = [];

      if (name !== undefined) {
        fields.push('name = ?');
        params.push(name);
      }
      if (description !== undefined) {
        fields.push('description = ?');
        params.push(description);
      }
      if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
          throw new Error('Price must be a positive number');
        }
        fields.push('price = ?');
        params.push(price);
      }
      if (stock !== undefined) {
        if (typeof stock !== 'number' || stock < 0) {
          throw new Error('Stock must be a non-negative number');
        }
        fields.push('stock = ?');
        params.push(stock);
      }
      if (category_id !== undefined) {
        fields.push('category_id = ?');
        params.push(category_id);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      params.push(id);
      const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      const stmt = db.getDb().prepare(sql);
      const result = stmt.run(...params);

      if (result.changes === 0) {
        return null;
      }

      return this.getById(id);
    } catch (error) {
      console.error('❌ Error in Product.update():', error.message);
      throw error;
    }
  }

  static delete(id) {
    try {
      const sql = 'DELETE FROM products WHERE id = ?';
      const stmt = db.getDb().prepare(sql);
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('❌ Error in Product.delete():', error.message);
      throw error;
    }
  }

  static getByCategory(categoryId, options = {}) {
    try {
      return this.getAll({ ...options, category_id: categoryId });
    } catch (error) {
      console.error('❌ Error in Product.getByCategory():', error.message);
      throw error;
    }
  }

  static search(keyword, options = {}) {
    try {
      return this.getAll({ ...options, search: keyword });
    } catch (error) {
      console.error('❌ Error in Product.search():', error.message);
      throw error;
    }
  }

  static getStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN stock > 0 THEN 1 END) as in_stock,
          COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock,
          AVG(price) as avg_price,
          MIN(price) as min_price,
          MAX(price) as max_price,
          SUM(stock) as total_stock
        FROM products
      `;
      const stmt = db.getDb().prepare(sql);
      return stmt.get();
    } catch (error) {
      console.error('❌ Error in Product.getStats():', error.message);
      throw error;
    }
  }

  static countByCategory() {
    try {
      const sql = `
        SELECT c.id, c.name, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id, c.name
      `;
      const stmt = db.getDb().prepare(sql);
      return stmt.all();
    } catch (error) {
      console.error('❌ Error in Product.countByCategory():', error.message);
      throw error;
    }
  }
}

module.exports = Product;
