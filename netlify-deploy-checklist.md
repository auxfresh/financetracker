# Netlify Deployment Checklist

## Files Ready for Deployment ✅

- `netlify.toml` - Build configuration
- `build-for-netlify.sh` - Production build script  
- `public/_redirects` - SPA routing support
- `firestore.rules` - Database security rules
- `DEPLOYMENT.md` - Complete deployment guide
- `README.md` - Project documentation

## Netlify Setup Steps

### 1. Repository Connection
- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Connect repository to Netlify
- [ ] Set build command: `bash build-for-netlify.sh`
- [ ] Set publish directory: `dist`
- [ ] Set Node version: `20`

### 2. Environment Variables (Required)
Add in Netlify Dashboard → Site settings → Environment variables:
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_PROJECT_ID` 
- [ ] `VITE_FIREBASE_APP_ID`

### 3. Firebase Configuration
- [ ] Enable Email/Password authentication
- [ ] Add Netlify domain to authorized domains
- [ ] Apply Firestore security rules from `firestore.rules`
- [ ] Test authentication flow

### 4. Deployment Verification
- [ ] Build succeeds on Netlify
- [ ] Site loads without errors
- [ ] User registration works
- [ ] User login works  
- [ ] Transaction creation works
- [ ] Dashboard displays data correctly

## Quick Deploy Command
```bash
# Test build locally first
bash build-for-netlify.sh

# Then push to repository and deploy via Netlify UI
```

## Support
- Firebase Console: https://console.firebase.google.com/
- Netlify Dashboard: https://app.netlify.com/
- Project repository with all deployment files ready