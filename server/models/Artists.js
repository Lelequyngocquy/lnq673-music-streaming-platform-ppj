// Artists model
module.exports = (sequelize, DataTypes) => {
    const Artists = sequelize.define("Artists", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileCoverPath:{
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
  
    return Artists;
  };
  