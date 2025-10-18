const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

async function guaranteeUsers() {
  try {
    console.log('🛡️  GARANTIZANDO USUARIOS...');
    
    // Eliminar TODOS los usuarios existentes
    await User.destroy({ where: {} });
    console.log('🗑️  Tabla limpiada');
    
    // Generar contraseña
    const hash = await bcrypt.hash('password123', 10);
    
    // Crear usuarios
    await User.bulkCreate([
      { nombre: 'Admin', email: 'admin@test.com', password: hash, role: 'admin', telefono: '+34 111' },
      { nombre: 'User', email: 'user@test.com', password: hash, role: 'usuario', telefono: '+34 222' }
    ]);
    
    console.log('✅ Usuarios SIMPLES creados:');
    console.log('   admin@test.com / password123');
    console.log('   user@test.com / password123');
    
  } catch (error) {
    console.error('❌ Error crítico:', error);
  } finally {
    await sequelize.close();
  }
}

guaranteeUsers();