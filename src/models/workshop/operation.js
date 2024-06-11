const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Operation = sequelize.define('Operation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_post: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_machine: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'operation', timestamps: false });