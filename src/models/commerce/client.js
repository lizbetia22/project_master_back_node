const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Client_commerce = sequelize.define('Client', {
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
    tableName: 'client',
    timestamps: false,
});