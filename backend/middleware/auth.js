const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Middleware kiểm tra token
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: error.message 
      });
    }
  },

  // Middleware phân quyền
  checkRole: (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.' 
        });
      }
      next();
    };
  }
};

module.exports = authMiddleware;