const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function testAllLogins() {
    try {
        console.log('🧪 PROBANDO TODOS LOS LOGINS...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        const testUsers = [
            { email: 'admin@ciclismo.com', expectedRole: 'admin' },
            { email: 'organizador@ciclismo.com', expectedRole: 'organizador' },
            { email: 'usuario@ciclismo.com', expectedRole: 'usuario' },
            { email: 'test@ejemplo.com', expectedRole: 'usuario' },
            { email: 'Josias@gmail.com', expectedRole: 'usuario' }
        ];

        console.log('\n🔐 PROBANDO LOGIN CON password123:');
        console.log('='.repeat(70));

        let allPassed = true;

        for (const test of testUsers) {
            console.log(`\n🧪 Probando: ${test.email}`);
            
            const user = await User.findOne({ 
                where: { email: test.email },
                attributes: { include: ['contrasena'] }
            });

            if (!user) {
                console.log('❌ Usuario no encontrado');
                allPassed = false;
                continue;
            }

            // Verificar contraseña
            const isValid = await bcrypt.compare('password123', user.contrasena);
            
            // Verificar nombre
            const hasValidName = user.nombre_completo && 
                                user.nombre_completo !== 'prueba' && 
                                user.nombre_completo !== 'Usuario Test';

            // Verificar rol
            const hasValidRole = user.rol === test.expectedRole;

            console.log(`👤 Nombre: ${user.nombre_completo}`);
            console.log(`🎯 Rol: ${user.rol} (esperado: ${test.expectedRole})`);
            console.log(`🔐 Contraseña válida: ${isValid ? '✅' : '❌'}`);
            console.log(`📛 Nombre válido: ${hasValidName ? '✅' : '❌'}`);
            console.log(`🎯 Rol válido: ${hasValidRole ? '✅' : '❌'}`);

            if (!isValid || !hasValidName || !hasValidRole) {
                allPassed = false;
                console.log('💥 FALLÓ LA VERIFICACIÓN');
            } else {
                console.log('🎉 LOGIN VÁLIDO');
            }
        }

        console.log('\n' + '='.repeat(70));
        if (allPassed) {
            console.log('🎉 TODOS LOS LOGINS FUNCIONAN CORRECTAMENTE!');
        } else {
            console.log('⚠️ ALGUNOS LOGINS TIENEN PROBLEMAS');
        }

    } catch (error) {
        console.error('❌ Error en pruebas:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión cerrada');
    }
}

if (require.main === module) {
    testAllLogins();
}

module.exports = testAllLogins;