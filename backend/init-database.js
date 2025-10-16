const { User, Event, Registration, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    console.log('🚀 Inicializando base de datos desde cero...');
    
    // 1. Sincronizar tablas (esto las recrea si es necesario)
    await sequelize.sync({ force: false }); // No usar force: true para no perder estructura
    console.log('✅ Tablas sincronizadas');

    // 2. Generar contraseña REAL
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔑 Contraseña generada para todos los usuarios: password123');

    // 3. CREAR USUARIOS DE PRUEBA
    console.log('\n👥 Creando usuarios de prueba...');
    const users = await User.bulkCreate([
      {
        nombre: 'Administrador Principal',
        email: 'admin@ciclismo.com',
        password: hashedPassword,
        role: 'admin',
        telefono: '+34 600 111 222'
      },
      {
        nombre: 'Organizador Eventos',
        email: 'organizador@ciclismo.com',
        password: hashedPassword,
        role: 'organizador',
        telefono: '+34 600 333 444'
      },
      {
        nombre: 'Usuario Demo',
        email: 'usuario@ciclismo.com',
        password: hashedPassword,
        role: 'usuario',
        telefono: '+34 600 555 666'
      }
    ]);
    console.log('✅ 3 usuarios creados');

    // 4. CREAR EVENTOS DE PRUEBA
    console.log('\n🚴 Creando eventos de prueba...');
    const events = await Event.bulkCreate([
      {
        nombre: 'Gran Fondo Sierra Nevada',
        descripcion: 'Una emocionante carrera por las montañas de Sierra Nevada. 120km de pura aventura con paisajes espectaculares.',
        fecha: new Date('2024-12-15T08:00:00Z'),
        ubicacion: 'Sierra Nevada, Granada',
        distancia: 120.5,
        tipo: 'montaña',
        maxParticipantes: 100,
        precio: 45.00,
        estado: 'proximamente',
        organizadorId: users[0].id // Admin como organizador
      },
      {
        nombre: 'Carrera Nocturna Madrid',
        descripcion: 'Recorrido urbano nocturno por las calles de Madrid. Iluminación especial y ambiente festivo.',
        fecha: new Date('2024-11-20T20:00:00Z'),
        ubicacion: 'Madrid Centro',
        distancia: 42.0,
        tipo: 'urbano',
        maxParticipantes: 200,
        precio: 25.00,
        estado: 'activo',
        organizadorId: users[1].id // Organizador como organizador
      },
      {
        nombre: 'Maratón Costa Barcelona',
        descripcion: 'Hermosa ruta costera con vistas al Mediterráneo. Perfecta para todos los niveles.',
        fecha: new Date('2024-10-30T09:00:00Z'),
        ubicacion: 'Barcelona, Costa Brava',
        distancia: 80.0,
        tipo: 'ruta',
        maxParticipantes: 150,
        precio: 35.00,
        estado: 'activo',
        organizadorId: users[1].id
      }
    ]);
    console.log('✅ 3 eventos creados');

    // 5. CREAR INSCRIPCIONES DE PRUEBA
    console.log('\n📝 Creando inscripciones de prueba...');
    await Registration.bulkCreate([
      {
        userId: users[2].id, // Usuario demo
        eventId: events[0].id, // Sierra Nevada
        estado: 'confirmado',
        fechaInscripcion: new Date(),
        numeroCorredor: 'SN001',
        categoria: '30-40'
      },
      {
        userId: users[2].id, // Usuario demo
        eventId: events[1].id, // Madrid Nocturna
        estado: 'pendiente',
        fechaInscripcion: new Date(),
        numeroCorredor: 'MN002',
        categoria: '30-40'
      }
    ]);
    console.log('✅ 2 inscripciones creadas');

    // 6. VERIFICACIÓN FINAL
    console.log('\n📊 VERIFICACIÓN FINAL:');
    
    const totalUsers = await User.count();
    const totalEvents = await Event.count();
    const totalRegistrations = await Registration.count();

    console.log(`   👥 Usuarios: ${totalUsers}`);
    console.log(`   🚴 Eventos: ${totalEvents}`);
    console.log(`   📝 Inscripciones: ${totalRegistrations}`);

    // Mostrar usuarios creados
    const allUsers = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'role']
    });
    
    console.log('\n📋 LISTA DE USUARIOS:');
    allUsers.forEach(user => {
      console.log(`   ${user.id}. ${user.nombre} - ${user.email} (${user.role})`);
    });

    console.log('\n🎉 ¡BASE DE DATOS INICIALIZADA CORRECTAMENTE!');
    console.log('\n🔐 CREDENCIALES PARA PROBAR:');
    console.log('   👑 Admin: admin@ciclismo.com / password123');
    console.log('   🎯 Organizador: organizador@ciclismo.com / password123');
    console.log('   👤 Usuario: usuario@ciclismo.com / password123');
    console.log('\n🌐 URL: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;