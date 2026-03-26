const express = require('express');
const { Users } = require('../models');
const router = express.Router();

// Đăng nhập người dùng
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key_here'; // Replace with environment variable in production

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isValid = await user.validPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '2h' } // Token có hiệu lực trong 2 giờ
    );

    res.json({ message: 'Login Successfully', token, user });
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({ message: 'Lỗi khi đăng nhập', error });
  }
});


module.exports = router;
