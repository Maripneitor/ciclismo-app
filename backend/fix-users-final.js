const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function fixDatabaseFinal() {
    try {
        console.log('🔧 INICIANDO REPARACIÓN COMPLETA DE LA BASE DE DATOS...');
        
        // Paso 1: Verificar la restricción actual
        console.log('📋 Verificando restricciones existentes...');
        const constraints = await sequelize.query(`
            SELECT 
                conname as constraint_name,
                pg_get_constraintdef(oid) as constraint_definition
            FROM pg_constraint 
            WHERE conrelid = 'usuarios'::regclass 
            AND contype = 'c'
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        console.log('🔍 Restricciones encontradas:');
        constraints.forEach(constraint => {
            console.log(`   - ${constraint.constraint_name}: ${constraint.constraint_definition}`);
        });
        
        // Paso 2: Eliminar restricciones CHECK existentes
        console.log('🔄 Eliminando restricciones CHECK existentes...');
        for (const constraint of constraints) {
            if (constraint.constraint_name.includes('rol_check')) {
                await sequelize.query(`
                    ALTER TABLE usuarios DROP CONSTRAINT "${constraint.constraint_name}"
                `);
                console.log(`✅ Restricción eliminada: ${constraint.constraint_name}`);
            }
        }
        
        // Paso 3: Crear nueva restricción que incluya 'admin'
        console.log('➕ Creando nueva restricción CHECK...');
        await sequelize.query(`
            ALTER TABLE usuarios 
            ADD CONSTRAINT usuarios_rol_check 
            CHECK (rol IN ('usuario', 'organizador', 'admin'))
        `);
        console.log('✅ Nueva restricción CHECK creada');
        
        // Paso 4: Generar contraseña hasheada
        console.log('🔑 Generando contraseña hasheada...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Paso 5: Actualizar usuarios
        console.log('👤 Actualizando usuarios...');
        const updateResult = await sequelize.query(`
            UPDATE usuarios 
            SET 
                rol = CASE 
                    WHEN email = 'admin@ciclismo.com' THEN 'admin'
                    WHEN email = 'organizador@ciclismo.com' THEN 'organizador' 
                    ELSE 'usuario' 
                END,
                contrasena = $1,
                telefono = CASE
                    WHEN email = 'admin@ciclismo.com' THEN '+34 600 111 222'
                    WHEN email = 'organizador@ciclismo.com' THEN '+34 600 333 444'
                    WHEN email = 'usuario@ciclismo.com' THEN '+34 600 555 666'
                    ELSE telefono
                END,
                puede_crear_equipo = CASE
                    WHEN email IN ('admin@ciclismo.com', 'organizador@ciclismo.com') THEN true
                    ELSE false
                END
            WHERE email IN ('admin@ciclismo.com', 'organizador@ciclismo.com', 'usuario@ciclismo.com')
        `, {
            bind: [hashedPassword],
            type: sequelize.QueryTypes.UPDATE
        });
        
        console.log('✅ Usuarios actualizados correctamente');
        
        // Paso 6: Verificar cambios finales
        console.log('\n📊 VERIFICACIÓN FINAL:');
        const users = await sequelize.query(`
            SELECT 
                usuario_id, 
                nombre_completo, 
                email, 
                rol, 
                puede_crear_equipo, 
                telefono,
                LENGTH(contrasena) as password_length
            FROM usuarios 
            ORDER BY usuario_id
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        console.log('='.repeat(90));
        users.forEach(user => {
            console.log(`   ${user.usuario_id}. ${user.nombre_completo}`);
            console.log(`      Email: ${user.email}`);
            console.log(`      Rol: ${user.rol}`);
            console.log(`      Puede crear equipo: ${user.puede_crear_equipo}`);
            console.log(`      Teléfono: ${user.telefono}`);
            console.log(`      Longitud contraseña: ${user.password_length} caracteres`);
            console.log('');
        });
        
        // Verificar la nueva restricción
        const newConstraints = await sequelize.query(`
            SELECT pg_get_constraintdef(oid) as constraint_def
            FROM pg_constraint 
            WHERE conrelid = 'usuarios'::regclass 
            AND contype = 'c'
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        console.log('🔒 RESTRICCIÓN CHECK ACTUAL:');
        newConstraints.forEach(constraint => {
            console.log(`   ${constraint.constraint_def}`);
        });
        
        console.log('\n🎉 REPARACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('\n🔑 CREDENCIALES PARA LOGIN:');
        console.log('   👑 Admin: admin@ciclismo.com / password123');
        console.log('   🎯 Organizador: organizador@ciclismo.com / password123');
        console.log('   👤 Usuario: usuario@ciclismo.com / password123');
        console.log('\n🚀 Ahora puedes reiniciar el servidor y probar el login.');
        
    } catch (error) {
        console.error('❌ Error en la reparación:', error);
        console.error('Detalles:', error.message);
    } finally {
        await sequelize.close();
        console.log('\n🔒 Conexión a la base de datos cerrada.');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    fixDatabaseFinal();
}

module.exports = fixDatabaseFinal;