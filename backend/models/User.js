const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_completo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('usuario', 'organizador', 'admin'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    profileImageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    puede_crear_equipo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.contrasena) {
                user.contrasena = await bcrypt.hash(user.contrasena, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('contrasena') && user.contrasena) {
                user.contrasena = await bcrypt.hash(user.contrasena, 10);
            }
        }
    }
});

module.exports = User;