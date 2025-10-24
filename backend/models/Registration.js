const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Registration = sequelize.define('Registration', {
    inscripcion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    evento_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    talla_playera_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    equipo_id: {
        type: DataTypes.INTEGER
    },
    fecha_inscripcion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    numero_dorsal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    alias_dorsal: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    numero_telefono: {
        type: DataTypes.STRING(20)
    },
    fecha_nacimiento: {
        type: DataTypes.DATE
    },
    genero: {
        type: DataTypes.STRING(50)
    },
    nombre_contacto_emergencia: {
        type: DataTypes.STRING(100)
    },
    telefono_contacto_emergencia: {
        type: DataTypes.STRING(20)
    },
    url_identificacion: {
        type: DataTypes.TEXT
    }
  }, {
    tableName: 'inscripciones',
    timestamps: false
  });

  return Registration;
};