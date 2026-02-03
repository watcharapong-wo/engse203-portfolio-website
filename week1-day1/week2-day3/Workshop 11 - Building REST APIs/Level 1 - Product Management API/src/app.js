const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

app.get('/', (req, res) => {
  res.json({
    message: 'Product Management API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      documentation: '/api/docs'
    }
  });
});

app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.url} not found`
    }
  });
});

app.use(errorHandler);

module.exports = app;
