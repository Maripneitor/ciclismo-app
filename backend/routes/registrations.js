const express = require('express');
const router = express.Router();
const { Registration, Event, User, Team, TallaPlayera, Categoria } = require('../models');
const { auth } = require('../middleware/auth');

// POST /api/registrations - Inscribirse a un evento
router.post('/', auth, async (req, res) => {
    try {
        const { 
            eventId,
            categoria_id,
            talla_playera_id,
            equipo_id,
            numero_telefono,
            fecha_nacimiento,
            genero,
            nombre_contacto_emergencia,
            telefono_contacto_emergencia,
            url_identificacion
        } = req.body;
        
        const usuario_id = req.user.usuario_id;

        // Verificar si el evento existe
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Verificar si ya está inscrito
        const existingRegistration = await Registration.findOne({
            where: { usuario_id, evento_id: eventId }
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Ya estás inscrito en este evento' });
        }

        // Verificar cupos disponibles
        const inscritosCount = await Registration.count({ where: { evento_id: eventId } });
        if (event.cupo_maximo && inscritosCount >= event.cupo_maximo) {
            return res.status(400).json({ message: 'No hay cupos disponibles para este evento' });
        }

        // Generar número dorsal único para este evento
        const lastDorsal = await Registration.findOne({
            where: { evento_id: eventId },
            order: [['numero_dorsal', 'DESC']],
            attributes: ['numero_dorsal']
        });

        const numero_dorsal = lastDorsal ? lastDorsal.numero_dorsal + 1 : 1;
        
        // Generar alias del dorsal
        const user = await User.findByPk(usuario_id);
        const alias_dorsal = user.nombre ? user.nombre.substring(0, 3).toUpperCase() : 'USR';

        // Crear inscripción
        const registration = await Registration.create({
            usuario_id,
            evento_id: eventId,
            categoria_id,
            talla_playera_id,
            equipo_id,
            numero_dorsal,
            alias_dorsal,
            numero_telefono,
            fecha_nacimiento,
            genero,
            nombre_contacto_emergencia,
            telefono_contacto_emergencia,
            url_identificacion,
            fecha_inscripcion: new Date()
        });

        // Actualizar contador de participantes
        await Event.update(
            { participantes_inscritos: inscritosCount + 1 },
            { where: { evento_id: eventId } }
        );

        // Obtener la inscripción con datos relacionados
        const newRegistration = await Registration.findByPk(registration.inscripcion_id, {
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
                },
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['categoria_id', 'nombre']
                }
            ]
        });

        res.status(201).json({
            message: 'Inscripción exitosa',
            registration: newRegistration
        });
    } catch (error) {
        console.error('Error en inscripción:', error);
        res.status(500).json({
            message: 'Error en la inscripción',
            error: error.message
        });
    }
});

// GET /api/registrations - Obtener todas las inscripciones del usuario
router.get('/', auth, async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { usuario_id: req.user.usuario_id },
            include: [
                {
                    model: Event,
                    as: 'evento',
                    attributes: ['evento_id', 'nombre', 'fecha', 'ubicacion', 'estado', 'distancia_km', 'tipo']
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
                },
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['categoria_id', 'nombre']
                }
            ],
            order: [['fecha_inscripcion', 'DESC']]
        });

        res.json(registrations);
    } catch (error) {
        console.error('Error obteniendo inscripciones:', error);
        res.status(500).json({
            message: 'Error obteniendo inscripciones',
            error: error.message
        });
    }
});

// GET /api/registrations/my-registrations - Obtener inscripciones del usuario (alias)
router.get('/my-registrations', auth, async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            where: { usuario_id: req.user.usuario_id },
            include: [
                {
                    model: Event,
                    as: 'evento',
                    attributes: ['evento_id', 'nombre', 'fecha', 'ubicacion', 'estado', 'distancia_km', 'tipo']
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
                },
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['categoria_id', 'nombre']
                }
            ],
            order: [['fecha_inscripcion', 'DESC']]
        });

        res.json(registrations);
    } catch (error) {
        console.error('Error obteniendo inscripciones:', error);
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

// GET /api/registrations/categorias/:eventoId - Obtener categorías de un evento
router.get('/categorias/:eventoId', async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            where: { evento_id: req.params.eventoId },
            order: [['nombre', 'ASC']]
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({
            message: 'Error obteniendo categorías',
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

        const eventId = registration.evento_id;
        
        // Eliminar la inscripción
        await registration.destroy();

        // Actualizar contador de participantes
        const inscritosCount = await Registration.count({ where: { evento_id: eventId } });
        await Event.update(
            { participantes_inscritos: inscritosCount },
            { where: { evento_id: eventId } }
        );

        res.json({ message: 'Inscripción cancelada exitosamente' });
    } catch (error) {
        console.error('Error cancelando inscripción:', error);
        res.status(500).json({
            message: 'Error cancelando inscripción',
            error: error.message
        });
    }
});

module.exports = router;