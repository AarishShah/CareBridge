@echo off
cd backend
start cmd /c "npm run dev"
cd ..
cd frontend
start cmd /c "npm run dev"
