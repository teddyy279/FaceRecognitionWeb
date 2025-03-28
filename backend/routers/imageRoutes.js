const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { validate, imageValidation } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

// Cấu hình upload file
const upload = multer({ 
  dest: 'uploads/',
  limits: { 
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

// Route upload ảnh (yêu cầu authentication)
router.post(
  '/upload', 
  authMiddleware.verifyToken,
  upload.single('image'),
  imageController.uploadImage
);

// Route tìm kiếm ảnh (chỉ admin)
router.get(
  '/search', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  validate(imageValidation.searchImages),
  imageController.searchImages
);

// Route xuất CSV (chỉ admin)
router.post(
  '/export-csv', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  imageController.exportImagesToCsv
);

module.exports = router;