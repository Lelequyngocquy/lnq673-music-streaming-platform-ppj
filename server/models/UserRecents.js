module.exports = (sequelize, DataTypes) => {
    const UserRecents = sequelize.define("UserRecents", {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng User
          key: 'id', // Khóa chính của bảng User
        },
      },
      AlbumID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Albums', // Tên bảng Album (Giả sử đã có bảng này)
          key: 'AlbumID', // Khóa chính của bảng Album
        },
      },
      playedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Mặc định là thời gian hiện tại khi thêm bản ghi
      },
    });
  
    // Quan hệ giữa User và UserRecents (1 User có nhiều lịch sử nghe album)
    UserRecents.associate = function (models) {
      UserRecents.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'users',
      });
      UserRecents.belongsTo(models.Albums, {
        foreignKey: 'AlbumID',
        as: 'albums',
      });
    };
  
    return UserRecents;
  };
  