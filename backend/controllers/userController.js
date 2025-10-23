const { User, Registration, Event, Team, Resultado, CyclistData } = require('../models');

const userController = {
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.usuario_id, {
                attributes: { exclude: ['contrasena'] }
            });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({
                message: 'Error al obtener perfil',
                error: error.message
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.usuario_id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const { rol, ...updateData } = req.body;
            
            await user.update(updateData);
            
            const updatedUser = await User.findByPk(req.user.usuario_id, {
                attributes: { exclude: ['contrasena'] }
            });

            res.json({
                message: 'Perfil actualizado exitosamente',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            res.status(500).json({
                message: 'Error al actualizar perfil',
                error: error.message
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['contrasena'] },
                order: [['fecha_creacion', 'DESC']]
            });
            res.json(users);
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            res.status(500).json({
                message: 'Error obteniendo usuarios',
                error: error.message
            });
        }
    },

    getUserEvents: async (req, res) => {
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
                    }
                ],
                order: [['fecha_inscripcion', 'DESC']]
            });

            res.json(registrations);
        } catch (error) {
            console.error('Error obteniendo eventos del usuario:', error);
            res.status(500).json({
                message: 'Error obteniendo eventos',
                error: error.message
            });
        }
    },

    getUserRegistrations: async (req, res) => {
        try {
            const registrations = await Registration.findAll({
                where: { usuario_id: req.user.usuario_id },
                include: [
                    {
                        model: Event,
                        as: 'evento',
                        attributes: ['evento_id', 'nombre', 'fecha', 'ubicacion']
                    },
                    {
                        model: Team,
                        as: 'equipo',
                        attributes: ['equipo_id', 'nombre']
                    }
                ],
                order: [['fecha_inscripcion', 'DESC']]
            });

            const formattedRegistrations = registrations.map(reg => ({
                inscripcion_id: reg.inscripcion_id,
                evento_nombre: reg.evento?.nombre || 'Evento no disponible',
                fecha_inscripcion: reg.fecha_inscripcion,
                estado: 'Confirmada',
                categoria_nombre: 'General',
                numero_dorsal: reg.numero_dorsal,
                equipo_nombre: reg.equipo?.nombre || null
            }));

            res.json(formattedRegistrations);
        } catch (error) {
            console.error('Error obteniendo inscripciones:', error);
            res.status(500).json({
                message: 'Error al obtener inscripciones',
                error: error.message
            });
        }
    },

    getUserResults: async (req, res) => {
        try {
            const results = await Resultado.findAll({
                where: { usuario_id: req.user.usuario_id },
                include: [
                    {
                        model: Event,
                        as: 'evento',
                        attributes: ['evento_id', 'nombre', 'fecha']
                    }
                ],
                order: [['fecha_registro', 'DESC']]
            });

            res.json(results);
        } catch (error) {
            console.error('Error obteniendo resultados:', error);
            res.status(500).json({
                message: 'Error al obtener resultados',
                error: error.message
            });
        }
    },

    updateCyclistData: async (req, res) => {
        try {
            const userId = req.user.usuario_id;
            const cyclistData = req.body;

            const [updatedData, created] = await CyclistData.upsert({
                ...cyclistData,
                usuario_id: userId
            });

            res.json({
                message: created ? 'Datos del ciclista creados exitosamente' : 'Datos del ciclista actualizados exitosamente',
                data: updatedData
            });

        } catch (error) {
            console.error('Error actualizando datos del ciclista:', error);
            res.status(500).json({
                message: 'Error actualizando datos del ciclista',
                error: error.message
            });
        }
    },

    getCyclistData: async (req, res) => {
        try {
            const cyclistData = await CyclistData.findOne({
                where: { usuario_id: req.user.usuario_id }
            });

            if (!cyclistData) {
                return res.status(404).json({ message: 'Datos del ciclista no encontrados' });
            }

            res.json(cyclistData);
        } catch (error) {
            console.error('Error obteniendo datos del ciclista:', error);
            res.status(500).json({
                message: 'Error obteniendo datos del ciclista',
                error: error.message
            });
        }
    }
};

module.exports = userController;