const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TallaPlayera = sequelize.define('TallaPlayera', {
    talla_playera_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'talla_playera_id'
    },
    nombre: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'tallas_playera',
    timestamps: false
});

module.exports = TallaPlayera;