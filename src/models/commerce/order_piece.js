const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Order_piece = sequelize.define('Order_piece', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_order: {
        foreignKey:true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_piece: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false,
    },
}, {
    tableName: 'order_piece',
    timestamps: false,
});