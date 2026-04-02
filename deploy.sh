#!/bin/bash

# Bus Booking System - Deployment Script
# This script helps deploy the application to Vercel and Firebase

set -e

echo "🚀 Bus Booking System - Deployment Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required commands exist
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Main menu
echo "Select deployment option:"
echo "1) Deploy Frontend to Vercel"
echo "2) Deploy Backend to Firebase"
echo "3) Deploy Both (Vercel + Firebase)"
echo "4) Run Tests Before Deploy"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying Frontend to Vercel..."
        echo ""
        
        # Check if Vercel CLI is installed
        check_command "vercel"
        
        # Build the project
        print_warning "Building project..."
        npm run build
        print_success "Build completed"
        
        # Deploy to Vercel
        print_warning "Deploying to Vercel..."
        vercel --prod
        print_success "Frontend deployed to Vercel!"
        ;;
        
    2)
        echo ""
        echo "🔥 Deploying Backend to Firebase..."
        echo ""
        
        # Check if Firebase CLI is installed
        check_command "firebase"
        
        # Deploy Firestore rules
        print_warning "Deploying Firestore rules..."
        firebase deploy --only firestore:rules
        print_success "Firestore rules deployed"
        
        # Deploy Firestore indexes
        print_warning "Deploying Firestore indexes..."
        firebase deploy --only firestore:indexes
        print_success "Firestore indexes deployed"
        
        # Deploy Functions
        print_warning "Deploying Cloud Functions..."
        firebase deploy --only functions
        print_success "Cloud Functions deployed"
        
        print_success "Backend deployed to Firebase!"
        ;;
        
    3)
        echo ""
        echo "🚀 Deploying to Both Vercel and Firebase..."
        echo ""
        
        # Check if both CLIs are installed
        check_command "vercel"
        check_command "firebase"
        
        # Build the project
        print_warning "Building project..."
        npm run build
        print_success "Build completed"
        
        # Deploy to Vercel
        print_warning "Deploying to Vercel..."
        vercel --prod
        print_success "Frontend deployed to Vercel!"
        
        # Deploy to Firebase
        print_warning "Deploying to Firebase..."
        firebase deploy
        print_success "Backend deployed to Firebase!"
        
        echo ""
        print_success "🎉 Full deployment completed!"
        ;;
        
    4)
        echo ""
        echo "🧪 Running Tests..."
        echo ""
        
        # Build test
        print_warning "Testing build..."
        npm run build
        print_success "Build test passed"
        
        # Preview test
        print_warning "Starting preview server..."
        print_warning "Please test manually at http://localhost:4173"
        npm run preview
        ;;
        
    5)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "✨ Deployment process completed!"
echo ""
echo "Next steps:"
echo "1. Test your deployment"
echo "2. Check Vercel dashboard for frontend status"
echo "3. Check Firebase console for backend status"
echo "4. Monitor logs for any errors"
echo ""
echo "📚 Documentation:"
echo "- Deployment Guide: DEPLOYMENT_GUIDE.md"
echo "- Checklist: DEPLOYMENT_CHECKLIST.md"
echo ""
