const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
  register: async (req, res) => {
    try {
      const { nombre, email, password, telefono, role = 'usuario' } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Crear usuario
      const user = await User.create({
        nombre,
        email,
        password,
        telefono,
        role
      });

      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error en el registro', 
        error: error.message 
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isValidPassword = await user.validPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error en el login', 
        error: error.message 
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error al obtener perfil', 
        error: error.message 
      });
    }
  }
};

module.exports = authController;