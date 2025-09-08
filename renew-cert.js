const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOMAIN = process.env.DOMAIN || 'votre-domaine.com';
const certsDir = path.join(__dirname, 'certs');

console.log('Renouvellement automatique du certificat Let\'s Encrypt...');

try {
  // Renouveler le certificat
  execSync('sudo certbot renew --quiet', { stdio: 'inherit' });
  
  // Copier les nouveaux certificats
  if (fs.existsSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`)) {
    execSync(`sudo cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${path.join(certsDir, 'private-key.pem')}`);
    execSync(`sudo cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${path.join(certsDir, 'certificate.pem')}`);
    
    // Changer les permissions
    execSync(`sudo chown ${process.env.USER}:${process.env.USER} ${certsDir}/*.pem`);
    execSync(`chmod 600 ${certsDir}/*.pem`);
    
    console.log('✓ Certificat renouvelé avec succès');
    
    // Redémarrer le serveur (optionnel)
    // execSync('pm2 restart chronaxis-backend');
  }
} catch (error) {
  console.error('Erreur lors du renouvellement:', error.message);
  process.exit(1);
}