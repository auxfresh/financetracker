# Personal Finance Manager

A comprehensive personal finance tracking application built with React, TypeScript, and Firebase.

## Features

- **User Authentication**: Secure signup and login with Firebase Auth
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Categorization**: Organize transactions by predefined categories
- **Dashboard**: Visual overview with charts and spending analytics
- **Filtering**: Filter transactions by type, category, and date range
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore for data storage
- **Authentication**: Firebase Authentication
- **Charts**: Recharts for data visualization
- **UI Components**: shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing

## Deployment

### Netlify Deployment

This app is configured for easy deployment on Netlify:

1. **Connect Repository**: Link your Git repository to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add your Firebase configuration:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Add your domain to authorized domains in Authentication settings
5. Configure Firestore security rules:

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

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and Firebase config
│   │   └── pages/          # Application pages
│   └── index.html
├── shared/
│   └── schema.ts          # Shared TypeScript schemas
└── public/                # Static assets
```

## License

MIT License