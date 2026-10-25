@echo off
echo ===================================================
echo   Japan Saathi - Docker Multi-Container Launcher
echo ===================================================
echo.

IF NOT EXIST .env (
    echo [.env missing] Creating .env from .env.example...
    copy .env.example .env
    echo Please make sure your GEMINI_API_KEY is set in .env!
    echo.
)

echo Starting Go Backend (:8080), Web Frontend (:3000), and Mobile App (:8081)...
docker compose up --build

pause
