// Albums model
module.exports = (sequelize, DataTypes) => {
  const Albums = sequelize.define('Albums', {
    AlbumID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    releaseDay: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in seconds
      allowNull: true,
    },
    coverPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  // Define relationships
  Albums.associate = (models) => {
    // One-to-many relationship: An album belongs to one artist
    Albums.belongsTo(models.Artists, {
      foreignKey: 'artistID', // Define the foreign key
      as: 'Artist', // Alias for including Artist data
    });

    // Many-to-one: An album belongs to one label
    Albums.belongsTo(models.Labels, { foreignKey: 'labelID', targetKey: 'id' });
  };

  return Albums;
};
