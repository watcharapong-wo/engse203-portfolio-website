// routes/books.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateBook } = require('../middleware/validate');

/**
 * GET /api/books/search - Search books (ต้องอยู่ก่อน /:id)
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      error: 'Search query required',
      hint: 'Use ?q=searchterm'
    });
  }
  
  const books = dataStore.getAllBooks();
  const results = books.filter(book => 
    book.title.toLowerCase().includes(q.toLowerCase())
  ).map(book => ({
    ...book,
    author: dataStore.getAuthorById(book.authorId)
  }));
  
  res.json({
    success: true,
    query: q,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/books - Get all books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res) => {
  const { genre, page = 1, limit = 10 } = req.query;
  let books = dataStore.getAllBooks();
  
  if (genre) {
    books = books.filter(b => b.genre === genre);
  }
  
  books = books.map(book => ({
    ...book,
    author: dataStore.getAuthorById(book.authorId)
  }));
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedBooks = books.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: books.length,
      totalPages: Math.ceil(books.length / limitNum)
    },
    count: paginatedBooks.length,
    data: paginatedBooks
  });
});

/**
 * GET /api/books/:id - Get book by ID
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const book = dataStore.getBookById(id);
  
  if (!book) {
    return res.status(404).json({ 
      error: 'Book not found',
      id 
    });
  }
  
  const author = dataStore.getAuthorById(book.authorId);
  
  res.json({
    success: true,
    data: { ...book, author }
  });
});

/**
 * POST /api/books - Create new book
 */
router.post('/', validateBook, (req, res, next) => {
  const { title, authorId, year, genre, isbn } = req.body;
  const author = dataStore.getAuthorById(authorId);
  
  if (!author) {
    return res.status(400).json({ 
      error: 'Author not found',
      authorId 
    });
  }
  
  const newBook = dataStore.addBook({ title, authorId, year, genre, isbn });
  
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});

/**
 * PUT /api/books/:id - Update book
 */
router.put('/:id', validateBook, (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (req.body.authorId) {
    const author = dataStore.getAuthorById(req.body.authorId);
    if (!author) {
      return res.status(400).json({ 
        error: 'Author not found',
        authorId: req.body.authorId 
      });
    }
  }
  
  const updated = dataStore.updateBook(id, req.body);
  
  if (updated === null) {
    return res.status(404).json({ 
      error: 'Book not found',
      id 
    });
  }
  
  res.json({
    success: true,
    message: 'Book updated successfully',
    data: updated
  });
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const deleted = dataStore.deleteBook(id);
  
  if (deleted === null) {
    return res.status(404).json({ 
      error: 'Book not found',
      id 
    });
  }
  
  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deleted
  });
});

module.exports = router;
