const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Gamme_operation = sequelize.define('Gamme_operation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_operation: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_gamme: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'gamme_operation', timestamps: false });