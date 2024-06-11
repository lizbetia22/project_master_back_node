const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Gamme = sequelize.define('Gamme', {
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
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}, { tableName: 'gamme', timestamps: false });