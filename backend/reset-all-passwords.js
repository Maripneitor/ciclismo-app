const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function resetAllPasswords() {
    try {
        console.log('🔄 RESETEANDO TODAS LAS CONTRASEÑAS...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Obtener todos los usuarios
        const users = await User.findAll();

        console.log(`📊 Encontrados ${users.length} usuarios`);

        const newPassword = 'password123';

        for (const user of users) {
            console.log(`\n🔄 Procesando: ${user.email}`);
            console.log(`👤 Nombre: ${user.nombre_completo}`);
            console.log(`🎯 Rol: ${user.rol}`);
            
            // **RESETEO DIRECTO - Forzar el hash manualmente**
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Actualizar directamente en la base de datos
            await sequelize.query(
                'UPDATE usuarios SET contrasena = ? WHERE usuario_id = ?',
                {
                    replacements: [hashedPassword, user.usuario_id],
                    type: sequelize.QueryTypes.UPDATE
                }
            );
            
            console.log(`✅ Contraseña reseteada para: ${user.email}`);
            console.log(`🔑 Nuevo hash: ${hashedPassword.substring(0, 20)}...`);
            
            // Verificar inmediatamente
            const updatedUser = await User.findOne({ 
                where: { usuario_id: user.usuario_id },
                attributes: { include: ['contrasena'] }
            });
            
            const isValid = await bcrypt.compare(newPassword, updatedUser.contrasena);
            console.log(`✅ Verificación: ${isValid ? 'OK' : 'ERROR'}`);
        }

        console.log('\n🎉 TODAS LAS CONTRASEÑAS RESETEADAS EXITOSAMENTE!');
        console.log('🔑 Todas las contraseñas ahora son: password123');

        // Mostrar resumen final
        const allUsers = await User.findAll({
            attributes: ['usuario_id', 'nombre_completo', 'email', 'rol']
        });

        console.log('\n📋 RESUMEN FINAL:');
        console.log('='.repeat(60));
        allUsers.forEach(user => {
            console.log(`👤 ${user.usuario_id}. ${user.nombre_completo}`);
            console.log(`   📧 ${user.email}`);
            console.log(`   🎯 Rol: ${user.rol}`);
            console.log(`   🔑 Contraseña: password123`);
        });

    } catch (error) {
        console.error('❌ Error reseteando contraseñas:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión cerrada');
    }
}

if (require.main === module) {
    resetAllPasswords();
}

module.exports = resetAllPasswords;