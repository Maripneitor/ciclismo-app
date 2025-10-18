const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));
app.use('/api/queries', require('./routes/queries'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({
        message: 'API de Gestión de Eventos de Ciclismo funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

// Sincronizar base de datos y iniciar servidor
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
            console.log(`✅ Entorno: ${process.env.NODE_ENV}`);
            console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
        });
    })
    .catch(err => {
        console.error('❌ Error sincronizando base de datos:', err);
    });