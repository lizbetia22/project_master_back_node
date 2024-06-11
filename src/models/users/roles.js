const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false,
    }
}, {
    tableName: 'role',
    timestamps: false,
});