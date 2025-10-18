// generate-hashes.js
const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'password123';
  
  console.log('Hash para admin@ciclismo.com:');
  const hash1 = await bcrypt.hash(password, 10);
  console.log(hash1);
  
  console.log('\nHash para organizador@ciclismo.com:');
  const hash2 = await bcrypt.hash(password, 10);
  console.log(hash2);
  
  console.log('\nHash para usuario@ciclismo.com:');
  const hash3 = await bcrypt.hash(password, 10);
  console.log(hash3);
  
  console.log('\nHash para test@ciclismo.com:');
  const hash4 = await bcrypt.hash(password, 10);
  console.log(hash4);
}

generateHashes();