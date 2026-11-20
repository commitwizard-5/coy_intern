@echo off
title Coy Discover - SDE Intern Project (Ashmit Gautam)
echo =====================================================================
echo   Coy Discover - Standalone Prototype ^& Assignment Presentation
echo   Candidate: Ashmit Gautam (SDE Intern - Node.js / Full-Stack)
echo   Email: ashmitgautam788@gmail.com
echo =====================================================================
echo.

cd /d "%~dp0"

:: Check if .env exists
if not exist ".env" (
    if exist ".env.example" (
        echo [1/3] Setting up environment variables...
        copy .env.example .env >nul
    )
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [2/3] Installing dependencies...
    call npm install
)

:: Check if database is initialized
if not exist "prisma\dev.db" (
    echo [3/3] Initializing and seeding SQLite database with 30+ mock profiles...
    call npm run db:push
    call npm run db:seed
)

echo.
echo [OK] Opening http://localhost:3000/home in your default browser...
start /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000/home"

echo [OK] Starting Next.js development server on port 3000...
echo      Press Ctrl+C in this window anytime to stop the server.
echo.
call npm run dev

pause
