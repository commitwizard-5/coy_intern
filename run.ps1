# Coy Discover Launch Script for PowerShell
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  Coy Discover - Standalone Prototype & Assignment Presentation" -ForegroundColor White
Write-Host "  Candidate: Ashmit Gautam (SDE Intern - Node.js / Full-Stack)" -ForegroundColor Green
Write-Host "  Email: ashmitgautam788@gmail.com" -ForegroundColor DarkCyan
Write-Host "=====================================================================`n" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\coy-discover"

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "[1/3] Copying .env.example to .env..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
    }
}

if (-not (Test-Path "node_modules")) {
    Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "prisma\dev.db")) {
    Write-Host "[3/3] Initializing and seeding SQLite database..." -ForegroundColor Yellow
    npm run db:push
    npm run db:seed
}

Write-Host "`n[OK] Launching browser to http://localhost:3000/home..." -ForegroundColor Green
Start-Process "http://localhost:3000/home"

Write-Host "[OK] Starting Next.js development server on port 3000..." -ForegroundColor Green
Write-Host "     Press Ctrl+C in this terminal anytime to stop the server.`n" -ForegroundColor Gray
npm run dev
