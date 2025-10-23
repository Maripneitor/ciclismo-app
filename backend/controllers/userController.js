const { User, Registration, Event, Team, Resultado, CyclistData } = require('../models');
const path = require('path');
const fs = require('fs');

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

    updateProfilePicture: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
            }

            const user = await User.findByPk(req.user.usuario_id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (user.profileImageUrl && user.profileImageUrl.includes('/uploads/')) {
                const oldFilename = path.basename(user.profileImageUrl);
                const oldPath = path.join(__dirname, '../uploads/profile-pictures', oldFilename);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const profileImageUrl = `/uploads/profile-pictures/${req.file.filename}`;

            await user.update({ profileImageUrl });

            const updatedUser = await User.findByPk(req.user.usuario_id, {
                attributes: { exclude: ['contrasena'] }
            });

            res.json({
                message: 'Imagen de perfil actualizada exitosamente',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error actualizando imagen de perfil:', error);
            res.status(500).json({
                message: 'Error al actualizar imagen de perfil',
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

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre_completo, email, telefono, rol, puede_crear_equipo } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (id === req.user.usuario_id.toString() && rol !== 'admin') {
                return res.status(400).json({ 
                    message: 'No puedes cambiar tu propio rol de administrador' 
                });
            }

            await user.update({
                nombre_completo,
                email,
                telefono,
                rol,
                puede_crear_equipo
            });

            const updatedUser = await User.findByPk(id, {
                attributes: { exclude: ['contrasena'] }
            });

            res.json({
                message: 'Usuario actualizado exitosamente',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            res.status(500).json({
                message: 'Error actualizando usuario',
                error: error.message
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            if (id === req.user.usuario_id.toString()) {
                return res.status(400).json({ 
                    message: 'No puedes eliminar tu propia cuenta' 
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (user.profileImageUrl && user.profileImageUrl.includes('/uploads/')) {
                const filename = path.basename(user.profileImageUrl);
                const filePath = path.join(__dirname, '../uploads/profile-pictures', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await user.destroy();

            res.json({ message: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            res.status(500).json({
                message: 'Error eliminando usuario',
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