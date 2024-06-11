const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Company_order_piece = sequelize.define('Company_order_piece', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_piece: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_order: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'company_order_piece', timestamps: false });