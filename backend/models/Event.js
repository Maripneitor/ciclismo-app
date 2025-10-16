const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  distancia: {
    type: DataTypes.FLOAT
  },
  tipo: {
    type: DataTypes.ENUM('ruta', 'montaña', 'urbano', 'competitivo', 'recreativo')
  },
  maxParticipantes: {
    type: DataTypes.INTEGER
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  estado: {
    type: DataTypes.ENUM('activo', 'cancelado', 'completado', 'proximamente'),
    defaultValue: 'proximamente'
  }
});

module.exports = Event;