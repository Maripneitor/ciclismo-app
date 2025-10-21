const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resultado = sequelize.define('Resultado', {
    resultado_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'resultado_id'
    },
    evento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'evento_id'
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id'
    },
    posicion: {
        type: DataTypes.INTEGER
    },
    tiempo_total: {
        type: DataTypes.TIME
    },
    categoria: {
        type: DataTypes.STRING(50)
    },
    distancia_completada: {
        type: DataTypes.DECIMAL(8,2),
        field: 'distancia_completada'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'fecha_registro'
    }
}, {
    tableName: 'resultados_evento',
    timestamps: false
});

module.exports = Resultado;