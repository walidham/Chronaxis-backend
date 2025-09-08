const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Créer le dossier certs s'il n'existe pas
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

try {
  // Générer une clé privée
  execSync(`openssl genrsa -out ${path.join(certsDir, 'private-key.pem')} 2048`);
  
  // Générer un certificat auto-signé
  execSync(`openssl req -new -x509 -key ${path.join(certsDir, 'private-key.pem')} -out ${path.join(certsDir, 'certificate.pem')} -days 365 -subj "/C=TN/ST=Gafsa/L=Gafsa/O=ISET/OU=IT/CN=localhost"`);
  
  console.log('Certificats SSL générés avec succès dans le dossier certs/');
} catch (error) {
  console.error('Erreur lors de la génération des certificats:', error.message);
  console.log('Assurez-vous qu\'OpenSSL est installé sur votre système');
}