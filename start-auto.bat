@echo off
echo Détection automatique de l'IP et démarrage du backend...

REM Détecter l'IP locale
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set LOCAL_IP=%%b
        goto :found
    )
)
:found

REM Supprimer les espaces
set LOCAL_IP=%LOCAL_IP: =%

echo IP détectée: %LOCAL_IP%

set NODE_ENV=development
set PORT=8080
set HTTPS_PORT=8443

echo Backend accessible sur:
echo - HTTP: http://%LOCAL_IP%:8080
echo - HTTPS: https://%LOCAL_IP%:8443

npm start