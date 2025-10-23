const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/queries', require('./routes/queries'));

app.get('/api/health', (req, res) => {
    res.json({
        message: 'API de Gestión de Eventos de Ciclismo funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'El archivo es demasiado grande' });
        }
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

const syncDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Base de datos sincronizada (alter) para desarrollo');
    } else {
      await sequelize.sync();
      console.log('Base de datos sincronizada (safe) para producción');
    }
  } catch (error) {
    console.error('Error sincronizando base de datos:', error);
  }
};

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
    return syncDatabase();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Serviendo archivos estáticos desde: ${path.join(__dirname, 'uploads')}`);
    });
  })
  .catch(err => {
    console.error('Error conectando a la base de datos:', err);
  });