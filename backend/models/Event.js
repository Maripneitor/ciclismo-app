const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    evento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dificultad: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    distancia_km: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    elevacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cupo_maximo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    participantes_inscritos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    cuota_inscripcion: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    estado: {
      type: DataTypes.STRING(50),
      defaultValue: 'próximo'
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    route_data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        coordinates: [],
        sectors: [],
        elevation_profile: []
      }
    },
    gpx_file_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    start_coordinates: {
      type: DataTypes.JSON,
      allowNull: true
    },
    end_coordinates: {
      type: DataTypes.JSON,
      allowNull: true
    },
    // AÑADIDO: Campo para relación con organizador
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    // CORREGIDO: Nombre de tabla explícito
    tableName: 'eventos',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (event) => {
        if (!event.route_data) {
          event.route_data = {
            coordinates: [],
            sectors: [],
            elevation_profile: []
          };
        }
      }
    }
  });

  // AÑADIDO: Asociaciones para evitar errores
  Event.associate = function(models) {
    Event.belongsTo(models.User, {
      foreignKey: 'organization_id',
      as: 'organizador'
    });
    Event.hasMany(models.Category, {
      foreignKey: 'evento_id',
      as: 'categorias'
    });
    Event.hasMany(models.Registration, {
      foreignKey: 'evento_id',
      as: 'inscripciones'
    });
  };

  return Event;
};