const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function updatePasswords() {
  try {
    console.log('🔄 Actualizando contraseñas de usuarios...');
    
    // Contraseña real hasheada para "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔑 Contraseña hasheada:', hashedPassword);

    const usersToUpdate = [
      'admin@ciclismo.com',
      'organizador@ciclismo.com', 
      'usuario@ciclismo.com'
    ];

    for (const email of usersToUpdate) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        user.password = hashedPassword;
        await user.save();
        console.log(`✅ Contraseña actualizada para: ${user.nombre}`);
      }
    }

    console.log('🎉 Todas las contraseñas actualizadas correctamente!');

  } catch (error) {
    console.error('❌ Error actualizando contraseñas:', error);
  } finally {
    process.exit();
  }
}

updatePasswords();