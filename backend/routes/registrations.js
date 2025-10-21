const express = require('express');
const router = express.Router();
const { Registration, Event, User, Team, TallaPlayera } = require('../models');
const { auth } = require('../middleware/auth');

// GET /api/registrations - Obtener todas las inscripciones del usuario
router.get('/', auth, async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { usuario_id: req.user.usuario_id },
            include: [
                {
                    model: Event,
                    as: 'evento',
                    attributes: ['evento_id', 'nombre', 'fecha', 'ubicacion', 'estado']
                },
                {
                    model: Team,
                    as: 'equipo',
                    attributes: ['equipo_id', 'nombre']
                },
                {
                    model: TallaPlayera,
                    as: 'talla',
                    attributes: ['talla_playera_id', 'nombre']
                }
            ],
            order: [['fecha_inscripcion', 'DESC']]
        });

        res.json(registrations);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo inscripciones',
            error: error.message
        });
    }
});

// GET /api/registrations/tallas - Obtener tallas de playera disponibles
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

// DELETE /api/registrations/:id - Cancelar inscripción
router.delete('/:id', auth, async (req, res) => {
    try {
        const registration = await Registration.findOne({
            where: {
                inscripcion_id: req.params.id,
                usuario_id: req.user.usuario_id
            }
        });

        if (!registration) {
            return res.status(404).json({ message: 'Inscripción no encontrada' });
        }

        await registration.destroy();
        res.json({ message: 'Inscripción cancelada exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error cancelando inscripción',
            error: error.message
        });
    }
});

module.exports = router;