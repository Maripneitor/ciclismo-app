const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  fechaInscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  numeroCorredor: {
    type: DataTypes.STRING
  },
  categoria: {
    type: DataTypes.STRING
  }
});

module.exports = Registration;