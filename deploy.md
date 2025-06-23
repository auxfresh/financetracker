# Netlify Deployment Guide

## Quick Deploy

1. **Push to GitHub/GitLab**: Push your code to a Git repository
2. **Connect to Netlify**: 
   - Go to [netlify.com](https://netlify.com) and sign up
   - Click "New site from Git"
   - Connect your repository
3. **Build Settings**:
   - Build command: `NODE_ENV=production vite build --config vite.config.netlify.ts`
   - Publish directory: `dist`
   - Node version: `20`

## Environment Variables

Add these in Netlify dashboard under Site settings > Environment variables:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here  
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Firebase Configuration

### 1. Firestore Database Rules

In Firebase Console > Firestore Database > Rules, use:

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

### 2. Authentication Settings

1. Enable Email/Password authentication
2. Add your Netlify domain to authorized domains:
   - Go to Authentication > Settings > Authorized domains
   - Add: `your-site-name.netlify.app`

## Files Created for Deployment

- `netlify.toml` - Netlify configuration
- `vite.config.netlify.ts` - Optimized build config
- `public/_redirects` - SPA routing support
- `firestore.rules` - Database security rules
- `README.md` - Project documentation

## Manual Build Test

To test locally:
```bash
NODE_ENV=production vite build --config vite.config.netlify.ts
```

The built files will be in the `dist` folder.