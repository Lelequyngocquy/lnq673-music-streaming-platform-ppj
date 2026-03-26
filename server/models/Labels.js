module.exports = (sequelize, DataTypes) => {
    const Labels = sequelize.define("Labels", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
    return Labels;
};
