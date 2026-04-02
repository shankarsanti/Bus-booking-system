# Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. Fixed Issues
- ✅ Removed invalid `ignoreDeprecations` from tsconfig.json
- ✅ Build completes successfully
- ✅ Created Vercel configuration files

### 2. Environment Variables Setup

Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important:** Copy these values from your `frontend/.env` file.

## Deployment Methods

### Method 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the root directory:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time) or **Y** (subsequent deploys)
   - What's your project's name? **bus-booking-system** (or your preferred name)
   - In which directory is your code located? **./frontend**

5. For production deployment:
```bash
vercel --prod
```

### Method 2: Deploy via GitHub Integration

1. Push your code to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** npm run build
   - **Output Directory:** dist
6. Add environment variables (see section above)
7. Click "Deploy"

### Method 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Select "Import Git Repository" or upload your project
4. Configure as described in Method 2

## Build Configuration

The project uses the following configuration:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

## Post-Deployment

### 1. Verify Deployment
- Check that all routes work correctly
- Test authentication flow
- Verify Firebase connection
- Test booking functionality

### 2. Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### 3. Performance Optimization

The build shows some large chunks. Consider these optimizations:

```javascript
// In vite.config.js, add:
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'charts': ['recharts'],
          'pdf': ['jspdf', 'html2canvas']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version (should be 18+)
- Clear build cache: `vercel --force`

### Routes Not Working
- Ensure `vercel.json` is properly configured for SPA routing
- Check that rewrites are set up correctly

### Firebase Connection Issues
- Verify all Firebase environment variables are correct
- Check Firebase project settings
- Ensure Firebase services are enabled

### Large Bundle Size Warning
- This is a warning, not an error
- The app will still deploy and work
- Consider implementing code splitting for better performance

## Monitoring

After deployment:
1. Check Vercel Analytics for performance metrics
2. Monitor error logs in Vercel dashboard
3. Set up alerts for deployment failures

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers a production deployment
- Pull requests create preview deployments
- You can configure branch deployments in Vercel settings

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify Firebase configuration
4. Check network requests in browser DevTools
