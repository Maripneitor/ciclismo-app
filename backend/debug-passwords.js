const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function debugPasswords() {
    try {
        console.log('🐛 DEBUG DETALLADO DE CONTRASEÑAS...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        const testEmails = [
            'admin@ciclismo.com',
            'organizador@ciclismo.com', 
            'usuario@ciclismo.com',
            'test@ejemplo.com',
            'Josias@gmail.com'
        ];

        console.log('\n🔍 VERIFICANDO CONTRASEÑAS ACTUALES:');
        console.log('='.repeat(80));

        for (const email of testEmails) {
            console.log(`\n🧪 Probando: ${email}`);
            
            const user = await User.findOne({ 
                where: { email },
                attributes: { include: ['contrasena'] }
            });

            if (!user) {
                console.log('❌ Usuario no encontrado');
                continue;
            }

            console.log(`👤 ID: ${user.usuario_id}`);
            console.log(`📛 Nombre: ${user.nombre_completo}`);
            console.log(`🎯 Rol: ${user.rol}`);
            console.log(`🔑 Hash: ${user.contrasena}`);
            console.log(`📏 Longitud hash: ${user.contrasena.length}`);

            // Probar diferentes contraseñas
            const testPasswords = [
                'password123',
                'Password123',
                'PASSWORD123',
                'password',
                'Password',
                '123456'
            ];

            for (const password of testPasswords) {
                try {
                    const isValid = await bcrypt.compare(password, user.contrasena);
                    console.log(`   🔍 '${password}': ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
                    if (isValid) {
                        console.log(`   🎉 CONTRASEÑA CORRECTA ENCONTRADA: '${password}'`);
                    }
                } catch (error) {
                    console.log(`   💥 Error probando '${password}': ${error.message}`);
                }
            }
        }

    } catch (error) {
        console.error('❌ Error en debug:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión cerrada');
    }
}

if (require.main === module) {
    debugPasswords();
}

module.exports = debugPasswords;