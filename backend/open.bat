@echo off
cls
echo SETTING UP...
echo ===================

:: Check if index.html exists
if not exist "index.html" (
    echo ❌ ERROR: index.html not found!
    exit /b 1
)
echo ✅ Found index.html

:: Check if node is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    exit /b 1
)
echo ✅ Node.js found

:: Check if http-server is installed
where http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing http-server globally...
    npm install -g http-server
    if %errorlevel% neq 0 (
        echo ❌ Failed to install http-server
        exit /b 1
    )
    echo ✅ http-server installed!
) else (
    echo ✅ http-server ready
)

set PORT=8788

:: Kill any process using the port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo ⚠️ Port %PORT% is in use by PID %%a. Killing it...
    taskkill /PID %%a /F
)

echo.
echo 🚀 STARTING LIVE SERVER...
echo =========================

:: Start http-server
start "" /B cmd /c "http-server . -p %PORT% --cors -c-1"

:: Wait a second to ensure server is ready
timeout /t 1 >nul

echo 🌐 Server running on http://127.0.0.1:%PORT%

:: Open browser
start "" "http://127.0.0.1:%PORT%"

echo 🎉 Live server started at http://127.0.0.1:%PORT%
echo Press Ctrl+C to stop.

:: Wait indefinitely
:WAIT_LOOP
timeout /t 10 >nul
goto WAIT_LOOP
