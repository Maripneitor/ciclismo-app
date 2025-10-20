const { User, Event, Team, Registration, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
    try {
        console.log('Inicializando base de datos...');
        
        await sequelize.sync({ force: false });
        console.log('Tablas sincronizadas');

        const hashedPassword = await bcrypt.hash('password123', 10);
        console.log('Contraseña generada para todos los usuarios: password123');

        console.log('\nCreando usuarios de prueba...');

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

        console.log('Usuarios creados/verificados');

        console.log('\nVERIFICACIÓN FINAL:');

        const totalUsers = await User.count();
        const totalEvents = await Event.count();
        const totalTeams = await Team.count();
        const totalRegistrations = await Registration.count();

        console.log(`   Usuarios: ${totalUsers}`);
        console.log(`   Eventos: ${totalEvents}`);
        console.log(`   Equipos: ${totalTeams}`);
        console.log(`   Inscripciones: ${totalRegistrations}`);

        const allUsers = await User.findAll({
            attributes: ['usuario_id', 'nombre_completo', 'email', 'rol']
        });

        console.log('\nLISTA DE USUARIOS:');
        allUsers.forEach(user => {
            console.log(`   ${user.usuario_id}. ${user.nombre_completo} - ${user.email} (${user.rol})`);
        });

        console.log('\nBASE DE DATOS INICIALIZADA CORRECTAMENTE!');
        console.log('\nCREDENCIALES PARA PROBAR:');
        console.log('   Admin: admin@ciclismo.com / password123');
        console.log('   Organizador: organizador@ciclismo.com / password123');
        console.log('   Usuario: usuario@ciclismo.com / password123');
        console.log('\nURL: http://localhost:5000/api/auth/login');

    } catch (error) {
        console.error('Error inicializando base de datos:', error);
    } finally {
        await sequelize.close();
    }
}

if (require.main === module) {
    initDatabase();
}

module.exports = initDatabase;