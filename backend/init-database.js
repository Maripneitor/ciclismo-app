const { User, Event, Team, Registration, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
    try {
        console.log('🔄 Inicializando base de datos...');
        
        // Sincronizar tablas sin forzar
        await sequelize.sync({ force: false });
        console.log('✅ Tablas sincronizadas');

        // Generar contraseña REAL
        const hashedPassword = await bcrypt.hash('password123', 10);
        console.log('✅ Contraseña generada para todos los usuarios: password123');

        // CREAR USUARIOS DE PRUEBA
        console.log('\n👤 Creando usuarios de prueba...');

        const users = await User.bulkCreate([
            {
                nombre_completo: 'Administrador Principal',
                email: 'admin@ciclismo.com',
                contrasena: hashedPassword,
                rol: 'admin',
                puede_crear_equipo: true,
                telefono: '+34 600 111 222'
            },
            {
                nombre_completo: 'Organizador Eventos',
                email: 'organizador@ciclismo.com',
                contrasena: hashedPassword,
                rol: 'organizador',
                puede_crear_equipo: true,
                telefono: '+34 600 333 444'
            },
            {
                nombre_completo: 'Usuario Demo',
                email: 'usuario@ciclismo.com',
                contrasena: hashedPassword,
                rol: 'usuario',
                puede_crear_equipo: false,
                telefono: '+34 600 555 666'
            }
        ], { ignoreDuplicates: true });

        console.log('✅ Usuarios creados/verificados');

        // VERIFICACIÓN FINAL
        console.log('\n📊 VERIFICACIÓN FINAL:');

        const totalUsers = await User.count();
        const totalEvents = await Event.count();
        const totalTeams = await Team.count();
        const totalRegistrations = await Registration.count();

        console.log(`   👥 Usuarios: ${totalUsers}`);
        console.log(`   🎯 Eventos: ${totalEvents}`);
        console.log(`   🏁 Equipos: ${totalTeams}`);
        console.log(`   📝 Inscripciones: ${totalRegistrations}`);

        // Mostrar usuarios creados
        const allUsers = await User.findAll({
            attributes: ['usuario_id', 'nombre_completo', 'email', 'rol']
        });

        console.log('\n📋 LISTA DE USUARIOS:');
        allUsers.forEach(user => {
            console.log(`   ${user.usuario_id}. ${user.nombre_completo} - ${user.email} (${user.rol})`);
        });

        console.log('\n🎉 BASE DE DATOS INICIALIZADA CORRECTAMENTE!');
        console.log('\n🔑 CREDENCIALES PARA PROBAR:');
        console.log('   👑 Admin: admin@ciclismo.com / password123');
        console.log('   🎯 Organizador: organizador@ciclismo.com / password123');
        console.log('   👤 Usuario: usuario@ciclismo.com / password123');
        console.log('\n🌐 URL: http://localhost:5000/api/auth/login');

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