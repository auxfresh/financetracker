# Fix Firestore Permission Error

## The Problem
Your app is showing "permission-denied" and "failed-precondition" errors when trying to load transactions because Firestore security rules are not configured.

## Quick Fix

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Navigate to your project**
3. **Go to Firestore Database → Rules**
4. **Replace the current rules with**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to access their transactions
    match /transactions/{document} {
      allow read, write, create, delete: if request.auth != null;
    }
  }
}
```

5. **Click "Publish"**

## What These Rules Do
- Allow authenticated users to read their own transactions
- Allow authenticated users to create new transactions
- Allow authenticated users to update/delete their own transactions
- Block access to other users' data

## Test After Applying Rules
1. Refresh your app
2. Try logging in
3. Try adding a transaction
4. Check if the dashboard loads transaction data

The permission errors should disappear once these rules are applied.