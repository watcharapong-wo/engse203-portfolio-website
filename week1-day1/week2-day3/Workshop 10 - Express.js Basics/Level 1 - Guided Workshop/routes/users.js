// routes/users.js
const express = require('express');
const router = express.Router();
const { validateUser, validateUserUpdate } = require('../middleware/validateUser');

// Dummy data (จะใช้ database ในภายหลัง)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

/**
 * GET /api/users/search - Search users
 * Query params: ?q=john
 */
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Search query (q) is required'
      }
    });
  }

  const searchTerm = q.toLowerCase();

  // ค้นหาใน name หรือ email
  const results = users.filter(u => {
    const nameMatch = u.name.toLowerCase().includes(searchTerm);
    const emailMatch = u.email.toLowerCase().includes(searchTerm);
    return nameMatch || emailMatch;
  });

  res.json({
    success: true,
    query: q,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/users - Get all users with pagination
 * Query params: ?role=admin&page=1&limit=10
 */
router.get('/', (req, res) => {
  // ตรวจสอบ query parameters
  const { role, page = 1, limit = 10 } = req.query;

  let filteredUsers = users;

  // กรองตาม role ถ้ามี
  if (role) {
    filteredUsers = users.filter(u => u.role === role);
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Pagination metadata
  const totalPages = Math.ceil(filteredUsers.length / limitNum);
  const hasNextPage = endIndex < filteredUsers.length;
  const hasPrevPage = pageNum > 1;

  res.json({
    success: true,
    pagination: {
      currentPage: pageNum,
      totalPages: totalPages,
      pageSize: limitNum,
      totalItems: filteredUsers.length,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage
    },
    count: paginatedUsers.length,
    data: paginatedUsers
  });
});

/**
 * GET /api/users/:id - Get user by ID
 * Route parameter: id
 */
router.get('/:id', (req, res) => {
  // แปลง id จาก string เป็น number
  const id = parseInt(req.params.id);

  // หา user
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users - Create new user
 * Body: { name, email, role }
 */
router.post('/', validateUser, (req, res) => {
  const { name, email, role } = req.body;


  // สร้าง user ใหม่
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id - Update user
 * Body: { name, email, role }
 */
router.put('/:id', validateUserUpdate, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

/**
 * DELETE /api/users/:id - Delete user
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // ลบ user
  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;
