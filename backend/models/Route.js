const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Route = sequelize.define('Route', {
    ruta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ruta_id'
    },
    evento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'evento_id'
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    distancia_km: {
        type: DataTypes.DECIMAL(6, 2),
        field: 'distancia_km'
    }
  }, {
    tableName: 'rutas',
    timestamps: false
  });

  return Route;
};