const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DOMAIN = process.env.DOMAIN || 'votre-domaine.com';
const EMAIL = process.env.EMAIL || 'admin@votre-domaine.com';

console.log('Configuration Let\'s Encrypt pour:', DOMAIN);

// Vérifier si certbot est installé
try {
  execSync('certbot --version', { stdio: 'ignore' });
  console.log('✓ Certbot est installé');
} catch (error) {
  console.error('❌ Certbot n\'est pas installé');
  console.log('Installez certbot:');
  console.log('Windows: choco install certbot');
  console.log('Ubuntu: sudo apt install certbot');
  console.log('CentOS: sudo yum install certbot');
  process.exit(1);
}

// Créer le dossier pour les certificats
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

console.log('Pour obtenir un certificat Let\'s Encrypt, exécutez:');
console.log(`certbot certonly --standalone -d ${DOMAIN} --email ${EMAIL} --agree-tos --non-interactive`);
console.log('');
console.log('Puis copiez les certificats:');
console.log(`cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${path.join(certsDir, 'private-key.pem')}`);
console.log(`cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${path.join(certsDir, 'certificate.pem')}`);