const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');
const Team = require('./Team');
const Registration = require('./Registration');
const Category = require('./Category');
const Route = require('./Route');
const TallaPlayera = require('./TallaPlayera');
const Resultado = require('./Resultado');

// Definir relaciones
User.hasMany(Event, { foreignKey: 'organizador_id', as: 'eventosOrganizados' });
Event.belongsTo(User, { foreignKey: 'organizador_id', as: 'organizador' });

User.hasMany(Team, { foreignKey: 'capitan_usuario_id', as: 'equiposCapitaneados' });
Team.belongsTo(User, { foreignKey: 'capitan_usuario_id', as: 'capitan' });

// Relacion muchos a muchos entre usuarios y equipos
const TeamMember = sequelize.define('TeamMember', {}, { 
    tableName: 'miembros_equipos', 
    timestamps: false 
});

User.belongsToMany(Team, { 
    through: TeamMember, 
    foreignKey: 'usuario_id', 
    otherKey: 'equipo_id', 
    as: 'equipos' 
});

Team.belongsToMany(User, { 
    through: TeamMember, 
    foreignKey: 'equipo_id', 
    otherKey: 'usuario_id', 
    as: 'miembros' 
});

Event.hasMany(Registration, { foreignKey: 'evento_id', as: 'inscripciones' });
Registration.belongsTo(Event, { foreignKey: 'evento_id', as: 'evento' });

User.hasMany(Registration, { foreignKey: 'usuario_id', as: 'inscripciones' });
Registration.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

Team.hasMany(Registration, { foreignKey: 'equipo_id', as: 'inscripciones' });
Registration.belongsTo(Team, { foreignKey: 'equipo_id', as: 'equipo' });

Event.hasMany(Category, { foreignKey: 'evento_id', as: 'categorias' });
Category.belongsTo(Event, { foreignKey: 'evento_id', as: 'evento' });

Event.hasMany(Route, { foreignKey: 'evento_id', as: 'rutas' });
Route.belongsTo(Event, { foreignKey: 'evento_id', as: 'evento' });

Registration.belongsTo(TallaPlayera, { foreignKey: 'talla_playera_id', as: 'talla' });
TallaPlayera.hasMany(Registration, { foreignKey: 'talla_playera_id', as: 'inscripciones' });

Event.hasMany(Resultado, { foreignKey: 'evento_id', as: 'resultados' });
Resultado.belongsTo(Event, { foreignKey: 'evento_id', as: 'evento' });

User.hasMany(Resultado, { foreignKey: 'usuario_id', as: 'resultados' });
Resultado.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = {
    sequelize,
    User,
    Event,
    Team,
    Registration,
    Category,
    Route,
    TallaPlayera,
    Resultado,
    TeamMember
};