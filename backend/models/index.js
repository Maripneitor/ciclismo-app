const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos
const User = require('./User')(sequelize, DataTypes);
const Event = require('./Event')(sequelize, DataTypes);
const Team = require('./Team')(sequelize, DataTypes);
const Registration = require('./Registration')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Route = require('./Route')(sequelize, DataTypes);
const TallaPlayera = require('./TallaPlayera')(sequelize, DataTypes);
const Resultado = require('./Resultado')(sequelize, DataTypes);
const CyclistData = require('./CyclistData')(sequelize, DataTypes);

// Definir relaciones
User.hasMany(Event, { 
  foreignKey: 'organizador_id', 
  as: 'userEventosOrganizados' 
});
Event.belongsTo(User, { 
  foreignKey: 'organizador_id', 
  as: 'eventOrganizador' 
});

User.hasMany(Team, { 
  foreignKey: 'capitan_usuario_id', 
  as: 'userEquiposCapitaneados' 
});
Team.belongsTo(User, { 
  foreignKey: 'capitan_usuario_id', 
  as: 'teamCapitan' 
});

// Relacion muchos a muchos entre usuarios y equipos
const TeamMember = sequelize.define('TeamMember', {}, { 
    tableName: 'miembros_equipos', 
    timestamps: false 
});

User.belongsToMany(Team, { 
    through: TeamMember, 
    foreignKey: 'usuario_id', 
    otherKey: 'equipo_id', 
    as: 'userEquipos' 
});

Team.belongsToMany(User, { 
    through: TeamMember, 
    foreignKey: 'equipo_id', 
    otherKey: 'usuario_id', 
    as: 'teamMiembros' 
});

Event.hasMany(Registration, { 
  foreignKey: 'evento_id', 
  as: 'eventInscripciones' 
});
Registration.belongsTo(Event, { 
  foreignKey: 'evento_id', 
  as: 'registrationEvento' 
});

User.hasMany(Registration, { 
  foreignKey: 'usuario_id', 
  as: 'userInscripciones' 
});
Registration.belongsTo(User, { 
  foreignKey: 'usuario_id', 
  as: 'registrationUsuario' 
});

Team.hasMany(Registration, { 
  foreignKey: 'equipo_id', 
  as: 'teamInscripciones' 
});
Registration.belongsTo(Team, { 
  foreignKey: 'equipo_id', 
  as: 'registrationEquipo' 
});

Event.hasMany(Category, { 
  foreignKey: 'evento_id', 
  as: 'eventCategorias' 
});
Category.belongsTo(Event, { 
  foreignKey: 'evento_id', 
  as: 'categoryEvento' 
});

Event.hasMany(Route, { 
  foreignKey: 'evento_id', 
  as: 'eventRutas' 
});
Route.belongsTo(Event, { 
  foreignKey: 'evento_id', 
  as: 'routeEvento' 
});

Registration.belongsTo(TallaPlayera, { 
  foreignKey: 'talla_playera_id', 
  as: 'registrationTalla' 
});
TallaPlayera.hasMany(Registration, { 
  foreignKey: 'talla_playera_id', 
  as: 'tallaInscripciones' 
});

Event.hasMany(Resultado, { 
  foreignKey: 'evento_id', 
  as: 'eventResultados' 
});
Resultado.belongsTo(Event, { 
  foreignKey: 'evento_id', 
  as: 'resultadoEvento' 
});

User.hasMany(Resultado, { 
  foreignKey: 'usuario_id', 
  as: 'userResultados' 
});
Resultado.belongsTo(User, { 
  foreignKey: 'usuario_id', 
  as: 'resultadoUsuario' 
});

// Relación User - CyclistData (Uno a Uno)
User.hasOne(CyclistData, { 
    foreignKey: 'usuario_id', 
    as: 'userDatosCiclista' 
});
CyclistData.belongsTo(User, { 
    foreignKey: 'usuario_id', 
    as: 'ciclistaDataUsuario' 
});

const db = {
    sequelize,
    User,
    Event,
    Team,
    Registration,
    Category,
    Route,
    TallaPlayera,
    Resultado,
    TeamMember,
    CyclistData
};

module.exports = db;