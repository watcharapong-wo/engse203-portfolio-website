const Category = require('../models/Category');

/**
 * Category Controller
 * Handles HTTP requests for categories
 */

// GET all categories
exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const categories = await Category.getAll({ search });

    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('❌ Error in getAll:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch categories',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// GET single category by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    const category = await Category.getById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: { message: `Category with ID ${id} not found` },
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('❌ Error in getById:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch category',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// POST - Create new category
exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Category name is required and must be a string' },
      });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Category name must be between 2 and 100 characters' },
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('❌ Error in create:', error.message);

    // Handle unique constraint error
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({
        success: false,
        error: { message: 'Category name already exists' },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create category',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// PUT - Update category
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Category name is required and must be a string' },
      });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        error: { message: 'Category name must be between 2 and 100 characters' },
      });
    }

    const category = await Category.update(id, { name, description });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: { message: `Category with ID ${id} not found` },
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('❌ Error in update:', error.message);

    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({
        success: false,
        error: { message: 'Category name already exists' },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update category',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// DELETE category
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid category ID' },
      });
    }

    const deleted = await Category.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: `Category with ID ${id} not found` },
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('❌ Error in delete:', error.message);

    // Handle foreign key constraint error
    if (error.message.includes('FOREIGN KEY')) {
      return res.status(409).json({
        success: false,
        error: { message: 'Cannot delete category with existing products' },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete category',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};

// GET category stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Category.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Error in getStats:', error.message);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch category statistics',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
};
