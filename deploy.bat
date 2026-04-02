@echo off
REM Bus Booking System - Deployment Script for Windows
REM This script helps deploy the application to Vercel and Firebase

echo.
echo ========================================
echo Bus Booking System - Deployment Script
echo ========================================
echo.

:menu
echo Select deployment option:
echo 1) Deploy Frontend to Vercel
echo 2) Deploy Backend to Firebase
echo 3) Deploy Both (Vercel + Firebase)
echo 4) Run Tests Before Deploy
echo 5) Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_firebase
if "%choice%"=="3" goto deploy_both
if "%choice%"=="4" goto run_tests
if "%choice%"=="5" goto exit
goto invalid

:deploy_vercel
echo.
echo Deploying Frontend to Vercel...
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Vercel CLI is not installed.
    echo Please install it with: npm install -g vercel
    goto end
)

REM Build the project
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    goto end
)
echo Build completed successfully!

REM Deploy to Vercel
echo Deploying to Vercel...
call vercel --prod
echo Frontend deployed to Vercel!
goto end

:deploy_firebase
echo.
echo Deploying Backend to Firebase...
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Firebase CLI is not installed.
    echo Please install it with: npm install -g firebase-tools
    goto end
)

REM Deploy Firestore rules
echo Deploying Firestore rules...
call firebase deploy --only firestore:rules
echo Firestore rules deployed!

REM Deploy Firestore indexes
echo Deploying Firestore indexes...
call firebase deploy --only firestore:indexes
echo Firestore indexes deployed!

REM Deploy Functions
echo Deploying Cloud Functions...
call firebase deploy --only functions
echo Cloud Functions deployed!

echo Backend deployed to Firebase!
goto end

:deploy_both
echo.
echo Deploying to Both Vercel and Firebase...
echo.

REM Check if both CLIs are installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Vercel CLI is not installed.
    goto end
)

where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Firebase CLI is not installed.
    goto end
)

REM Build the project
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    goto end
)
echo Build completed!

REM Deploy to Vercel
echo Deploying to Vercel...
call vercel --prod
echo Frontend deployed!

REM Deploy to Firebase
echo Deploying to Firebase...
call firebase deploy
echo Backend deployed!

echo.
echo Full deployment completed!
goto end

:run_tests
echo.
echo Running Tests...
echo.

echo Testing build...
call npm run build
if %errorlevel% neq 0 (
    echo Build test failed!
    goto end
)
echo Build test passed!

echo.
echo Starting preview server...
echo Please test manually at http://localhost:4173
call npm run preview
goto end

:invalid
echo Invalid choice. Please try again.
echo.
goto menu

:exit
echo Exiting...
goto :eof

:end
echo.
echo ==========================================
echo Deployment process completed!
echo.
echo Next steps:
echo 1. Test your deployment
echo 2. Check Vercel dashboard for frontend status
echo 3. Check Firebase console for backend status
echo 4. Monitor logs for any errors
echo.
echo Documentation:
echo - Deployment Guide: DEPLOYMENT_GUIDE.md
echo - Checklist: DEPLOYMENT_CHECKLIST.md
echo.
pause
