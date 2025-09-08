@echo off
echo Génération des certificats SSL...

mkdir certs 2>nul

echo Génération de la clé privée...
openssl genrsa -out certs\private-key.pem 2048

echo Génération du certificat auto-signé...
openssl req -new -x509 -key certs\private-key.pem -out certs\certificate.pem -days 365 -subj "/C=TN/ST=Gafsa/L=Gafsa/O=ISET/OU=IT/CN=172.16.18.102" -addext "subjectAltName=IP:172.16.18.102,IP:127.0.0.1,DNS:localhost"

echo Certificats SSL générés avec succès!
echo Vous pouvez maintenant démarrer le serveur avec HTTPS sur le port 8443
pause