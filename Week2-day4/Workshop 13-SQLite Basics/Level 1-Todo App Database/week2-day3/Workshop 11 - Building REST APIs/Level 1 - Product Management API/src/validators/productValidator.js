const { body, param, query, validationResult } = require('express-validator');

exports.createProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

exports.updateProduct = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),

  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

exports.patchProduct = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .optional()
    .trim()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

exports.validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID')
];

exports.validateQuery = [
  query('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be a positive number'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['name', 'price', 'stock', 'category', 'createdAt'])
    .withMessage('Sort field must be one of: name, price, stock, category, createdAt'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),

  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be true or false')
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }

  next();
};

exports.validateBulkUpdate = [
  body('ids')
    .isArray({ min: 1 }).withMessage('ids must be a non-empty array')
    .custom((ids) => ids.every(id => Number.isInteger(id) && id > 0))
    .withMessage('All ids must be positive integers'),

  body('updates')
    .isObject().withMessage('updates must be an object')
    .custom((updates) => Object.keys(updates).length > 0)
    .withMessage('updates must contain at least one field'),

  body('updates.name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),

  body('updates.price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('updates.category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),

  body('updates.stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];
