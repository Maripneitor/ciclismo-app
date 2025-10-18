const http = require('http');

const tests = [
  { url: '/api/health', method: 'GET' },
  { url: '/api/events', method: 'GET' },
  { url: '/api/users', method: 'GET' }
];

async function testEndpoints() {
  console.log('🔍 TESTEANDO ENDPOINTS DEL BACKEND...');
  
  for (const test of tests) {
    try {
      const response = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: test.url,
          method: test.method,
          timeout: 5000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        
        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Timeout')));
        req.end();
      });
      
      console.log(`✅ ${test.method} ${test.url}: ${response.status}`);
      
    } catch (error) {
      console.log(`❌ ${test.method} ${test.url}: ${error.message}`);
    }
  }
}

testEndpoints();
