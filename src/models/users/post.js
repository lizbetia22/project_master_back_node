const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Post = sequelize.define('Post', {
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
    tableName: 'post',
    timestamps: false,
});