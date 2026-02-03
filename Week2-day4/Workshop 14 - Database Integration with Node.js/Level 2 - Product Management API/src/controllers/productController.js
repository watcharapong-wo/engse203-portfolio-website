const Product = require('../models/Product');

/**
 * Product Controller
 * Handles HTTP requests for products
 */

// GET all products with filtering, searching, and pagination
exports.getAll = (req, res) => {
  try {
    const {
      category_id,
      search,
      min_price,
      max_price,
      in_stock,
      sort = 'name',
      order = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    const options = {
      category_id: category_id ? parseInt(category_id) : undefined,
      search,
      min_price: min_price ? parseFloat(min_price) : undefined,
      max_price: max_price ? parseFloat(max_price) : undefined,
      in_stock: in_stock === 'true',
      sort,
      order,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    // Get products with filters
    const products = Product.getAll(options);

    // Get total count for pagination
    const allProducts = Product.getAll({
      category_id: options.category_id,
      search: options.search,
      min_price: options.min_price,
      max_price: options.max_price,
      in_stock: options.in_stock,
    });

    const total = allProducts.length;
    const totalPages = options.limit ? Math.ceil(total / options.limit) : 1;

    res.json({
      success: true,
      data: products,
      pagination: {
        page: options.page || 1,
        limit: options.limit || 10,
        total,
        totalPages,
        hasNextPage: options.page ? options.page < totalPages : false,
        hasPrevPage: options.page ? options.page > 1 : false,
      },
    });
  } catch (error) {
    console.error('❌ Error in getAll:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch products',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// GET single product by ID
exports.getById = (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid product ID' },
      });
    }

    const product = Product.getById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with ID ${id} not found` },
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Error in getById:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// POST - Create new product
exports.create = (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 200) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product name is required and must be between 2 and 200 characters' },
      });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Price must be a positive number' },
      });
    }

    if (stock && (typeof stock !== 'number' || stock < 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Stock must be a non-negative number' },
      });
    }

    if (!category_id || isNaN(category_id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid category ID is required' },
      });
    }

    const product = Product.create({
      name,
      description: description || '',
      price,
      stock: stock || 0,
      category_id,
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('❌ Error in create:', error.message);

    if (error.message.includes('FOREIGN KEY')) {
      return res.status(409).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// PUT - Update product
exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid product ID' },
      });
    }

    // Validate fields if provided
    if (name && (typeof name !== 'string' || name.length < 2 || name.length > 200)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product name must be between 2 and 200 characters' },
      });
    }

    if (price && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Price must be a positive number' },
      });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Stock must be a non-negative number' },
      });
    }

    const product = Product.update(id, {
      name,
      description,
      price,
      stock,
      category_id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with ID ${id} not found` },
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('❌ Error in update:', error.message);

    if (error.message.includes('FOREIGN KEY')) {
      return res.status(409).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// DELETE product
exports.delete = (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid product ID' },
      });
    }

    const deleted = Product.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: `Product with ID ${id} not found` },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('❌ Error in delete:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// GET products by category
exports.getByCategory = (req, res) => {
  try {
    const { categoryId } = req.params;
    const { search, sort = 'name', order = 'asc' } = req.query;

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    const products = Product.getByCategory(categoryId, {
      search,
      sort,
      order,
    });

    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('❌ Error in getByCategory:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch products by category',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// GET search results
exports.search = (req, res) => {
  try {
    const { keyword, sort = 'name', order = 'asc' } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search keyword is required' },
      });
    }

    const products = Product.search(keyword, { sort, order });

    res.json({
      success: true,
      data: products,
      count: products.length,
      keyword,
    });
  } catch (error) {
    console.error('❌ Error in search:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to search products',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// GET product statistics
exports.getStats = (req, res) => {
  try {
    const stats = Product.getStats();
    const categoryStats = Product.countByCategory();

    res.json({
      success: true,
      data: {
        overall: stats,
        byCategory: categoryStats,
      },
    });
  } catch (error) {
    console.error('❌ Error in getStats:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch product statistics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};
