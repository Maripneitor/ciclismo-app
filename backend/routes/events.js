const express = require('express');
const router = express.Router();
const { Event, Category, TallaPlayera } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// CORREGIDO: Ruta principal con soporte para parámetros de consulta
router.get('/', async (req, res) => {
    try {
        console.log('📅 Obteniendo eventos desde la base de datos...');
        
        const { featured, limit, tipo, estado } = req.query;
        
        // Construir condiciones de búsqueda
        let whereConditions = {};
        let queryOptions = {
            order: [['fecha', 'ASC']]
        };

        // Filtrar por featured (eventos próximos)
        if (featured === 'true') {
            whereConditions.estado = 'próximo';
        }

        // Filtrar por tipo
        if (tipo) {
            whereConditions.tipo = tipo;
        }

        // Filtrar por estado
        if (estado) {
            whereConditions.estado = estado;
        }

        // Aplicar condiciones si existen
        if (Object.keys(whereConditions).length > 0) {
            queryOptions.where = whereConditions;
        }

        // Aplicar límite si se especifica
        if (limit) {
            queryOptions.limit = parseInt(limit);
        }

        const events = await Event.findAll(queryOptions);

        console.log(`✅ ${events.length} eventos encontrados`);
        res.json(events);
    } catch (error) {
        console.error('❌ Error obteniendo eventos:', error);
        res.status(500).json({
            message: 'Error obteniendo eventos',
            error: error.message
        });
    }
});

// NUEVA RUTA: Eventos destacados (alternativa)
router.get('/featured', async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        
        const events = await Event.findAll({
            where: {
                estado: 'próximo'
            },
            order: [['fecha', 'ASC']],
            limit: parseInt(limit)
        });

        console.log(`✅ ${events.length} eventos destacados encontrados`);
        res.json(events);
    } catch (error) {
        console.error('❌ Error obteniendo eventos destacados:', error);
        res.status(500).json({
            message: 'Error obteniendo eventos destacados',
            error: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(event);
    } catch (error) {
        console.error('❌ Error obteniendo evento:', error);
        res.status(500).json({
            message: 'Error obteniendo evento',
            error: error.message
        });
    }
});

router.post('/', auth, authorize('organization', 'admin'), async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organization_id: req.user.usuario_id
        };
        const event = await Event.create(eventData);
        res.status(201).json({
            message: 'Evento creado exitosamente',
            event
        });
    } catch (error) {
        console.error('❌ Error creando evento:', error);
        res.status(500).json({
            message: 'Error creando evento',
            error: error.message
        });
    }
});

router.put('/:id', auth, authorize('organization', 'admin'), async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        if (event.organization_id !== req.user.usuario_id && req.user.rol !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permisos para editar este evento'
            });
        }
        await event.update(req.body);
        res.json({
            message: 'Evento actualizado exitosamente',
            event
        });
    } catch (error) {
        console.error('❌ Error actualizando evento:', error);
        res.status(500).json({
            message: 'Error actualizando evento',
            error: error.message
        });
    }
});

router.delete('/:id', auth, authorize('organization', 'admin'), async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        if (event.organization_id !== req.user.usuario_id && req.user.rol !== 'admin') {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar este evento'
            });
        }
        await event.destroy();
        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.error('❌ Error eliminando evento:', error);
        res.status(500).json({
            message: 'Error eliminando evento',
            error: error.message
        });
    }
});

router.get('/:id/categories', async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { evento_id: req.params.id }
        });
        res.json(categories);
    } catch (error) {
        console.error('❌ Error obteniendo categorías:', error);
        res.status(500).json({
            message: 'Error obteniendo categorías',
            error: error.message
        });
    }
});

router.get('/tallas', async (req, res) => {
    try {
        const tallas = await TallaPlayera.findAll({
            order: [['nombre', 'ASC']]
        });
        res.json(tallas);
    } catch (error) {
        console.error('❌ Error obteniendo tallas:', error);
        res.status(500).json({
            message: 'Error obteniendo tallas',
            error: error.message
        });
    }
});

module.exports = router;