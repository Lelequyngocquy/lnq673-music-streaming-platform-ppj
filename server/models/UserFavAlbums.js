module.exports = (sequelize, DataTypes) => {
    const UserFavAlbums = sequelize.define("UserFavAlbums", {
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
    });
  
    // Quan hệ giữa User và UserFavAlbums (1 User có nhiều album yêu thích)
    UserFavAlbums.associate = function (models) {
      UserFavAlbums.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'users',
      });
      UserFavAlbums.belongsTo(models.Albums, {
        foreignKey: 'AlbumID',
        as: 'albums',
      });
    };
  
    return UserFavAlbums;
  };
  