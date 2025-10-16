const express = require('express');
const router = express.Router();
const { User, Event, Registration, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// GET /api/queries/stats - Estadísticas generales
router.get('/stats', async (req, res) => {
  try {
    const stats = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM "Users") as total_usuarios,
        (SELECT COUNT(*) FROM "Events") as total_eventos,
        (SELECT COUNT(*) FROM "Registrations") as total_inscripciones,
        (SELECT COUNT(*) FROM "Users" WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM "Users" WHERE role = 'organizador') as total_organizadores
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/queries/users-stats - Estadísticas de usuarios
router.get('/users-stats', auth, authorize('admin'), async (req, res) => {
  try {
    const userStats = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'ultimo_registro']
      ],
      group: ['role']
    });

    const growth = await sequelize.query(`
      SELECT 
        DATE("createdAt") as fecha,
        COUNT(*) as registros
      FROM "Users"
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY fecha
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      por_rol: userStats,
      crecimiento: growth
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/queries/events-stats - Estadísticas de eventos
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
    res.status(500).json({ error: error.message });
  }
});

// GET /api/queries/top-organizadores - Top organizadores
router.get('/top-organizadores', async (req, res) => {
  try {
    const topOrganizadores = await sequelize.query(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        COUNT(e.id) as total_eventos,
        SUM(e.maxParticipantes) as capacidad_total,
        AVG(e.precio) as precio_promedio
      FROM "Users" u
      LEFT JOIN "Events" e ON u.id = e."organizadorId"
      WHERE u.role IN ('organizador', 'admin')
      GROUP BY u.id, u.nombre, u.email
      ORDER BY total_eventos DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    res.json(topOrganizadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/queries/event-details/:id - Detalles completos de un evento
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;