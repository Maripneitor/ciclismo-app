const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function initUsers() {
    try {
        console.log('🔄 Inicializando usuarios de prueba...');

        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL establecida');

        // Generar contraseña hasheada
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Definir los usuarios a crear
        const usersToCreate = [
            {
                nombre_completo: 'Administrador Principal',
                email: 'admin@ciclismo.com',
                contrasena: hashedPassword,
                rol: 'admin',
                puede_crear_equipo: true,
                telefono: '+34 600 111 222'
            },
            {
                nombre_completo: 'Organizador de Eventos',
                email: 'organizador@ciclismo.com',
                contrasena: hashedPassword,
                rol: 'organizador',
                puede_crear_equipo: true,
                telefono: '+34 600 333 444'
            },
            {
                nombre_completo: 'Usuario Regular',
                email: 'usuario@ciclismo.com',
                contrasena: hashedPassword,
                rol: 'usuario',
                puede_crear_equipo: false,
                telefono: '+34 600 555 666'
            }
        ];

        console.log('👥 Creando usuarios...');

        // Crear usuarios (ignorar si ya existen)
        for (const userData of usersToCreate) {
            try {
                const [user, created] = await User.findOrCreate({
                    where: { email: userData.email },
                    defaults: userData
                });

                if (created) {
                    console.log(`✅ Usuario creado: ${userData.email} (${userData.rol})`);
                } else {
                    console.log(`⚠️ Usuario ya existe: ${userData.email}`);
                    
                    // Actualizar contraseña y datos del usuario existente
                    await User.update(
                        { 
                            contrasena: hashedPassword,
                            nombre_completo: userData.nombre_completo,
                            rol: userData.rol,
                            puede_crear_equipo: userData.puede_crear_equipo,
                            telefono: userData.telefono
                        },
                        { where: { email: userData.email } }
                    );
                    console.log(`✅ Usuario actualizado: ${userData.email}`);
                }
            } catch (error) {
                console.error(`❌ Error con ${userData.email}:`, error.message);
            }
        }

        // Verificar usuarios creados
        console.log('\n📋 VERIFICACIÓN DE USUARIOS:');
        const allUsers = await User.findAll({
            attributes: ['usuario_id', 'nombre_completo', 'email', 'rol', 'puede_crear_equipo']
        });

        console.log('\n👥 LISTA DE USUARIOS:');
        allUsers.forEach(user => {
            console.log(`   ${user.usuario_id}. ${user.nombre_completo}`);
            console.log(`      Email: ${user.email}`);
            console.log(`      Rol: ${user.rol}`);
            console.log(`      Puede crear equipo: ${user.puede_crear_equipo}`);
            console.log('');
        });

        console.log('✅ USUARIOS INICIALIZADOS CORRECTAMENTE!');
        console.log('\n🔑 CREDENCIALES PARA PROBAR:');
        console.log('   👑 Admin: admin@ciclismo.com / password123');
        console.log('   🎯 Organizador: organizador@ciclismo.com / password123');
        console.log('   👤 Usuario: usuario@ciclismo.com / password123');

    } catch (error) {
        console.error('❌ Error inicializando usuarios:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión cerrada');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    initUsers();
}

module.exports = initUsers;