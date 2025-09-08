@echo off
echo Démarrage du backend sur toutes les interfaces réseau...

set NODE_ENV=development
set PORT=8080
set HTTPS_PORT=8443

echo Backend accessible sur:
echo - HTTP: http://172.16.18.102:8080
echo - HTTPS: https://172.16.18.102:8443

npm start