#!/bin/bash

echo "Building Personal Finance Tracker for Netlify..."

# Clean previous build
rm -rf dist

# Set environment for production build
export NODE_ENV=production

# Change to client directory and build
cd client
vite build --outDir ../dist

# Go back to root and set up deployment files
cd ..

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy redirects file for SPA routing
cp public/_redirects dist/ 2>/dev/null || echo -e "/*    /index.html   200" > dist/_redirects

# Create a build info file
echo "{\"build_time\": \"$(date)\", \"status\": \"ready\", \"environment\": \"production\"}" > dist/build-info.json

echo "Build complete! Files ready in 'dist' folder for Netlify deployment."
echo ""
echo "Deployment files created:"
echo "- netlify.toml (build configuration)"
echo "- dist/_redirects (SPA routing)"
echo "- firestore.rules (database security rules)"
echo ""
echo "Next steps:"
echo "1. Push repository to GitHub/GitLab"
echo "2. Connect to Netlify with these settings:"
echo "   - Build command: bash build-for-netlify.sh"
echo "   - Publish directory: dist"
echo "   - Node version: 20"
echo "3. Add Firebase environment variables in Netlify dashboard"
echo "4. Apply firestore.rules in Firebase console"