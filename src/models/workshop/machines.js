const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Machine = sequelize.define('Machine', {
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
    tableName: 'machine',
    timestamps: false,
});