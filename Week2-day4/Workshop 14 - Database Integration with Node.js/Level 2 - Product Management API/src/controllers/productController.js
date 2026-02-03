const Product = require('../models/Product');

/**
 * Product Controller
 * Handles HTTP requests for products
 */

// GET all products with filtering, searching, and pagination
exports.getAll = async (req, res) => {
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

    const parsedCategoryId = category_id !== undefined ? Number(category_id) : undefined;
    const parsedMinPrice = min_price !== undefined ? Number(min_price) : undefined;
    const parsedMaxPrice = max_price !== undefined ? Number(max_price) : undefined;
    const parsedPage = page !== undefined ? Number(page) : undefined;
    const parsedLimit = limit !== undefined ? Number(limit) : undefined;

    if (parsedCategoryId !== undefined && (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'category_id must be a positive integer' },
      });
    }

    if (parsedMinPrice !== undefined && (!Number.isFinite(parsedMinPrice) || parsedMinPrice < 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'min_price must be a non-negative number' },
      });
    }

    if (parsedMaxPrice !== undefined && (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'max_price must be a non-negative number' },
      });
    }

    if (parsedMinPrice !== undefined && parsedMaxPrice !== undefined && parsedMinPrice > parsedMaxPrice) {
      return res.status(400).json({
        success: false,
        error: { message: 'min_price cannot be greater than max_price' },
      });
    }

    if (parsedPage !== undefined && (!Number.isInteger(parsedPage) || parsedPage <= 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'page must be a positive integer' },
      });
    }

    if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit <= 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'limit must be a positive integer' },
      });
    }

    const options = {
      category_id: parsedCategoryId,
      search,
      min_price: parsedMinPrice,
      max_price: parsedMaxPrice,
      in_stock: in_stock === 'true' ? true : undefined,
      sort,
      order,
      page: parsedPage,
      limit: parsedLimit,
    };

    // Get products with filters
    const products = await Product.getAll(options);

    // Get total count for pagination
    const allProducts = await Product.getAll({
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
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid product ID' },
      });
    }

    const product = await Product.getById(id);

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
exports.create = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 200) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product name is required and must be between 2 and 200 characters' },
      });
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Price must be a positive number' },
      });
    }

    const parsedStock = stock === undefined ? 0 : Number(stock);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Stock must be a non-negative number' },
      });
    }

    const parsedCategoryIdForCreate = Number(category_id);
    if (!Number.isInteger(parsedCategoryIdForCreate) || parsedCategoryIdForCreate <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid category ID is required' },
      });
    }

    const product = await Product.create({
      name,
      description: description || '',
      price: parsedPrice,
      stock: parsedStock,
      category_id: parsedCategoryIdForCreate,
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
exports.update = async (req, res) => {
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

    const parsedPriceForUpdate = price !== undefined ? Number(price) : undefined;
    if (parsedPriceForUpdate !== undefined && (!Number.isFinite(parsedPriceForUpdate) || parsedPriceForUpdate <= 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Price must be a positive number' },
      });
    }

    const parsedCategoryId = category_id !== undefined ? Number(category_id) : undefined;
    if (parsedCategoryId !== undefined && (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid category ID is required' },
      });
    }

    const parsedStockForUpdate = stock !== undefined ? Number(stock) : undefined;
    if (parsedStockForUpdate !== undefined && (!Number.isFinite(parsedStockForUpdate) || parsedStockForUpdate < 0)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Stock must be a non-negative number' },
      });
    }

    const product = await Product.update(id, {
      name,
      description,
      price: parsedPriceForUpdate,
      stock: parsedStockForUpdate,
      category_id: parsedCategoryId,
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
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid product ID' },
      });
    }

    const deleted = await Product.delete(id);

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
exports.getByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { search, sort = 'name', order = 'asc' } = req.query;

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    const products = await Product.getByCategory(categoryId, {
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
exports.search = async (req, res) => {
  try {
    const { keyword, sort = 'name', order = 'asc' } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search keyword is required' },
      });
    }

    const products = await Product.search(keyword, { sort, order });

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
exports.getStats = async (req, res) => {
  try {
    const stats = await Product.getStats();

    res.json({
      success: true,
      data: stats,
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
