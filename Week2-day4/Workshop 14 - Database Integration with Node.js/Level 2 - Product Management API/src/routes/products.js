const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Routes for products
// Important: /stats and /search must come before /:id
router.get('/stats', productController.getStats);
router.get('/search', productController.search);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
