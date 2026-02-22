@echo off
echo ========================================
echo  LeafScan Backend Restart
echo ========================================
echo.

:: Kill any existing Python/uvicorn processes
taskkill /F /IM python.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

:: Start backend
echo Starting FastAPI backend on port 8000...
cd /d d:\LeafScan\backend
start "LeafScan Backend" /MIN venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

timeout /t 4 /nobreak >nul

:: Quick health check
echo.
echo Checking backend health...
curl -s http://localhost:8000/ >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Backend is running at http://localhost:8000
    echo [OK] API docs at http://localhost:8000/docs
) else (
    echo [WAIT] Backend starting up... check http://localhost:8000/docs in a few seconds
)

echo.
echo ========================================
echo  Backend started! 
echo  API: http://localhost:8000
echo  Docs: http://localhost:8000/docs
echo ========================================
