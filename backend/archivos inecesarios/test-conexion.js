const { User, sequelize } = require('./models');

async function testConexion() {
  try {
    console.log('🔍 TESTEO DE CONEXIÓN COMPLETO');
    
    // 1. Probar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL: OK');
    
    // 2. Probar consulta de usuarios
    const users = await User.findAll();
    console.log(`✅ Consulta de usuarios: ${users.length} usuarios encontrados`);
    
    // 3. Probar actualización
    const resultado = await User.update(
      { email: 'erick.test@test.com' },
      { where: { nombre: 'Erick Gamaliel' } }
    );
    console.log(`✅ Actualización: ${resultado[0]} filas afectadas`);
    
    // 4. Verificar la actualización
    const userActualizado = await User.findOne({ where: { nombre: 'Erick Gamaliel' } });
    console.log(`✅ Verificación: Email actual = ${userActualizado?.email}`);
    
    // 5. Mostrar todos los usuarios
    console.log('\n📊 USUARIOS EN LA BASE DE DATOS:');
    const todos = await User.findAll({ attributes: ['id', 'nombre', 'email', 'role'] });
    todos.forEach(user => {
      console.log(`   ${user.id}. ${user.nombre} - ${user.email} (${user.role})`);
    });
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConexion();
