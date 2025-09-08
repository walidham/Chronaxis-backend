#!/bin/bash

# Configuration
DOMAIN=${DOMAIN:-"votre-domaine.com"}
EMAIL=${EMAIL:-"admin@votre-domaine.com"}
CERTS_DIR="./certs"

echo "Configuration Let's Encrypt pour: $DOMAIN"

# Vérifier si certbot est installé
if ! command -v certbot &> /dev/null; then
    echo "❌ Certbot n'est pas installé"
    echo "Installez certbot:"
    echo "Ubuntu/Debian: sudo apt install certbot"
    echo "CentOS/RHEL: sudo yum install certbot"
    echo "macOS: brew install certbot"
    exit 1
fi

echo "✓ Certbot est installé"

# Créer le dossier certs
mkdir -p $CERTS_DIR

# Arrêter le serveur temporairement
echo "Arrêt du serveur pour libérer le port 80..."
pkill -f "node.*www" || true

# Obtenir le certificat
echo "Obtention du certificat Let's Encrypt..."
sudo certbot certonly \
    --standalone \
    -d $DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive \
    --force-renewal

# Copier les certificats
if [ -f "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ]; then
    echo "Copie des certificats..."
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $CERTS_DIR/private-key.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $CERTS_DIR/certificate.pem
    
    # Changer les permissions
    sudo chown $USER:$USER $CERTS_DIR/*.pem
    chmod 600 $CERTS_DIR/*.pem
    
    echo "✓ Certificats installés avec succès!"
    echo "Redémarrez le serveur avec: npm start"
else
    echo "❌ Erreur lors de l'obtention du certificat"
    exit 1
fi