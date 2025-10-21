const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function createCleanUsers() {
    try {
        console.log('🧹 CREANDO USUARIOS LIMPIOS DESDE CERO...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Primero eliminar todos los usuarios problemáticos
        console.log('🗑️ Eliminando usuarios existentes...');
        await User.destroy({
            where: {
                email: {
                    [sequelize.Op.in]: [
                        'admin@ciclismo.com',
                        'organizador@ciclismo.com',
                        'usuario@ciclismo.com',
                        'test@ejemplo.com',
                        'Josias@gmail.com'
                    ]
                }
            }
        });

        console.log('✅ Usuarios antiguos eliminados');

        // Crear usuarios nuevos con contraseñas CORRECTAS
        const cleanUsers = [
            {
                nombre_completo: 'Administrador Principal',
                email: 'admin@ciclismo.com',
                contrasena: 'password123', // Se hasheará automáticamente
                rol: 'admin',
                puede_crear_equipo: true,
                telefono: '+34 600 111 222'
            },
            {
                nombre_completo: 'Organizador de Eventos',
                email: 'organizador@ciclismo.com',
                contrasena: 'password123',
                rol: 'organizador',
                puede_crear_equipo: true,
                telefono: '+34 600 333 444'
            },
            {
                nombre_completo: 'Usuario Regular',
                email: 'usuario@ciclismo.com',
                contrasena: 'password123',
                rol: 'usuario',
                puede_crear_equipo: false,
                telefono: '+34 600 555 666'
            }
        ];

        console.log('\n👥 Creando usuarios nuevos...');

        for (const userData of cleanUsers) {
            try {
                const user = await User.create(userData);
                console.log(`✅ Usuario creado: ${user.email} (${user.rol})`);
                
                // Verificar inmediatamente que la contraseña funciona
                const testUser = await User.findOne({ 
                    where: { email: user.email },
                    attributes: { include: ['contrasena'] }
                });
                
                const isValid = await bcrypt.compare('password123', testUser.contrasena);
                console.log(`   🔐 Verificación contraseña: ${isValid ? '✅ OK' : '❌ ERROR'}`);
                
            } catch (error) {
                console.error(`❌ Error creando ${userData.email}:`, error.message);
            }
        }

        // Mostrar resumen final
        const allUsers = await User.findAll({
            attributes: ['usuario_id', 'nombre_completo', 'email', 'rol']
        });

        console.log('\n📋 USUARIOS FINALES:');
        console.log('='.repeat(50));
        allUsers.forEach(user => {
            console.log(`👤 ${user.usuario_id}. ${user.nombre_completo}`);
            console.log(`   📧 ${user.email}`);
            console.log(`   🎯 Rol: ${user.rol}`);
            console.log(`   🔑 Contraseña: password123`);
            console.log('');
        });

        console.log('🎉 USUARIOS CREADOS EXITOSAMENTE!');
        console.log('\n🔑 CREDENCIALES PARA LOGIN:');
        console.log('   Admin: admin@ciclismo.com / password123');
        console.log('   Organizador: organizador@ciclismo.com / password123');
        console.log('   Usuario: usuario@ciclismo.com / password123');

    } catch (error) {
        console.error('❌ Error creando usuarios:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión cerrada');
    }
}

if (require.main === module) {
    createCleanUsers();
}

module.exports = createCleanUsers;