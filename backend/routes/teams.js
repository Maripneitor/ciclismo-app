const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { auth } = require('../middleware/auth');

// GET /api/teams - Obtener todos los equipos
router.get('/', teamController.getAll);

// GET /api/teams/my-teams - Obtener equipos del usuario
router.get('/my-teams', auth, teamController.getMyTeams);

// POST /api/teams - Crear nuevo equipo
router.post('/', auth, teamController.create);

// POST /api/teams/join - Unirse a equipo con código
router.post('/join', auth, teamController.join);

// GET /api/teams/:id - Obtener equipo específico
router.get('/:id', teamController.getById);

// GET /api/teams/:id/invite - Obtener información de invitación (QR)
router.get('/:id/invite', auth, teamController.getInviteInfo);

// DELETE /api/teams/:id/leave - Abandonar equipo
router.delete('/:id/leave', auth, teamController.leave);

// DELETE /api/teams/:id - Eliminar equipo (solo capitán/admin)
router.delete('/:id', auth, teamController.delete);

module.exports = router;