// backend/scripts/init-database.js - CONSOLIDADO
require('dotenv').config();
const { sequelize } = require('../models');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Query = require('../models/Query');

const seedData = {
  users: [
    {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@maripneitor.com',
      password: 'admin123',
      rol: 'admin',
      telefono: '+34600000001',
      fecha_nacimiento: '1980-01-01'
    },
    {
      nombre: 'Juan',
      apellido: 'Ciclista',
      email: 'juan@example.com',
      password: 'user123',
      rol: 'user',
      telefono: '+34600000002',
      fecha_nacimiento: '1990-05-15'
    }
  ],
  events: [
    {
      nombre: 'Gran Fondo Sierra Nevada',
      descripcion: 'Desafío épico por las montañas de Sierra Nevada',
      fecha: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde hoy
      ubicacion: 'Granada, España',
      tipo: 'Carrera',
      dificultad: 'Alta',
      distancia_km: 120,
      elevacion: 2500,
      cupo_maximo: 200,
      cuota_inscripcion: 45,
      organizador: 'Maripneitor Cycling',
      route_data: {
        coordinates: [
          [37.1773, -3.5985],
          [37.1873, -3.6085],
          [37.1973, -3.6185],
          [37.2073, -3.6285]
        ],
        sectors: [
          { name: 'Salida Granada', distance: 0, elevation: 738 },
          { name: 'Subida Pico Veleta', distance: 40, elevation: 3396 },
          { name: 'Descenso a Monachil', distance: 75, elevation: 820 },
          { name: 'Llegada', distance: 120, elevation: 738 }
        ]
      }
    }
  ]
};

const initDatabase = async () => {
  try {
    console.log('🔄 Iniciando configuración de base de datos...');
    
    // Sincronizar modelos
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Modelos sincronizados');
    
    // Crear usuarios de prueba
    for (const userData of seedData.users) {
      const [user] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
      console.log(`✅ Usuario: ${user.email}`);
    }
    
    // Crear eventos de prueba
    for (const eventData of seedData.events) {
      const [event] = await Event.findOrCreate({
        where: { nombre: eventData.nombre },
        defaults: eventData
      });
      console.log(`✅ Evento: ${event.nombre}`);
    }
    
    console.log('🎉 Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;