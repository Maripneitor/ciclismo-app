const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');

// Definir relaciones
User.hasMany(Event, { foreignKey: 'organizadorId', as: 'eventosOrganizados' });
Event.belongsTo(User, { foreignKey: 'organizadorId', as: 'organizador' });

User.belongsToMany(Event, { 
  through: Registration,
  foreignKey: 'userId',
  as: 'eventosInscritos'
});

Event.belongsToMany(User, { 
  through: Registration,
  foreignKey: 'eventId',
  as: 'participantes'
});

Registration.belongsTo(User, { foreignKey: 'userId' });
Registration.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = {
  sequelize,
  User,
  Event,
  Registration
};