const express = require('express');
const cors = require('cors');
const dbManager = require('./db');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');

const app = express();

// ===================================
// MIDDLEWARE
// ===================================

// CORS
app.use(cors());

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ===================================
// ROUTES
// ===================================

// Products API
app.use('/api/products', productRoutes);

// Categories API
app.use('/api/categories', categoryRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Product Management API - Level 2',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/api/health',
    },
  });
});

// ===================================
// ERROR HANDLERS
// ===================================

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      path: req.path,
      method: req.method,
    },
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('❌ Unhandled Error:', error);

  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  });
});

module.exports = app;
