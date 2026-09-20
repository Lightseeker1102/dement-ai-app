@echo off
title DementAI - Services Launcher
echo Starting DementAI Microservices...
echo.

echo [1/4] Starting ML Microservice (Port 8000)...
start "DementAI ML Service" cmd /k "cd /d %~dp0ml-service && python app.py"

timeout /t 2 >nul

echo [2/4] Starting Auth Microservice (Port 8081)...
start "DementAI Auth Service" cmd /k "cd /d %~dp0java-backend-auth && mvn spring-boot:run"

echo [3/4] Starting Clinical Microservice (Port 8082)...
start "DementAI Clinical Service" cmd /k "cd /d %~dp0java-backend-clinical && mvn spring-boot:run"

timeout /t 3 >nul

echo [4/4] Starting Frontend App (Port 3000)...
start "DementAI Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo All services launched.
echo - Web App:      http://localhost:3000
echo - Auth API:     http://localhost:8081/dementai-auth-api/api/auth
echo - Clinical API: http://localhost:8082/dementai-clinical-api/api
echo - ML Service:   http://localhost:8000
echo.
pause
