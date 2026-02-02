const Product = require('../data/products');

exports.getAll = (req, res) => {
  try {
    let products = Product.getAll();

    if (req.query.category) {
      products = products.filter(p => p.category === req.query.category);
    }

    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      products = products.filter(p => p.price >= minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      products = products.filter(p => p.price <= maxPrice);
    }

    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

    // Challenge 2: Stock Status Filter
    if (req.query.inStock !== undefined) {
      const inStock = req.query.inStock === 'true';
      products = products.filter(p => inStock ? p.stock > 0 : p.stock === 0);
    }

    // Challenge 1: Sorting
    if (req.query.sort) {
      const sortField = req.query.sort;
      const order = req.query.order === 'desc' ? -1 : 1;
      
      products.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * order;
        if (a[sortField] > b[sortField]) return 1 * order;
        return 0;
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      count: paginatedProducts.length,
      data: paginatedProducts
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch products',
        details: error.message
      }
    });
  }
};

exports.getById = (req, res) => {
  try {
    const product = Product.getById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch product',
        details: error.message
      }
    });
  }
};

exports.create = (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const newProduct = Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create product',
        details: error.message
      }
    });
  }
};

exports.update = (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const updatedProduct = Product.update(req.params.id, {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update product',
        details: error.message
      }
    });
  }
};

exports.partialUpdate = (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock);

    const updatedProduct = Product.partialUpdate(req.params.id, updates);

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in partialUpdate:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update product',
        details: error.message
      }
    });
  }
};

exports.remove = (req, res) => {
  try {
    const deleted = Product.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete product',
        details: error.message
      }
    });
  }
};

/**
 * PATCH /api/products/bulk
 * Challenge 3: Bulk update multiple products
 */
exports.bulkUpdate = (req, res) => {
  try {
    const { ids, updates } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'ids must be a non-empty array'
        }
      });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'updates must be an object'
        }
      });
    }

    // Convert types if present
    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock);

    const results = {
      success: [],
      failed: []
    };

    ids.forEach(id => {
      const updated = Product.partialUpdate(id, updates);
      if (updated) {
        results.success.push({ id, product: updated });
      } else {
        results.failed.push({ id, reason: 'Product not found' });
      }
    });

    res.json({
      success: true,
      message: `Bulk update completed: ${results.success.length} succeeded, ${results.failed.length} failed`,
      data: results
    });
  } catch (error) {
    console.error('Error in bulkUpdate:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to bulk update products',
        details: error.message
      }
    });
  }
};
