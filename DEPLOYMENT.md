# Deployment Guide for Personal Finance Tracker

## Netlify Deployment (Recommended)

### Quick Setup

1. **Repository Setup**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Ensure all files are committed

2. **Netlify Configuration**
   - Go to [netlify.com](https://netlify.com) and create account
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     ```
     Build command: bash build-for-netlify.sh
     Publish directory: dist
     Node version: 20
     ```

3. **Environment Variables**
   Add these in Netlify Dashboard → Site settings → Environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

### Firebase Configuration

#### 1. Authentication Setup
- Enable Email/Password authentication in Firebase Console
- Add your Netlify domain to authorized domains:
  - Go to Authentication → Settings → Authorized domains
  - Add: `your-site-name.netlify.app`

#### 2. Firestore Database Rules
Copy the rules from `firestore.rules` file to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{document} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Files Created for Deployment

- `netlify.toml` - Netlify build configuration
- `build-for-netlify.sh` - Custom build script
- `public/_redirects` - SPA routing configuration
- `firestore.rules` - Database security rules
- `DEPLOYMENT.md` - This deployment guide

### Testing Locally

To test the build process locally:
```bash
bash build-for-netlify.sh
```

The built application will be in the `dist` folder.

### Troubleshooting

**Build Issues:**
- Ensure Node.js version 18+ is being used
- Check that all environment variables are set correctly
- Verify Firebase project is properly configured

**Authentication Issues:**
- Confirm your domain is in Firebase authorized domains
- Check that Firebase API keys are correctly set in environment variables
- Ensure Firestore rules are published

**Data Access Issues:**
- Verify Firestore security rules allow authenticated users to access their data
- Check browser console for specific Firebase errors

### Alternative Deployment Options

#### Vercel
1. Connect repository to Vercel
2. Set build command: `bash build-for-netlify.sh`
3. Set output directory: `dist`
4. Add same environment variables

#### Manual Deployment
1. Run `bash build-for-netlify.sh` locally
2. Upload `dist` folder contents to any static hosting service
3. Ensure redirect rules are configured for SPA routing

## Production Checklist

- [ ] Firebase project configured with authentication
- [ ] Firestore rules published
- [ ] Environment variables set in hosting platform
- [ ] Domain added to Firebase authorized domains
- [ ] Build and deployment successful
- [ ] User registration and login working
- [ ] Transaction creation and management functional
- [ ] Dashboard displaying data correctly