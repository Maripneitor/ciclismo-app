const express = require('express');
const router = express.Router();
const { User, Event, Registration, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');

router.get('/stats', async (req, res) => {
  try {
    console.log('🔍 Ejecutando consulta de estadísticas...');
    
    // CORREGIDO: Usar nombres correctos de tablas (en minúsculas)
    const stats = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM eventos) as total_eventos,
        (SELECT COUNT(*) FROM inscripciones) as total_inscripciones,
        (SELECT COUNT(*) FROM usuarios WHERE rol = 'admin') as total_admins,
        (SELECT COUNT(*) FROM usuarios WHERE rol = 'organizador') as total_organizadores
    `, { type: sequelize.QueryTypes.SELECT });

    console.log('✅ Estadísticas obtenidas:', stats[0]);
    res.json(stats[0]);
  } catch (error) {
    console.error('❌ Error en consulta de estadísticas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

router.get('/users-stats', auth, authorize('admin'), async (req, res) => {
  try {
    const userStats = await User.findAll({
      attributes: [
        'rol',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'ultimo_registro']
      ],
      group: ['rol']
    });

    // CORREGIDO: Usar nombres correctos de tabla y columna
    const growth = await sequelize.query(`
      SELECT 
        DATE("createdAt") as fecha,
        COUNT(*) as registros
      FROM usuarios
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY fecha
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      por_rol: userStats,
      crecimiento: growth
    });
  } catch (error) {
    console.error('❌ Error en users-stats:', error);
    res.status(500).json({ 
      error: 'Error obteniendo estadísticas de usuarios',
      details: error.message 
    });
  }
});

router.get('/events-stats', async (req, res) => {
  try {
    const eventStats = await Event.findAll({
      attributes: [
        'tipo',
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('AVG', sequelize.col('distancia')), 'distancia_promedio'],
        [sequelize.fn('MAX', sequelize.col('precio')), 'precio_maximo'],
        [sequelize.fn('SUM', sequelize.col('maxParticipantes')), 'capacidad_total']
      ],
      group: ['tipo', 'estado']
    });

    const proximosEventos = await Event.findAll({
      where: {
        fecha: {
          [sequelize.Op.gt]: new Date()
        }
      },
      order: [['fecha', 'ASC']],
      limit: 10
    });

    res.json({
      estadisticas: eventStats,
      proximos_eventos: proximosEventos
    });
  } catch (error) {
    console.error('❌ Error en events-stats:', error);
    res.status(500).json({ 
      error: 'Error obteniendo estadísticas de eventos',
      details: error.message 
    });
  }
});

router.get('/top-organizadores', async (req, res) => {
  try {
    // CORREGIDO: Usar nombres correctos de tablas y columnas
    const topOrganizadores = await sequelize.query(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        COUNT(e.id) as total_eventos,
        SUM(e.maxParticipantes) as capacidad_total,
        AVG(e.precio) as precio_promedio
      FROM usuarios u
      LEFT JOIN eventos e ON u.id = e.organization_id
      WHERE u.rol IN ('organizador', 'admin')
      GROUP BY u.id, u.nombre, u.email
      ORDER BY total_eventos DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(topOrganizadores);
  } catch (error) {
    console.error('❌ Error en top-organizadores:', error);
    res.status(500).json({ 
      error: 'Error obteniendo top organizadores',
      details: error.message 
    });
  }
});

router.get('/event-details/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const eventDetails = await Event.findByPk(eventId, {
      include: [
        {
          model: User,
          as: 'organizador',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: User,
          as: 'participantes',
          through: { attributes: ['estado', 'fechaInscripcion'] },
          attributes: ['id', 'nombre', 'email']
        }
      ]
    });

    if (!eventDetails) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json(eventDetails);
  } catch (error) {
    console.error('❌ Error en event-details:', error);
    res.status(500).json({ 
      error: 'Error obteniendo detalles del evento',
      details: error.message 
    });
  }
});

// Ruta de prueba para verificar nombres de tablas
router.get('/debug-tables', async (req, res) => {
  try {
    const tableInfo = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({ tables: tableInfo });
  } catch (error) {
    console.error('❌ Error en debug-tables:', error);
    res.status(500).json({ 
      error: 'Error obteniendo información de tablas',
      details: error.message 
    });
  }
});

module.exports = router;