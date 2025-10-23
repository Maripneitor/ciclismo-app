const express = require('express');
const router = express.Router();
const { User, Event, Registration } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');

// Obtener perfil del usuario autenticado
router.get('/profile', auth, userController.getProfile);

// Actualizar perfil del usuario autenticado
router.put('/profile', auth, userController.updateProfile);

// Subir imagen de perfil
router.post('/profile/picture', auth, upload.single('profileImage'), userController.updateProfilePicture);

// Obtener todos los usuarios (solo admin)
router.get('/', auth, authorize('admin'), userController.getAllUsers);

// Actualizar usuario (solo admin)
router.put('/:id', auth, authorize('admin'), userController.updateUser);

// Eliminar usuario (solo admin)
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);

// Obtener eventos del usuario
router.get('/my-events', auth, userController.getUserEvents);

// Obtener inscripciones del usuario
router.get('/my-registrations', auth, userController.getUserRegistrations);

// Rutas de datos del ciclista
router.put('/cyclist-data', auth, userController.updateCyclistData);
router.get('/cyclist-data', auth, userController.getCyclistData);

module.exports = router;