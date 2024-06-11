const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
}, {
    tableName: 'user',
    timestamps: false,
});