const http = require('http');

async function setupAndTest() {
  console.log('🔄 INICIANDO CONFIGURACIÓN COMPLETA...\n');

  // 1. Verificar salud del backend
  console.log('1. 🏥 Verificando salud del backend...');
  try {
    const health = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:5000/api/health', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
    });
    console.log(`   ✅ Backend respondiendo: ${health.status}`);
  } catch (error) {
    console.log('   ❌ Backend no responde. Por favor ejecuta: npm run dev');
    return;
  }

  // 2. Hacer login
  console.log('2. 🔑 Intentando login...');
  const loginData = JSON.stringify({
    email: 'admin@ciclismo.com',
    password: 'Admin123!'
  });

  try {
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });

      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    if (loginResponse.status === 200) {
      const { token, user } = JSON.parse(loginResponse.data);
      console.log(`   ✅ Login exitoso como: ${user.nombre}`);
      console.log(`   🔐 Token obtenido\n`);

      // 3. Listar usuarios
      console.log('3. 👥 Listando usuarios...');
      const usersResponse = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: '/api/users',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });

        req.on('error', reject);
        req.end();
      });

      if (usersResponse.status === 200) {
        const users = JSON.parse(usersResponse.data);
        console.log(`   ✅ Usuarios obtenidos: ${users.length}`);
        users.forEach(u => {
          console.log(`      👤 ${u.id}: ${u.nombre} (${u.email})`);
        });
        
        // 4. Actualizar usuario 3
        if (users.length >= 3) {
          console.log('\n4. ✏️ Actualizando usuario ID 3...');
          const updateData = JSON.stringify({
            email: 'erick.nuevo@test.com'
          });

          const updateResponse = await new Promise((resolve, reject) => {
            const req = http.request({
              hostname: 'localhost',
              port: 5000,
              path: '/api/users/3',
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': updateData.length
              }
            }, (res) => {
              let data = '';
              res.on('data', chunk => data += chunk);
              res.on('end', () => resolve({ status: res.statusCode, data }));
            });

            req.on('error', reject);
            req.write(updateData);
            req.end();
          });

          console.log(`   ✅ Actualización: ${updateResponse.status}`);
          if (updateResponse.status === 200) {
            console.log('   🎉 ¡Usuario actualizado exitosamente!');
          }
        }
      } else {
        console.log(`   ❌ Error obteniendo usuarios: ${usersResponse.status}`);
      }

    } else {
      console.log('   ❌ Login fallido. Ejecuta primero: node guarantee-users.js');
    }

  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
}

setupAndTest();
