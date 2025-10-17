// genera-hashes.js
const bcrypt = require('bcryptjs');

async function generateHashes() {
  const password = 'password123';
  
  console.log('Generando hashes para:', password);
  
  for (let i = 0; i < 4; i++) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Hash ${i + 1}: ${hash}`);
  }
}

generateHashes();