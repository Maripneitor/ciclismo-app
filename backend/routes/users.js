const express = require('express');
const router = express.Router();
const { User, Event, Registration } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// Obtener perfil del usuario autenticado
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.usuario_id, {
            attributes: { exclude: ['contrasena'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo perfil',
            error: error.message
        });
    }
});

// Obtener todos los usuarios (solo admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['contrasena'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo usuarios',
            error: error.message
        });
    }
});

// Obtener eventos del usuario
router.get('/my-events', auth, async (req, res) => {
    try {
        const userWithEvents = await User.findByPk(req.user.usuario_id, {
            include: [{
                model: Event,
                through: { attributes: [] }
            }]
        });
        
        if (!userWithEvents) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(userWithEvents.Events || []);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo eventos del usuario',
            error: error.message
        });
    }
});

// Obtener inscripciones del usuario
router.get('/my-registrations', auth, async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { usuario_id: req.user.usuario_id },
            include: [Event]
        });
        
        res.json(registrations);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo inscripciones',
            error: error.message
        });
    }
});

// ... rutas existentes ...

// Rutas de datos del ciclista
router.put('/cyclist-data', auth, userController.updateCyclistData);
router.get('/cyclist-data', auth, userController.getCyclistData);

module.exports = router;