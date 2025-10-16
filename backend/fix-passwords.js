const { User, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  try {
    console.log('🔧 Actualizando contraseñas de usuarios...');
    
    // Generar contraseña hasheada válida para "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔑 Nueva contraseña hasheada generada');

    // Actualizar todos los usuarios
    const result = await User.update(
      { password: hashedPassword },
      { where: {} } // Actualizar todos los usuarios
    );

    console.log(`✅ Contraseñas actualizadas para ${result[0]} usuarios`);

    // Verificar los cambios
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'role', [sequelize.fn('LENGTH', sequelize.col('password')), 'password_length']]
    });

    console.log('\n📋 Verificación de usuarios:');
    users.forEach(user => {
      console.log(`   ${user.nombre} (${user.email}) - Rol: ${user.role} - Longitud password: ${user.dataValues.password_length}`);
    });

  } catch (error) {
    console.error('❌ Error actualizando contraseñas:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

fixPasswords();