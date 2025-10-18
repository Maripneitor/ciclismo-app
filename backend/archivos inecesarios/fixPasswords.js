// /home/maripneitor/ciclismo-app/backend/fixPasswords.js
const { sequelize, User } = require('../models');

async function fixPasswords() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida');

    const users = await User.findAll({
      where: {
        email: ['admin@ciclismo.com', 'organizador@ciclismo.com', 'usuario@ciclismo.com']
      }
    });

    console.log(`🔄 Actualizando contraseñas para ${users.length} usuarios...`);

    for (let user of users) {
      console.log(`   Procesando: ${user.email}`);
      
      // Forzar el cambio usando update en lugar de save
      await User.update(
        { 
          password: 'password123',
          updatedAt: new Date()
        },
        { 
          where: { id: user.id },
          individualHooks: true // ¡ESTO ES IMPORTANTE!
        }
      );
      
      console.log(`   ✅ ${user.email}: contraseña actualizada`);
    }

    // Verificar resultado
    const finalUsers = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'role', 'password']
    });
    
    console.log('\n📋 RESULTADO FINAL:');
    console.log('='.repeat(50));
    finalUsers.forEach(user => {
      const isHashed = user.password.startsWith('$2a$');
      console.log(`👤 ${user.nombre} (${user.email})`);
      console.log(`   Contraseña: ${isHashed ? '✅ HASHEADO' : '❌ TEXT PLANO'}`);
      if (isHashed) {
        console.log(`   Hash: ${user.password.substring(0, 30)}...`);
      }
      console.log('');
    });

    console.log('🎉 ¡Proceso completado!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixPasswords();