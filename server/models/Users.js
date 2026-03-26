module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    // Tên người dùng
    username: {
      type: DataTypes.STRING,
      allowNull: false, // Không được để trống
      unique: true, // Phải là duy nhất
    },
    // Địa chỉ email của người dùng
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Không được để trống
      unique: true, // Phải là duy nhất
    },
    // Mật khẩu người dùng (đã được băm ở controller)
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Không được để trống
    },
    // Vai trò của người dùng
    role: {
      type: DataTypes.ENUM('user', 'distributor'), // Vai trò có thể là 'user' hoặc 'distributor'
      defaultValue: 'user', // Mặc định là 'user'
    },
    AvatarPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Cung cấp phương thức kiểm tra mật khẩu
  Users.prototype.validPassword = async function(password) {
    const bcrypt = require('bcryptjs'); // Import bcryptjs ở đây để đảm bảo không lỗi phụ thuộc
    return bcrypt.compare(password, this.password); // Kiểm tra mật khẩu nhập vào với mật khẩu băm trong DB
  };

  return Users;
};
