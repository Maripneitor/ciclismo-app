const { Team, User, TeamMember, Registration } = require('../models');
const { Op } = require('sequelize');

const teamController = {
    // Crear nuevo equipo
    create: async (req, res) => {
        try {
            const { nombre, descripcion, tipo = 'recreativo' } = req.body;

            // Verificar si el usuario puede crear equipos
            const user = await User.findByPk(req.user.usuario_id);
            if (!user.puede_crear_equipo && req.user.rol !== 'admin') {
                return res.status(403).json({
                    message: 'No tienes permisos para crear equipos'
                });
            }

            // Verificar si ya existe un equipo con ese nombre
            const existingTeam = await Team.findOne({ where: { nombre } });
            if (existingTeam) {
                return res.status(400).json({
                    message: 'Ya existe un equipo con ese nombre'
                });
            }

            // Generar código de invitación único
            let inviteCode;
            let isUnique = false;
            
            while (!isUnique) {
                inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const existingCode = await Team.findOne({ where: { enlace_invitacion: inviteCode } });
                if (!existingCode) {
                    isUnique = true;
                }
            }

            // Crear equipo
            const team = await Team.create({
                nombre,
                descripcion,
                tipo,
                capitan_usuario_id: req.user.usuario_id,
                enlace_invitacion: inviteCode,
                fecha_creacion: new Date()
            });

            // Agregar al capitán como miembro
            await TeamMember.create({
                usuario_id: req.user.usuario_id,
                equipo_id: team.equipo_id
            });

            // Obtener equipo con datos del capitán
            const newTeam = await Team.findByPk(team.equipo_id, {
                include: [
                    {
                        model: User,
                        as: 'capitan',
                        attributes: ['usuario_id', 'nombre_completo', 'email']
                    }
                ]
            });

            res.status(201).json({
                message: 'Equipo creado exitosamente',
                team: newTeam,
                inviteCode: inviteCode,
                inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/teams/join?code=${inviteCode}`
            });

        } catch (error) {
            console.error('Error creando equipo:', error);
            res.status(500).json({
                message: 'Error creando equipo',
                error: error.message
            });
        }
    },

    // Unirse a equipo con código
    join: async (req, res) => {
        try {
            const { codigo_invitacion } = req.body;

            // Buscar equipo por código
            const team = await Team.findOne({
                where: { enlace_invitacion: codigo_invitacion },
                include: [
                    {
                        model: User,
                        as: 'capitan',
                        attributes: ['usuario_id', 'nombre_completo']
                    }
                ]
            });

            if (!team) {
                return res.status(404).json({ 
                    message: 'Código de invitación inválido o equipo no encontrado' 
                });
            }

            // Verificar si ya es miembro
            const existingMember = await TeamMember.findOne({
                where: {
                    usuario_id: req.user.usuario_id,
                    equipo_id: team.equipo_id
                }
            });

            if (existingMember) {
                return res.status(400).json({ 
                    message: 'Ya eres miembro de este equipo' 
                });
            }

            // Verificar si el usuario es el capitán
            if (team.capitan_usuario_id === req.user.usuario_id) {
                return res.status(400).json({
                    message: 'Eres el capitán de este equipo'
                });
            }

            // Agregar como miembro
            await TeamMember.create({
                usuario_id: req.user.usuario_id,
                equipo_id: team.equipo_id,
                fecha_union: new Date()
            });

            // Obtener información actualizada del equipo
            const updatedTeam = await Team.findByPk(team.equipo_id, {
                include: [
                    {
                        model: User,
                        as: 'capitan',
                        attributes: ['usuario_id', 'nombre_completo']
                    },
                    {
                        model: User,
                        as: 'miembros',
                        attributes: ['usuario_id', 'nombre_completo', 'email'],
                        through: { attributes: [] }
                    }
                ]
            });

            res.json({
                message: 'Te has unido al equipo exitosamente',
                team: updatedTeam
            });

        } catch (error) {
            console.error('Error uniéndose al equipo:', error);
            res.status(500).json({
                message: 'Error uniéndose al equipo',
                error: error.message
            });
        }
    },

    // Obtener equipos del usuario
    getMyTeams: async (req, res) => {
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
                                attributes: ['usuario_id', 'nombre_completo', 'email']
                            },
                            {
                                model: User,
                                as: 'miembros',
                                attributes: ['usuario_id'],
                                through: { attributes: [] }
                            }
                        ]
                    }
                ]
            });

            if (!userWithTeams) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Formatear respuesta
            const formattedTeams = userWithTeams.equipos.map(team => ({
                equipo_id: team.equipo_id,
                nombre: team.nombre,
                descripcion: team.descripcion,
                tipo: team.tipo,
                capitan: {
                    usuario_id: team.capitan.usuario_id,
                    nombre_completo: team.capitan.nombre_completo
                },
                enlace_invitacion: team.enlace_invitacion,
                fecha_creacion: team.fecha_creacion,
                cantidad_miembros: team.miembros ? team.miembros.length : 0,
                es_capitan: team.capitan_usuario_id === req.user.usuario_id
            }));

            res.json(formattedTeams);

        } catch (error) {
            console.error('Error obteniendo equipos:', error);
            res.status(500).json({
                message: 'Error obteniendo equipos',
                error: error.message
            });
        }
    },

    // Obtener todos los equipos
    getAll: async (req, res) => {
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
                        attributes: ['usuario_id', 'nombre_completo'],
                        through: { attributes: [] }
                    }
                ],
                order: [['fecha_creacion', 'DESC']]
            });

            res.json(teams);
        } catch (error) {
            console.error('Error obteniendo equipos:', error);
            res.status(500).json({
                message: 'Error obteniendo equipos',
                error: error.message
            });
        }
    },

    // Obtener equipo específico
    getById: async (req, res) => {
        try {
            const team = await Team.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'capitan',
                        attributes: ['usuario_id', 'nombre_completo', 'email']
                    },
                    {
                        model: User,
                        as: 'miembros',
                        attributes: ['usuario_id', 'nombre_completo', 'email'],
                        through: { attributes: ['fecha_union'] }
                    }
                ]
            });

            if (!team) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }

            res.json(team);
        } catch (error) {
            console.error('Error obteniendo equipo:', error);
            res.status(500).json({
                message: 'Error obteniendo equipo',
                error: error.message
            });
        }
    },

    // Abandonar equipo
    leave: async (req, res) => {
        try {
            const { id } = req.params;

            const team = await Team.findByPk(id);
            if (!team) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }

            // Verificar si es el capitán
            if (team.capitan_usuario_id === req.user.usuario_id) {
                return res.status(400).json({
                    message: 'El capitán no puede abandonar el equipo. Debe transferir el liderazgo o eliminar el equipo.'
                });
            }

            // Verificar si es miembro
            const member = await TeamMember.findOne({
                where: {
                    usuario_id: req.user.usuario_id,
                    equipo_id: id
                }
            });

            if (!member) {
                return res.status(400).json({
                    message: 'No eres miembro de este equipo'
                });
            }

            // Eliminar miembro
            await member.destroy();

            res.json({ message: 'Has abandonado el equipo exitosamente' });

        } catch (error) {
            console.error('Error abandonando equipo:', error);
            res.status(500).json({
                message: 'Error abandonando equipo',
                error: error.message
            });
        }
    },

    // Eliminar equipo (solo capitán)
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const team = await Team.findByPk(id);
            if (!team) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }

            // Verificar permisos
            if (team.capitan_usuario_id !== req.user.usuario_id && req.user.rol !== 'admin') {
                return res.status(403).json({
                    message: 'Solo el capitán puede eliminar el equipo'
                });
            }

            // Eliminar equipo (las relaciones se eliminarán en cascada)
            await team.destroy();

            res.json({ message: 'Equipo eliminado exitosamente' });

        } catch (error) {
            console.error('Error eliminando equipo:', error);
            res.status(500).json({
                message: 'Error eliminando equipo',
                error: error.message
            });
        }
    },

    // Obtener código QR del equipo
    getInviteInfo: async (req, res) => {
        try {
            const { id } = req.params;

            const team = await Team.findByPk(id, {
                attributes: ['equipo_id', 'nombre', 'enlace_invitacion']
            });

            if (!team) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }

            // Verificar si el usuario es miembro
            const isMember = await TeamMember.findOne({
                where: {
                    usuario_id: req.user.usuario_id,
                    equipo_id: id
                }
            });

            if (!isMember && req.user.rol !== 'admin') {
                return res.status(403).json({
                    message: 'No tienes acceso a este equipo'
                });
            }

            const inviteData = {
                equipo_id: team.equipo_id,
                nombre: team.nombre,
                codigo_invitacion: team.enlace_invitacion,
                enlace_invitacion: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/teams/join?code=${team.enlace_invitacion}`,
                qr_data: `EQUIPO:${team.equipo_id}|CODIGO:${team.enlace_invitacion}`
            };

            res.json(inviteData);

        } catch (error) {
            console.error('Error obteniendo información de invitación:', error);
            res.status(500).json({
                message: 'Error obteniendo información de invitación',
                error: error.message
            });
        }
    }
};

module.exports = teamController;