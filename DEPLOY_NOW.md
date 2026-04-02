# 🚀 Deploy Your Bus Booking System - EXACT STEPS

## Current Problem
Your site at https://bus-booking-system-ruddy.vercel.app/ is not loading because Vercel is configured incorrectly.

## ✅ SOLUTION: Reconfigure Vercel Project

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Find and click on project: **bus-booking-system-ruddy**

### Step 2: Update Project Settings
1. Click **Settings** (top navigation)
2. Click **General** (left sidebar)
3. Scroll down to **"Build & Development Settings"**
4. Click **"Edit"** button
5. Change these settings:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

6. Click **Save**

### Step 3: Add Environment Variables
1. Still in Settings, click **Environment Variables** (left sidebar)
2. Add these 7 variables one by one:

**Variable 1:**
```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyCnLYZXi23CCdJdxYPGRCN6iPCMl_dn7sc
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 2:**
```
Name: VITE_FIREBASE_AUTH_DOMAIN
Value: bus-booking-system-33cf7.firebaseapp.com
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 3:**
```
Name: VITE_FIREBASE_PROJECT_ID
Value: bus-booking-system-33cf7
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 4:**
```
Name: VITE_FIREBASE_STORAGE_BUCKET
Value: bus-booking-system-33cf7.firebasestorage.app
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 5:**
```
Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 505980717896
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 6:**
```
Name: VITE_FIREBASE_APP_ID
Value: 1:505980717896:web:06881636488e6030ff817d
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 7:**
```
Name: VITE_FIREBASE_MEASUREMENT_ID
Value: G-M1VTR8C3JW
Environments: ✓ Production ✓ Preview ✓ Development
```

3. Click **Save** after adding each variable

### Step 4: Redeploy
1. Click **Deployments** (top navigation)
2. Find the latest deployment
3. Click the **three dots (...)** on the right
4. Click **Redeploy**
5. Click **Redeploy** again to confirm
6. Wait 1-2 minutes for deployment to complete

### Step 5: Test Your Site
1. Visit: https://bus-booking-system-ruddy.vercel.app/
2. You should see your bus booking homepage
3. Try logging in with admin credentials to verify Firebase works

---

## 🔄 Alternative: Deploy Fresh (If Above Doesn't Work)

If the above steps don't work, delete the project and redeploy:

### Option A: Via Vercel Dashboard
1. Delete current project in Vercel
2. Click **"Add New Project"**
3. Click **"Import Git Repository"** (or upload folder)
4. Select your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add all 7 environment variables (from Step 3 above)
7. Click **Deploy**

### Option B: Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# Follow prompts and select your account
```

---

## ✅ What I Fixed in Your Code
- ✅ Removed conflicting root `vercel.json`
- ✅ Kept proper `frontend/vercel.json` with SPA rewrites
- ✅ Build works locally (tested successfully)

## 🎯 The Key Issue
Vercel needs to know your app is in the `frontend` folder, not the root. That's why setting **Root Directory: frontend** is critical.

## 📞 If Still Not Working
1. Check Vercel deployment logs for errors
2. Open browser console (F12) and check for errors
3. Verify all 7 environment variables are saved in Vercel
4. Make sure Root Directory is set to `frontend`
