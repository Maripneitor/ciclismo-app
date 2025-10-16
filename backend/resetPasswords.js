const { sequelize, User } = require('./models');

async function resetPasswords() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida');

    // Buscar usuarios existentes
    const users = await User.findAll({
      where: {
        email: ['admin@ciclismo.com', 'organizador@ciclismo.com', 'usuario@ciclismo.com']
      }
    });

    console.log(`📊 Encontrados ${users.length} usuarios`);

    if (users.length === 0) {
      console.log('⚠️ No se encontraron usuarios. Creándolos...');
      
      // Crear usuarios
      const newUsers = await User.bulkCreate([
        {
          nombre: 'Administrador',
          email: 'admin@ciclismo.com',
          password: 'password123',
          role: 'admin',
          telefono: '123456789'
        },
        {
          nombre: 'Organizador', 
          email: 'organizador@ciclismo.com',
          password: 'password123',
          role: 'organizador',
          telefono: '987654321'
        },
        {
          nombre: 'Usuario Regular',
          email: 'usuario@ciclismo.com',
          password: 'password123',
          role: 'usuario',
          telefono: '555555555'
        }
      ]);
      
      console.log(`✅ ${newUsers.length} usuarios creados exitosamente`);
    } else {
      console.log('🔄 Actualizando contraseñas existentes...');
      
      for (let user of users) {
        console.log(`   Procesando: ${user.email}`);
        
        // Guardar con nueva contraseña para activar el hook bcrypt
        user.password = 'password123';
        await user.save();
        
        console.log(`   ✅ ${user.email}: contraseña hasheada`);
      }
    }

    // Verificar el resultado final
    const finalUsers = await User.findAll({
      where: {
        email: ['admin@ciclismo.com', 'organizador@ciclismo.com', 'usuario@ciclismo.com']
      },
      attributes: ['id', 'nombre', 'email', 'role', 'password']
    });
    
    console.log('\n📋 RESULTADO FINAL:');
    console.log('='.repeat(50));
    finalUsers.forEach(user => {
      const isHashed = user.password.startsWith('$2a$');
      console.log(`👤 ${user.nombre} (${user.email})`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Contraseña: ${isHashed ? '✅ HASHEADO' : '❌ TEXT PLANO'}`);
      console.log(`   Hash: ${user.password.substring(0, 30)}...`);
      console.log('');
    });

    console.log('🎉 ¡Proceso completado!');
    console.log('💡 Ahora puedes probar el login con:');
    console.log('   Email: admin@ciclismo.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
resetPasswords();