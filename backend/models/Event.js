const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    evento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'evento_id' // Especificar el nombre de columna
    },
    organizador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'organizador_id'
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
        type: DataTypes.STRING(20), // Cambiar a STRING en lugar de ENUM
        allowNull: false
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
    },
    tipo: {
        type: DataTypes.STRING(50)
    },
    ubicacion: {
        type: DataTypes.STRING(200)
    },
    distancia_km: {
        type: DataTypes.DECIMAL(6, 2)
    }
}, {
    tableName: 'eventos',
    timestamps: false,
    freezeTableName: true // Importante: evita que Sequelize pluralice
});

module.exports = Event;