// server.js - Configuración mejorada CON CORS CORREGIDO
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Usar la instancia única de sequelize
const sequelize = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const teamRoutes = require('./routes/teams');
const queryRoutes = require('./routes/queries');

const app = express();

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware CORS configurado CORREGIDO
app.use(cors({
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    
    // Añadir FRONTEND_URL si está definido
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Permitir requests sin origen (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('⚠️  Origen bloqueado por CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// Middleware de logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/queries', queryRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba de base de datos
app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'OK', 
      message: 'Conexión a la base de datos establecida correctamente',
      database: process.env.DB_NAME || 'maripneitor_cycling'
    });
  } catch (error) {
    console.error('❌ Error de conexión a BD:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error conectando a la base de datos',
      error: error.message 
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: error.errors.map(err => err.message)
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflicto de datos únicos',
      details: error.errors.map(err => err.message)
    });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      error: 'Error de base de datos',
      details: error.message
    });
  }
  
  // Manejar errores de CORS
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'Origen no permitido por CORS'
    });
  }
  
  res.status(error.status || 500).json({
    error: error.message || 'Error interno del servidor'
  });
});

// Sincronización de base de datos MEJORADA
const syncDatabase = async () => {
  try {
    // Primero autenticar la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida');
    
    if (process.env.NODE_ENV === 'development') {
      // En desarrollo: usar force: false para evitar perder datos
      await sequelize.sync({ force: false });
      console.log('🔄 Base de datos sincronizada en desarrollo');
    } else {
      // En producción: solo sincronizar sin alterar
      await sequelize.sync();
      console.log('✅ Base de datos sincronizada en producción');
    }
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error);
    
    // Si hay error con ENUM, intentar sincronización más básica
    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === '42804') {
      console.log('🔄 Intentando sincronización sin alterar tipos ENUM...');
      try {
        await sequelize.sync({ force: false });
        console.log('✅ Base de datos sincronizada (modo seguro)');
      } catch (safeError) {
        console.error('❌ Error en sincronización segura:', safeError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Inicialización del servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME || 'maripneitor_cycling'}`);
      console.log(`🔗 Orígenes CORS permitidos:`);
      console.log(`   - http://localhost:3000`);
      console.log(`   - http://127.0.0.1:3000`);
      console.log(`   - http://localhost:5173`);
      console.log(`   - http://127.0.0.1:5173`);
      if (process.env.FRONTEND_URL) {
        console.log(`   - ${process.env.FRONTEND_URL}`);
      }
      console.log(`🔍 Rutas disponibles:`);
      console.log(`   - GET /api/health`);
      console.log(`   - GET /api/db-test`);
      console.log(`   - GET /api/queries/stats`);
      console.log(`   - GET /api/queries/debug-tables`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;