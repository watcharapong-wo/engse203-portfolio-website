const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validator = require('../validators/productValidator');

router.get('/',
  validator.validateQuery,
  validator.handleValidationErrors,
  productController.getAll
);

router.get('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.getById
);

router.post('/',
  validator.createProduct,
  validator.handleValidationErrors,
  productController.create
);

router.put('/:id',
  validator.updateProduct,
  validator.handleValidationErrors,
  productController.update
);

router.patch('/:id',
  validator.patchProduct,
  validator.handleValidationErrors,
  productController.partialUpdate
);

router.delete('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.remove
);

router.patch('/bulk',
  validator.validateBulkUpdate,
  validator.handleValidationErrors,
  productController.bulkUpdate
);

module.exports = router;
