const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const authController = {
    register: async (req, res) => {
        try {
            console.log('📝 Registro - Datos recibidos:', req.body);
            const { nombre_completo, email, contrasena, rol = 'usuario' } = req.body;

            // Validar campos requeridos
            if (!nombre_completo || !email || !contrasena) {
                return res.status(400).json({
                    message: 'Todos los campos son requeridos: nombre_completo, email, contrasena'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            // Crear usuario
            const user = await User.create({
                nombre_completo,
                email,
                contrasena,
                rol
            });

            console.log('✅ Usuario creado:', user.usuario_id);

            // Generar token
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
            console.error('❌ Error en registro:', error);
            res.status(500).json({
                message: 'Error en el registro',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            console.log('🔐 LOGIN ATTEMPT - Datos recibidos:', req.body);
            const { email, contrasena } = req.body;

            // Validar campos
            if (!email || !contrasena) {
                console.log('❌ Login: Faltan campos');
                return res.status(400).json({
                    message: 'Email y contraseña son requeridos'
                });
            }

            console.log('🔍 Buscando usuario:', email);

            // Buscar usuario INCLUYENDO la contraseña
            const user = await User.findOne({ 
                where: { email },
                attributes: { include: ['contrasena'] }
            });
            
            console.log('👤 Usuario encontrado:', user ? `Si (ID: ${user.usuario_id})` : 'NO');

            if (!user) {
                console.log('❌ Login: Usuario no encontrado');
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // **VERIFICACIÓN DIRECTA CON bcrypt.compare - SIN MÉTODOS PROBLEMÁTICOS**
            console.log('🔑 Verificando contraseña...');
            console.log('📧 Email:', user.email);
            console.log('👤 Nombre completo:', user.nombre_completo);
            console.log('🎯 Rol:', user.rol);
            console.log('🗝️ Hash en DB:', user.contrasena ? 'EXISTE' : 'NO EXISTE');
            
            // Verificar contraseña DIRECTAMENTE con bcrypt
            const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);
            console.log('✅ Contraseña válida:', isValidPassword);

            if (!isValidPassword) {
                console.log('❌ Login: Contraseña incorrecta');
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar token
            console.log('🎫 Generando token JWT...');
            const token = jwt.sign(
                {
                    usuario_id: user.usuario_id,
                    email: user.email,
                    rol: user.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('🎉 LOGIN EXITOSO - Usuario:', user.nombre_completo);

            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    usuario_id: user.usuario_id,
                    nombre_completo: user.nombre_completo, // **CORREGIDO: usar nombre_completo**
                    email: user.email,
                    rol: user.rol
                }
            });

        } catch (error) {
            console.error('💥 ERROR EN LOGIN:', error);
            console.error('📋 Stack:', error.stack);
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