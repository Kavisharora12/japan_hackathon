# Japan Saathi - Docker Multi-Container Launcher for PowerShell
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Japan Saathi - Docker Multi-Container Launcher" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".env")) {
    Write-Host "[.env missing] Copying .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please ensure your GEMINI_API_KEY is configured in .env!" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Starting all 3 services with Docker Compose..." -ForegroundColor Green
Write-Host "  - Backend Go Planner: http://localhost:8080" -ForegroundColor White
Write-Host "  - Web Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host "  - Mobile Expo App:   http://localhost:8081" -ForegroundColor White
Write-Host ""

docker compose up --build
