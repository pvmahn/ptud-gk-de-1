@echo off
echo ================================
echo 🚀 Flask-tiny-app - Setup Script
echo ================================

:: Kiểm tra npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Lỗi: npm chưa được cài đặt!
    echo 🔗 Hãy cài đặt Node.js tại https://nodejs.org/
    exit /b
)

:: Cài đặt dependencies
echo 🔄 Đang cài đặt dependencies...
npm install

:: Khởi động server
echo 🚀 Đang khởi động server...
npm start
