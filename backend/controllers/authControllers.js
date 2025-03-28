const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const request = new sql.Request();
      request.input('username', sql.NVarChar, username);
      
      const userResult = await request.query(`
        SELECT * FROM Users u
        JOIN Roles r ON u.role_id = r.id
        WHERE UserName = @username
      `);

      if (userResult.recordset.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userResult.recordset[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        await this.incrementFailedLoginAttempts(user.UserID);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Tạo token
      const token = jwt.sign(
        { 
          userId: user.UserID, 
          role: user.role_name 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      res.json({ 
        token, 
        user: { 
          id: user.UserID, 
          username: user.UserName, 
          role: user.role_name 
        } 
      });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async incrementFailedLoginAttempts(userId) {
    // Logic theo dõi số lần đăng nhập thất bại
  }
}

module.exports = new AuthController();