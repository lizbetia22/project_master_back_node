const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

const Piece = sequelize.define('Piece', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false,
    },
}, {
    tableName: 'pieces',
    timestamps: false,
});

module.exports = Piece