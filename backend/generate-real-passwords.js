const bcrypt = require('bcryptjs');

async function generateRealPasswords() {
  console.log('🔑 Generando contraseñas bcrypt válidas...');
  
  // Generar hash real para "password123"
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  console.log('✅ Contraseña hasheada REAL generada:');
  console.log(hashedPassword);
  console.log('\n📝 Copia este hash para usarlo en PostgreSQL');
}

generateRealPasswords();