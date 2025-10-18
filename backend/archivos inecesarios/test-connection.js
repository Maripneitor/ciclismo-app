const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa!');
    
    // Probar consulta simple
    const [result] = await sequelize.query('SELECT version()');
    console.log('📊 Versión de PostgreSQL:', result[0].version);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
  }
}

testConnection();