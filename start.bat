@echo off
echo ========================================
echo   LeafScan - Starting Servers
echo ========================================
echo.

echo [1/2] Starting Backend (FastAPI on port 8000)...
start "LeafScan Backend" cmd /k "cd /d d:\LeafScan\backend && venv\Scripts\python.exe main.py"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (Vite on port 5173)...
start "LeafScan Frontend" cmd /k "cd /d d:\LeafScan\frontend && npm run dev"

timeout /t 4 /nobreak > nul

echo.
echo ========================================
echo   LeafScan is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/api/docs
echo ========================================
echo.
start http://localhost:5173
