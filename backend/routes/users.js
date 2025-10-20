const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth, authorize } = require('../middleware/auth');

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

module.exports = router;