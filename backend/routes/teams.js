const express = require('express');
const router = express.Router();
const { Team, User, TeamMember } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// GET /api/teams - Obtener todos los equipos
router.get('/', async (req, res) => {
    try {
        const teams = await Team.findAll({
            include: [
                {
                    model: User,
                    as: 'capitan',
                    attributes: ['usuario_id', 'nombre_completo']
                },
                {
                    model: User,
                    as: 'miembros',
                    attributes: ['usuario_id', 'nombre_completo']
                }
            ]
        });
        res.json(teams);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo equipos',
            error: error.message
        });
    }
});

// GET /api/teams/my-teams - Obtener equipos del usuario
router.get('/my-teams', auth, async (req, res) => {
    try {
        const userWithTeams = await User.findByPk(req.user.usuario_id, {
            include: [
                {
                    model: Team,
                    as: 'equipos',
                    through: { attributes: [] },
                    include: [
                        {
                            model: User,
                            as: 'capitan',
                            attributes: ['usuario_id', 'nombre_completo']
                        }
                    ]
                }
            ]
        });

        const teams = userWithTeams ? userWithTeams.equipos : [];
        
        // Formatear respuesta
        const formattedTeams = teams.map(team => ({
            equipo_id: team.equipo_id,
            nombre: team.nombre,
            capitan_nombre: team.capitan?.nombre_completo || 'No disponible',
            fecha_creacion: team.fecha_creacion,
            miembros_count: team.miembros ? team.miembros.length : 0,
            enlace_invitacion: team.enlace_invitacion
        }));

        res.json(formattedTeams);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo equipos',
            error: error.message
        });
    }
});

// POST /api/teams - Crear nuevo equipo
router.post('/', auth, async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Generar enlace de invitación único
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const team = await Team.create({
            nombre,
            descripcion,
            capitan_usuario_id: req.user.usuario_id,
            enlace_invitacion: inviteCode
        });

        // Agregar al capitán como miembro
        await TeamMember.create({
            usuario_id: req.user.usuario_id,
            equipo_id: team.equipo_id
        });

        res.status(201).json({
            message: 'Equipo creado exitosamente',
            team
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creando equipo',
            error: error.message
        });
    }
});

// POST /api/teams/join - Unirse a equipo con código
router.post('/join', auth, async (req, res) => {
    try {
        const { inviteCode } = req.body;

        const team = await Team.findOne({
            where: { enlace_invitacion: inviteCode }
        });

        if (!team) {
            return res.status(404).json({ message: 'Código de invitación inválido' });
        }

        // Verificar si ya es miembro
        const existingMember = await TeamMember.findOne({
            where: {
                usuario_id: req.user.usuario_id,
                equipo_id: team.equipo_id
            }
        });

        if (existingMember) {
            return res.status(400).json({ message: 'Ya eres miembro de este equipo' });
        }

        // Agregar como miembro
        await TeamMember.create({
            usuario_id: req.user.usuario_id,
            equipo_id: team.equipo_id
        });

        res.json({
            message: 'Te has unido al equipo exitosamente',
            team: {
                equipo_id: team.equipo_id,
                nombre: team.nombre
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error uniéndote al equipo',
            error: error.message
        });
    }
});

// GET /api/teams/:id - Obtener equipo específico
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'capitan',
                    attributes: ['usuario_id', 'nombre_completo']
                },
                {
                    model: User,
                    as: 'miembros',
                    attributes: ['usuario_id', 'nombre_completo', 'email']
                }
            ]
        });

        if (!team) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo equipo',
            error: error.message
        });
    }
});

module.exports = router;