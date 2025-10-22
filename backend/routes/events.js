const express = require('express');
const router = express.Router();
const { Event, Category, TallaPlayera } = require('../models');
const { auth, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll({
            order: [['fecha', 'ASC']]
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo eventos',
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
        res.status(500).json({
            message: 'Error obteniendo tallas',
            error: error.message
        });
    }
});

module.exports = router;