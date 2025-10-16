const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// GET /api/events - Obtener todos los eventos (público)
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

// GET /api/events/:id - Obtener un evento específico
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

// POST /api/events - Crear nuevo evento (solo organizadores y admin)
router.post('/', auth, authorize('organizador', 'admin'), async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizadorId: req.user.id
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

// PUT /api/events/:id - Actualizar evento
router.put('/:id', auth, authorize('organizador', 'admin'), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar que el usuario es el organizador o admin
    if (event.organizadorId !== req.user.id && req.user.role !== 'admin') {
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

// DELETE /api/events/:id - Eliminar evento
router.delete('/:id', auth, authorize('organizador', 'admin'), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar que el usuario es el organizador o admin
    if (event.organizadorId !== req.user.id && req.user.role !== 'admin') {
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

module.exports = router;