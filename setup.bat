@echo off
echo ========================================
echo   AI Chatbot - Quick Setup Script
echo ========================================
echo.

echo Step 1: Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo !!! IMPORTANT !!!
    echo Please edit backend\.env and add your OpenAI API key
    echo OPENAI_API_KEY=your_api_key_here
    echo.
    pause
)

echo Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up Frontend...
cd ..\frontend

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Setup Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Make sure you added your OpenAI API key to backend\.env
echo.
echo 2. Open TWO terminal windows:
echo.
echo    Terminal 1 - Backend:
echo    cd backend
echo    npm start
echo.
echo    Terminal 2 - Frontend:
echo    cd frontend  
echo    npm run dev
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo ========================================
pause
