const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Gamme_production = sequelize.define('Gamme_production', {
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
}, { tableName: 'gamme_production', timestamps: false });