@echo off
echo Nettoyage de la base de données - Séances orphelines
echo.

echo 1. Nettoyage interactif (avec confirmation)
echo 2. Nettoyage automatique (sans confirmation)
echo 3. Annuler
echo.

set /p choice="Choisissez une option (1-3): "

if "%choice%"=="1" (
    echo Lancement du nettoyage interactif...
    node scripts/cleanOrphanSessions.js
) else if "%choice%"=="2" (
    echo Lancement du nettoyage automatique...
    node scripts/cleanOrphanSessions-auto.js
) else if "%choice%"=="3" (
    echo Nettoyage annulé.
) else (
    echo Option invalide.
)

pause