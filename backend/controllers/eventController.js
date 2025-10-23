const { Event, Category, Registration, User, Route, sequelize } = require('../models');

const eventController = {
    getAll: async (req, res) => {
        try {
            const events = await Event.findAll({
                include: [
                    {
                        model: User,
                        as: 'organizador',
                        attributes: ['usuario_id', 'nombre_completo']
                    }
                ],
                order: [['fecha', 'ASC']]
            });
            res.json(events);
        } catch (error) {
            console.error('Error obteniendo eventos:', error);
            res.status(500).json({
                message: 'Error obteniendo eventos',
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'organizador',
                        attributes: ['usuario_id', 'nombre_completo']
                    },
                    {
                        model: Category,
                        as: 'categorias'
                    },
                    {
                        model: Route,
                        as: 'rutas'
                    }
                ]
            });

            if (!event) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            res.json(event);
        } catch (error) {
            console.error('Error obteniendo evento:', error);
            res.status(500).json({
                message: 'Error obteniendo evento',
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const eventData = {
                ...req.body,
                organizador_id: req.user.usuario_id
            };

            const event = await Event.create(eventData);
            res.status(201).json({
                message: 'Evento creado exitosamente',
                event
            });
        } catch (error) {
            console.error('Error creando evento:', error);
            res.status(500).json({
                message: 'Error creando evento',
                error: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            if (event.organizador_id !== req.user.usuario_id && req.user.rol !== 'admin') {
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
            console.error('Error actualizando evento:', error);
            res.status(500).json({
                message: 'Error actualizando evento',
                error: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Evento no encontrado' });
            }

            if (event.organizador_id !== req.user.usuario_id && req.user.rol !== 'admin') {
                return res.status(403).json({
                    message: 'No tienes permisos para eliminar este evento'
                });
            }

            await event.destroy();
            res.json({ message: 'Evento eliminado exitosamente' });
        } catch (error) {
            console.error('Error eliminando evento:', error);
            res.status(500).json({
                message: 'Error eliminando evento',
                error: error.message
            });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await Category.findAll({
                where: { evento_id: req.params.eventId }
            });
            res.json(categories);
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            res.status(500).json({
                message: 'Error obteniendo categorías',
                error: error.message
            });
        }
    },

    registerToEvent: async (req, res) => {
        try {
            const { evento_id, categoria_id, talla_playera_id, equipo_id, ...registrationData } = req.body;
            
            const existingRegistration = await Registration.findOne({
                where: {
                    usuario_id: req.user.usuario_id,
                    evento_id: evento_id
                }
            });

            if (existingRegistration) {
                return res.status(400).json({
                    message: 'Ya estás inscrito en este evento'
                });
            }

            const lastDorsal = await Registration.findOne({
                where: { evento_id },
                order: [['numero_dorsal', 'DESC']],
                attributes: ['numero_dorsal']
            });

            const nuevoDorsal = lastDorsal ? lastDorsal.numero_dorsal + 1 : 1;

            const registration = await Registration.create({
                ...registrationData,
                usuario_id: req.user.usuario_id,
                evento_id,
                categoria_id,
                talla_playera_id,
                equipo_id: equipo_id || null,
                numero_dorsal: nuevoDorsal,
                alias_dorsal: req.user.nombre_completo.substring(0, 3).toUpperCase(),
                fecha_inscripcion: new Date()
            });

            res.status(201).json({
                message: 'Inscripción exitosa',
                registration
            });
        } catch (error) {
            console.error('Error en inscripción:', error);
            res.status(500).json({
                message: 'Error en la inscripción',
                error: error.message
            });
        }
    },

    getOrganizerEvents: async (req, res) => {
        try {
            const events = await Event.findAll({
                where: { organizador_id: req.user.usuario_id },
                include: [
                    {
                        model: Registration,
                        as: 'inscripciones',
                        attributes: ['inscripcion_id']
                    }
                ],
                order: [['fecha', 'DESC']]
            });

            const eventsWithCount = events.map(event => ({
                ...event.toJSON(),
                inscritos: event.inscripciones ? event.inscripciones.length : 0
            }));

            res.json(eventsWithCount);
        } catch (error) {
            console.error('Error obteniendo eventos del organizador:', error);
            res.status(500).json({
                message: 'Error obteniendo eventos',
                error: error.message
            });
        }
    }
};

module.exports = eventController;