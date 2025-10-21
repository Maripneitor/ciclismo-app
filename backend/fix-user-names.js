const { User, sequelize } = require('./models');

async function fixUserNames() {
    try {
        console.log('✏️ CORRIGIENDO NOMBRES DE USUARIOS...');
        
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Correcciones de nombres
        const nameCorrections = [
            { email: 'admin@ciclismo.com', newName: 'Administrador Principal' },
            { email: 'organizador@ciclismo.com', newName: 'Organizador de Eventos' },
            { email: 'usuario@ciclismo.com', newName: 'Usuario Regular' }
        ];

        for (const correction of nameCorrections) {
            console.log(`\n🔄 Corrigiendo: ${correction.email}`);
            
            const user = await User.findOne({ where: { email: correction.email } });

            if (!user) {
                console.log('❌ Usuario no encontrado');
                continue;
            }

            console.log(`📛 Nombre actual: ${user.nombre_completo}`);
            console.log(`✏️ Nuevo nombre: ${correction.newName}`);
            
            user.nombre_completo = correction.newName;
            await user.save();
            
            console.log('✅ Nombre corregido');
        }

        // Mostrar usuarios corregidos
        const correctedUsers = await User.findAll({
            where: {
                email: {
                    [sequelize.Op.in]: [
                        'admin@ciclismo.com',
                        'organizador@ciclismo.com',
                        'usuario@ciclismo.com'
                    ]
                }
            },
            attributes: ['usuario_id', 'nombre_completo', 'email', 'rol']
        });

        console.log('\n📋 USUARIOS CORREGIDOS:');
        console.log('='.repeat(60));
        correctedUsers.forEach(user => {
            console.log(`👤 ${user.usuario_id}. ${user.nombre_completo}`);
            console.log(`   📧 ${user.email}`);
            console.log(`   🎯 Rol: ${user.rol}`);
            console.log(`   🔑 Contraseña: password123`);
            console.log('');
        });

        console.log('🎉 NOMBRES CORREGIDOS EXITOSAMENTE!');

    } catch (error) {
        console.error('❌ Error corrigiendo nombres:', error);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión cerrada');
    }
}

if (require.main === module) {
    fixUserNames();
}

module.exports = fixUserNames;