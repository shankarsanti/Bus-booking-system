# Fix Vercel Deployment - Bus Booking System

## Problem
Your Vercel deployment at https://bus-booking-system-ruddy.vercel.app/ is not loading.

## Root Cause
The Vercel configuration was incorrect for a monorepo structure with frontend in a subdirectory.

## Solution

### Option 1: Deploy from Frontend Directory (RECOMMENDED)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy using the script**:
```bash
./deploy-vercel.sh
```

OR manually:
```bash
cd frontend
vercel --prod
```

4. **Configure Environment Variables** (IMPORTANT):
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add these from your `frontend/.env` file:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`
   - After adding, go to Deployments and redeploy

### Option 2: Reconfigure Existing Vercel Project

1. Go to https://vercel.com/dashboard
2. Select your project "bus-booking-system-ruddy"
3. Go to Settings → General
4. Under "Build & Development Settings":
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Save changes
6. Go to Deployments → Redeploy latest

### Option 3: Delete and Recreate Project

1. Delete the current Vercel project
2. Create a new project
3. When configuring:
   - Set Root Directory to `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables (see Option 1, step 4)
5. Deploy

## Verify Deployment

After deployment, check:
1. Site loads: https://bus-booking-system-ruddy.vercel.app/
2. No console errors (F12 → Console)
3. Firebase connection works (try logging in)

## Common Issues

### "Application error" or blank page
- **Cause**: Missing environment variables
- **Fix**: Add Firebase env vars in Vercel dashboard

### Build fails
- **Cause**: Dependencies not installed
- **Fix**: Ensure `package.json` is in frontend directory

### Routes not working (404 on refresh)
- **Cause**: Missing SPA rewrites
- **Fix**: Ensure `frontend/vercel.json` has rewrites configuration

## Files Changed
- ✅ `vercel.json` - Simplified root configuration
- ✅ `frontend/vercel.json` - Already has correct SPA rewrites
- ✅ `deploy-vercel.sh` - New deployment script
- ✅ `frontend/package.json` - Added vercel-build script

## Next Steps
1. Run `./deploy-vercel.sh` from project root
2. Add environment variables in Vercel dashboard
3. Test the deployment
