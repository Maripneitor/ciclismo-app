const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
    register: async (req, res) => {
        try {
            console.log('Registro - Datos recibidos:', req.body);
            const { nombre_completo, email, contrasena, rol = 'usuario' } = req.body;

            if (!nombre_completo || !email || !contrasena) {
                return res.status(400).json({
                    message: 'Todos los campos son requeridos: nombre_completo, email, contrasena'
                });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            const user = await User.create({
                nombre_completo,
                email,
                contrasena,
                rol
            });

            console.log('Usuario creado:', user.usuario_id);

            const token = jwt.sign(
                {
                    usuario_id: user.usuario_id,
                    email: user.email,
                    rol: user.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    usuario_id: user.usuario_id,
                    nombre_completo: user.nombre_completo,
                    email: user.email,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                message: 'Error en el registro',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            console.log('LOGIN ATTEMPT - Datos recibidos:', req.body);
            const { email, contrasena } = req.body;

            if (!email || !contrasena) {
                console.log('Login: Faltan campos');
                return res.status(400).json({
                    message: 'Email y contraseña son requeridos'
                });
            }

            console.log('Buscando usuario:', email);

            const user = await User.findOne({ where: { email } });
            console.log('Usuario encontrado:', user ? `Si (ID: ${user.usuario_id})` : 'NO');

            if (!user) {
                console.log('Login: Usuario no encontrado');
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            console.log('Verificando contraseña...');
            const isValidPassword = await user.validPassword(contrasena);
            console.log('Contraseña válida:', isValidPassword);

            if (!isValidPassword) {
                console.log('Login: Contraseña incorrecta');
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            console.log('Generando token JWT...');
            const token = jwt.sign(
                {
                    usuario_id: user.usuario_id,
                    email: user.email,
                    rol: user.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('LOGIN EXITOSO - Usuario:', user.usuario_id);

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    usuario_id: user.usuario_id,
                    nombre_completo: user.nombre_completo,
                    email: user.email,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error('ERROR EN LOGIN:', error);
            console.error('Stack:', error.stack);
            res.status(500).json({
                message: 'Error en el login',
                error: error.message
            });
        }
    },

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
    }
};

module.exports = authController;