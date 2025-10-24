const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CyclistData = sequelize.define('CyclistData', {
    ciclista_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    genero: {
        type: DataTypes.ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
        allowNull: true
    },
    contacto_emergencia: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    telefono_emergencia: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    talla_playera: {
        type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL'),
        allowNull: true
    },
    tipo_bicicleta: {
        type: DataTypes.ENUM('ruta', 'montaña', 'urbana', 'hibrida', 'gravel'),
        allowNull: true
    },
    nivel_experiencia: {
        type: DataTypes.ENUM('principiante', 'intermedio', 'avanzado', 'experto'),
        allowNull: true
    },
    alergias: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    condiciones_medicas: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    codigo_postal: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
  }, {
    tableName: 'datos_ciclista',
    timestamps: false
  });

  return CyclistData;
};