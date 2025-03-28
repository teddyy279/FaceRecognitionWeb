const { body, param, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Chạy tuần tự các validation
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Kiểm tra có lỗi không
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Trả về lỗi nếu validation failed
    return res.status(400).json({
      errors: errors.array()
    });
  };
};

const authValidation = {
  // Validation cho đăng nhập
  login: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username không được để trống')
      .isLength({ min: 3 }).withMessage('Username phải có ít nhất 3 ký tự'),
    
    body('password')
      .notEmpty().withMessage('Password không được để trống')
      .isLength({ min: 6 }).withMessage('Password phải có ít nhất 6 ký tự')
  ],

  // Validation cho upload ảnh
  uploadImage: [
    body('user_id')
      .optional()
      .isInt().withMessage('User ID phải là số nguyên'),
    
    body('image_path')
      .notEmpty().withMessage('Đường dẫn ảnh không được để trống')
  ]
};

const imageValidation = {
  // Validation cho tìm kiếm ảnh
  searchImages: [
    param('startDate')
      .optional()
      .isISO8601().withMessage('Ngày không hợp lệ'),
    
    param('endDate')
      .optional()
      .isISO8601().withMessage('Ngày không hợp lệ')
  ]
};

module.exports = {
  validate,
  authValidation,
  imageValidation
};