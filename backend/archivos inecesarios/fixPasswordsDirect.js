// /home/maripneitor/ciclismo-app/backend/fixPasswordsDirect.js
const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');

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

    console.log(`🔄 Hasheando manualmente ${users.length} contraseñas...`);

    for (let user of users) {
      console.log(`   Procesando: ${user.email}`);
      
      // Hashear manualmente
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Actualizar directamente
      await sequelize.query(
        'UPDATE "Users" SET password = $1, "updatedAt" = $2 WHERE id = $3',
        {
          bind: [hashedPassword, new Date(), user.id],
          type: sequelize.QueryTypes.UPDATE
        }
      );
      
      console.log(`   ✅ ${user.email}: contraseña hasheada`);
    }

    // Verificar resultado
    const finalUsers = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'role', 'password']
    });
    
    console.log('\n📋 RESULTAaDO FINAL:');
    console.log('='.repeat(50));
    finalUsers.forEach(user => {
      const isHashed = user.password.startsWith('$2a$');
      console.log(`👤 ${user.nombre} (${user.email})`);
      console.log(`   Contraseña: ${isHashed ? '✅ HASHEADO' : '❌ TEXT PLANO'}`);
      if (isHashed) {
        console.log(`   Hash: ${user.password.substring(0, 25)}...`);
      }
      console.log('');
    });

    console.log('🎉 ¡Contraseñas hasheadas correctamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixPasswords();