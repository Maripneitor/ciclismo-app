const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
    equipo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    capitan_usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    enlace_invitacion: {
        type: DataTypes.STRING(255),
        unique: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'equipos',
    timestamps: false
});

module.exports = Team;