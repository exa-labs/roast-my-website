# Firebase Setup Guide for Roast My Website

This guide will help you set up Firebase Firestore to enable caching for your Roast My Website application.

## 🔥 Firebase Project Setup

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "roast-my-website")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database
1. In your Firebase project dashboard, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
4. Select a location for your database (choose one close to your users)
5. Click "Done"

### Step 3: Get Firebase Configuration
1. In your Firebase project dashboard, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app with a nickname (e.g., "roast-my-website-web")
6. Copy the Firebase configuration object

## 🔑 Environment Variables Setup

Add the following to your `.env.local` file:

```env
# Firebase Configuration (API Key and Auth Domain are server-side only for security)
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with the actual values from your Firebase config.

**🔒 Security Note**: The API Key and Auth Domain are server-side only (no `NEXT_PUBLIC_` prefix) for enhanced security, while other config values use `NEXT_PUBLIC_` as they're less sensitive. The frontend communicates with Firebase only through secure API routes.

## 🔒 Firestore Security Rules (Optional)

For production, you may want to set up proper security rules. Go to Firestore > Rules and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to website_roasts collection
    match /website_roasts/{document} {
      allow read, write: if true;
    }
  }
}
```

**Note**: The above rules allow anyone to read/write. For production, implement proper authentication and more restrictive rules.

## 📊 Database Structure

The app will automatically create the following structure in Firestore:

```
website_roasts (collection)
├── example.com (document)
│   ├── websiteUrl: "example.com"
│   ├── websiteData: { results: [...] }
│   ├── linkedinData: { results: [...] } | null
│   ├── llmAnalysis: { roast: [...], strengths: [...], ... }
│   └── timestamp: "2024-01-15T10:30:00.000Z"
└── another-site.com (document)
    └── ...
```

## ✅ Testing the Setup

1. Start your development server: `npm run dev`
2. Visit a website analysis page (e.g., `http://localhost:3000/example.com`)
3. Wait for the analysis to complete
4. Check your Firebase console - you should see a new document in the `website_roasts` collection
5. Refresh the page - it should load instantly with a "✨ Loaded from cache" message

## 🚀 Benefits

- **Instant Loading**: Cached results load in milliseconds
- **Cost Savings**: Reduces API calls to Exa and Anthropic
- **Better UX**: Users get immediate results on repeat visits

## 🛠️ Troubleshooting

### Common Issues:

1. **"Firebase not initialized" error**: Check your environment variables are correctly set
2. **Permission denied**: Ensure Firestore rules allow read/write access
3. **Network error**: Check if your Firebase project is active and billing is enabled (if required)

### Debug Mode:
Check the browser console for Firebase-related logs. The app logs all Firebase operations for debugging.

---

That's it! Your Firebase caching is now set up and ready to speed up your Roast My Website application! 🎉
