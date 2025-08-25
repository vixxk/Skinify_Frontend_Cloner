@echo off
cls
echo SETTING UP...
echo ===================

:: Check if index.html exists
if not exist "index.html" (
    echo ❌ ERROR: index.html not found!
    pause
    exit /b 1
)

echo ✅ Found index.html

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo 📥 Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found

:: Check if http-server is installed
call http-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing http-server globally...
    call npm install -g http-server
    if %errorlevel% neq 0 (
        echo ❌ Failed to install http-server
        echo Try running as Administrator
        pause
        exit /b 1
    )
    echo ✅ http-server installed!
) else (
    echo ✅ http-server ready
)

set PORT=8080
echo.
echo 🚀 STARTING LIVE SERVER...
echo =========================

:: Start http-server in background
start /min "" http-server . -p %PORT% --cors -c-1

:: Wait a moment for server to start
timeout /t 3 /nobreak >nul

echo 🌐 Server running in background
echo 🌍 http://127.0.0.1:%PORT%

:: Open browser
start "" "http://127.0.0.1:%PORT%"

echo 🎉 Live server started at http://127.0.0.1:%PORT%
echo Source Code: https://github.com/vixxk
echo.
echo Press any key to exit...
pause >nul
exit /b 0
