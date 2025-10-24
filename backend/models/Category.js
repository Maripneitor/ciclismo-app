const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    categoria_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'categoria_id'
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
    descripcion: {
        type: DataTypes.TEXT
    },
    cuota_categoria: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'cuota_categoria'
    },
    maximo_participantes_categoria: {
        type: DataTypes.INTEGER,
        field: 'maximo_participantes_categoria'
    },
    punto_control_final_id: {
        type: DataTypes.INTEGER,
        field: 'punto_control_final_id'
    }
  }, { 
    tableName: 'categories_evento',
    timestamps: false
  });

  return Category;
};