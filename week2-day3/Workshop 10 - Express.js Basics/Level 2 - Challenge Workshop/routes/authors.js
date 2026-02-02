// routes/authors.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateAuthor } = require('../middleware/validate');

/**
 * GET /api/authors - Get all authors
 * Query: ?country=UK
 */
router.get('/', (req, res) => {
  const { country } = req.query;
  let authors = dataStore.getAllAuthors();
  
  if (country) {
    authors = authors.filter(a => a.country === country);
  }
  
  res.json({
    success: true,
    count: authors.length,
    data: authors
  });
});

/**
 * GET /api/authors/:id - Get author by ID
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const author = dataStore.getAuthorById(id);
  
  if (!author) {
    return res.status(404).json({ 
      error: 'Author not found',
      id 
    });
  }
  
  const books = dataStore.getBooksByAuthor(id);
  
  res.json({
    success: true,
    data: { ...author, books }
  });
});

/**
 * POST /api/authors - Create new author
 */
router.post('/', validateAuthor, (req, res) => {
  const { name, country, birthYear } = req.body;
  const newAuthor = dataStore.addAuthor({ name, country, birthYear });
  
  res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: newAuthor
  });
});

/**
 * PUT /api/authors/:id - Update author
 */
router.put('/:id', validateAuthor, (req, res, next) => {
  const id = parseInt(req.params.id);
  const updated = dataStore.updateAuthor(id, req.body);
  
  if (updated === null) {
    return res.status(404).json({ 
      error: 'Author not found',
      id 
    });
  }
  
  res.json({
    success: true,
    message: 'Author updated successfully',
    data: updated
  });
});

/**
 * DELETE /api/authors/:id - Delete author
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const books = dataStore.getBooksByAuthor(id);
  
  if (books.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete author with existing books',
      bookCount: books.length
    });
  }
  
  const deleted = dataStore.deleteAuthor(id);
  
  if (deleted === null) {
    return res.status(404).json({ 
      error: 'Author not found',
      id 
    });
  }
  
  res.json({
    success: true,
    message: 'Author deleted successfully',
    data: deleted
  });
});

module.exports = router;
