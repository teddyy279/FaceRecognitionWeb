const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, authValidation } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// Route đăng nhập
router.post(
  '/login', 
  validate(authValidation.login),
  authController.login
);

// Route đăng xuất (yêu cầu authentication)
router.post(
  '/logout', 
  authMiddleware.verifyToken,
  authController.logout
);

// Route đổi mật khẩu (yêu cầu authentication)
router.put(
  '/change-password', 
  authMiddleware.verifyToken,
  authController.changePassword
);

module.exports = router;