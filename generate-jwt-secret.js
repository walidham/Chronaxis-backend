const crypto = require('crypto');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT_SECRET:');
console.log(jwtSecret);
console.log('\nAdd this to your Azure Web App Service environment variables:');
console.log(`JWT_SECRET=${jwtSecret}`);