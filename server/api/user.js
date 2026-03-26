const express = require('express');
const bcrypt = require('bcryptjs');
const { Users } = require('../models'); // Import Users model
const router = express.Router();

// POST: Tạo mới một người dùng (bao gồm băm mật khẩu)
router.post('/users', async (req, res) => {
  const { username, email, password, role = 'user', AvatarPath = '' } = req.body;

  console.log('Received request body:', req.body); // Debug request body

  try {
    if (!password || password.trim().length < 6) {
      console.log('Password validation failed'); // Debug password validation
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Băm mật khẩu trước khi lưu vào DB
    console.log('Original password:', password); // Debug original password
    const salt = await bcrypt.genSalt(12);
    console.log('Generated salt:', salt); // Debug generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword); // Debug hashed password

    // Tạo người dùng mới
    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
      role,
      AvatarPath,
    });
    console.log('New user created:', newUser); // Debug new user

    res.status(201).json({ message: 'Người dùng đã được tạo thành công', user: newUser });
  } catch (error) {
    console.error('Error while creating user:', error); // Debug error
    res.status(500).json({ message: 'Lỗi khi tạo người dùng', error });
  }
});

// GET: Lấy tất cả người dùng
router.get('/users', async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error });
  }
});

// GET: Lấy một người dùng theo ID
router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy người dùng', error });
  }
});

// PUT: Cập nhật thông tin người dùng theo ID (bao gồm mật khẩu nếu có)
router.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, role, AvatarPath } = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }

    // Nếu mật khẩu được cung cấp, băm mật khẩu mới
    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    } else if (password) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Cập nhật thông tin còn lại
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.AvatarPath = AvatarPath || user.AvatarPath;

    await user.save(); // Lưu vào DB

    res.status(200).json({ message: 'Cập nhật người dùng thành công', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error });
  }
});

// DELETE: Xóa người dùng theo ID
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }

    await user.destroy(); // Xóa người dùng khỏi DB
    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error });
  }
});

module.exports = router;
