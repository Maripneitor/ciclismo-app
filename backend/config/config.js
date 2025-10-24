require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ciclismo_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ciclismo_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

// Configuración por defecto (para desarrollo)
module.exports.database = process.env.DB_NAME || 'ciclismo_db';
module.exports.username = process.env.DB_USER || 'root';
module.exports.password = process.env.DB_PASSWORD || '';
module.exports.host = process.env.DB_HOST || 'localhost';
module.exports.dialect = process.env.DB_DIALECT || 'mysql';
module.exports.logging = process.env.DB_LOGGING === 'true' ? console.log : false;