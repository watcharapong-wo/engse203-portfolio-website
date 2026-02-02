// middleware/validateUser.js

/**
 * Validation middleware สำหรับตรวจสอบข้อมูล user
 */
const validateUser = (req, res, next) => {
  const { name, email, role } = req.body;

  // ตรวจสอบว่ามี name และ email
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name and email are required',
        fields: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null
        }
      }
    });
  }

  // ตรวจสอบความยาว name
  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name must be at least 2 characters long'
      }
    });
  }

  // ตรวจสอบรูปแบบ email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid email format'
      }
    });
  }

  // ตรวจสอบ role (ถ้ามี)
  if (role && !['admin', 'user', 'moderator'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid role. Must be: admin, user, or moderator'
      }
    });
  }

  // ผ่านการ validate แล้ว
  next();
};

/**
 * Validation middleware สำหรับ update user (บาง field อาจไม่มี)
 */
const validateUserUpdate = (req, res, next) => {
  const { name, email, role } = req.body;

  // ต้องมีอย่างน้อย 1 field
  if (!name && !email && !role) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'At least one field (name, email, or role) is required for update'
      }
    });
  }

  // ตรวจสอบ name ถ้ามี
  if (name && name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name must be at least 2 characters long'
      }
    });
  }

  // ตรวจสอบ email ถ้ามี
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid email format'
        }
      });
    }
  }

  // ตรวจสอบ role ถ้ามี
  if (role && !['admin', 'user', 'moderator'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid role. Must be: admin, user, or moderator'
      }
    });
  }

  next();
};

module.exports = {
  validateUser,
  validateUserUpdate
};
