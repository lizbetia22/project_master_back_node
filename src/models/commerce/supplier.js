const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Supplier = sequelize.define('Supplier', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: false,
    }
}, {
    tableName: 'supplier',
    timestamps: false,
});