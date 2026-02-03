const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes (will be added)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API is running',
    timestamp: new Date().toISOString(),
  });
});

// TODO: Add routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/categories', require('./routes/categories'));
// app.use('/api/posts', require('./routes/posts'));
// app.use('/api/comments', require('./routes/comments'));

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

module.exports = app;
