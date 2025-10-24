// scripts/setup-database.js - Script consolidado
const sequelize = require('../config/database');
const { User, Event, Registration, Team } = require('../models');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
  try {
    console.log('🔄 Iniciando configuración de base de datos...');
    
    // Sincronizar modelos
    console.log('📦 Sincronizando modelos...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Modelos sincronizados');
    
    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.bulkCreate([
      {
        nombre: 'Admin User',
        email: 'admin@maripneitor.com',
        contrasena: hashedPassword,
        rol: 'admin',
        telefono: '+34600123456',
        fecha_nacimiento: '1980-01-01',
        ubicacion: 'Madrid, España'
      },
      {
        nombre: 'Organizer User',
        email: 'organizador@maripneitor.com',
        contrasena: hashedPassword,
        rol: 'organizador',
        telefono: '+34600123457',
        fecha_nacimiento: '1985-05-15',
        ubicacion: 'Barcelona, España'
      },
      {
        nombre: 'Regular User',
        email: 'usuario@maripneitor.com',
        contrasena: hashedPassword,
        rol: 'usuario',
        telefono: '+34600123458',
        fecha_nacimiento: '1990-12-20',
        ubicacion: 'Valencia, España'
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Usuarios creados');
    
    // Crear eventos de prueba
    console.log('🎯 Creando eventos de prueba...');
    const events = await Event.bulkCreate([
      {
        nombre: 'Gran Fondo Sierra Nevada',
        descripcion: 'Desafiante ruta por las montañas de Sierra Nevada con paisajes espectaculares',
        fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde hoy
        ubicacion: 'Granada, España',
        tipo: 'carrera',
        distancia_km: 120,
        elevacion: 2500,
        dificultad: 'alta',
        cupo_maximo: 100,
        cuota_inscripcion: 45.00,
        estado: 'próximo',
        organizador_id: users[1].usuario_id
      },
      {
        nombre: 'Ruta Nocturna Madrid Río',
        descripcion: 'Paseo recreativo nocturno por los márgenes del Río Manzanares',
        fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días desde hoy
        ubicacion: 'Madrid, España',
        tipo: 'recreativo',
        distancia_km: 25,
        elevacion: 150,
        dificultad: 'baja',
        cupo_maximo: 50,
        cuota_inscripcion: 0.00,
        estado: 'próximo',
        organizador_id: users[1].usuario_id
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Eventos creados');
    
    // Crear inscripciones de prueba
    console.log('📝 Creando inscripciones de prueba...');
    await Registration.bulkCreate([
      {
        usuario_id: users[2].usuario_id,
        evento_id: events[0].evento_id,
        estado: 'confirmado',
        fecha_inscripcion: new Date(),
        metodo_pago: 'tarjeta',
        monto_pagado: 45.00
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Inscripciones creadas');
    
    console.log('🎉 Configuración de base de datos completada exitosamente!');
    console.log('\n📋 Datos de acceso:');
    console.log('👑 Admin: admin@maripneitor.com / password123');
    console.log('📊 Organizador: organizador@maripneitor.com / password123');
    console.log('👤 Usuario: usuario@maripneitor.com / password123');
    
  } catch (error) {
    console.error('❌ Error en configuración de base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = setupDatabase;