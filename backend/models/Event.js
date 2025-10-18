const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    evento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organizador_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.ENUM('Próximo', 'En Curso', 'Finalizado'),
        allowNull: false,
        defaultValue: 'Próximo'
    },
    cuota_inscripcion: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    maximo_participantes: {
        type: DataTypes.INTEGER
    },
    maximo_miembros_por_equipo: {
        type: DataTypes.INTEGER
    },
    permite_union_a_equipos: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'eventos',
    timestamps: false
});

module.exports = Event;