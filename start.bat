@echo off
cd /d "%~dp0"
echo Installation des dependances...
call npm install
if errorlevel 1 pause & exit /b 1
echo.
echo Demarrage du portfolio jeu...
start http://localhost:5174
call npm run dev
