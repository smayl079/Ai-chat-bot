@echo off
echo Starting AI Chatbot Backend Server...
cd backend
start cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo Starting AI Chatbot Frontend...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
