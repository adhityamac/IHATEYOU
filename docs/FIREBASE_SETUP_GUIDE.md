# 🔥 Firebase Setup Guide for IHATEYOU

## 📋 Prerequisites
- Google account
- 5-10 minutes

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
👉 **Open**: https://console.firebase.google.com/

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"**
2. **Project name**: `ihateyou` (or any name you prefer)
3. Click **Continue**
4. **Google Analytics**: Toggle OFF (we don't need it yet)
5. Click **Create project**
6. Wait for project creation (~30 seconds)
7. Click **Continue**

✅ **Checkpoint**: You should now see your Firebase project dashboard

---

## 🌐 Step 2: Register Web App

### 2.1 Add Web App to Project
1. In the Firebase Console, click the **Web icon** `</>` (next to iOS and Android icons)
2. **App nickname**: `ihateyou-web`
3. **Firebase Hosting**: Leave UNCHECKED (we're using Vercel)
4. Click **Register app**

### 2.2 Copy Configuration
You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "ihateyou-xxxxx.firebaseapp.com",
  projectId: "ihateyou-xxxxx",
  storageBucket: "ihateyou-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**📝 COPY THESE VALUES** - You'll need them in Step 6!

Click **Continue to console**

✅ **Checkpoint**: You have your Firebase config values

---

## 🔐 Step 3: Enable Authentication

### 3.1 Navigate to Authentication
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**

### 3.2 Enable Google Sign-In
1. Click the **"Sign-in method"** tab
2. Find **"Google"** in the list
3. Click **"Google"**
4. Toggle **"Enable"** to ON
5. **Project support email**: Select your email from dropdown
6. Click **"Save"**

✅ **Status**: Google Sign-In ✅ Enabled

### 3.3 Enable Email/Password (Optional)
1. Click **"Email/Password"**
2. Toggle **"Enable"** to ON
3. Click **"Save"**

✅ **Status**: Email/Password ✅ Enabled

### 3.4 Enable Phone Authentication (Optional - for later)
1. Click **"Phone"**
2. Toggle **"Enable"** to ON
3. Click **"Save"**

⚠️ **Note**: Phone auth requires additional setup (reCAPTCHA). We'll do this later.

✅ **Checkpoint**: Authentication methods enabled

---

## 🗄️ Step 4: Create Firestore Database

### 4.1 Navigate to Firestore
1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**

### 4.2 Choose Location
1. **Location**: Choose closest to you (e.g., `asia-south1` for India, `us-central1` for US)
2. Click **"Next"**

### 4.3 Security Rules
1. Select **"Start in test mode"** (we'll add proper rules later)
2. Click **"Create"**
3. Wait for database creation (~30 seconds)

⚠️ **Important**: Test mode allows all reads/writes for 30 days. We'll add security rules soon!

✅ **Checkpoint**: Firestore database created

---

## 📦 Step 5: Enable Storage (Optional - for images/avatars)

### 5.1 Navigate to Storage
1. In the left sidebar, click **"Build"** → **"Storage"**
2. Click **"Get started"**

### 5.2 Security Rules
1. Select **"Start in test mode"**
2. Click **"Next"**

### 5.3 Choose Location
1. Use the **same location** as Firestore
2. Click **"Done"**

✅ **Checkpoint**: Storage enabled

---

## 🔑 Step 6: Configure Your App

### 6.1 Create Environment File
In your project root, create `.env.local`:

```bash
# In terminal (from project root)
# Copy the example file
copy env.example.txt .env.local
```

Or create it manually in VS Code.

### 6.2 Add Your Firebase Config
Open `.env.local` and replace with YOUR values from Step 2.2:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ihateyou-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ihateyou-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ihateyou-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### 6.3 Verify .gitignore
Make sure `.env.local` is in `.gitignore`:

```gitignore
# .gitignore
.env.local
.env*.local
```

✅ **Checkpoint**: Environment variables configured

---

## 🧪 Step 7: Test Firebase Connection

### 7.1 Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### 7.2 Check Browser Console
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for Firebase initialization messages
5. Should see NO errors about Firebase config

### 7.3 Test Google Sign-In
1. Click through to the Auth Screen
2. Click **"Continue with Google"**
3. Should see Google Sign-In popup
4. Sign in with your Google account
5. Should redirect to onboarding

✅ **Success**: If you can sign in with Google, Firebase is working!

---

## 🔒 Step 8: Add Security Rules (IMPORTANT!)

### 8.1 Update Firestore Rules
1. Go to **Firestore Database** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if false;
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read: if isAuthenticated() && 
        request.auth.uid in resource.data.participants;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        request.auth.uid in resource.data.participants;
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read: if isAuthenticated() && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if isAuthenticated();
      }
    }
    
    // Moods collection
    match /moods/{moodId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && isOwner(resource.data.userId);
    }
  }
}
```

3. Click **"Publish"**

### 8.2 Update Storage Rules
1. Go to **Storage** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /images/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

✅ **Checkpoint**: Security rules deployed

---

## 📊 Step 9: Verify Setup Checklist

Check all these:

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Google Sign-In enabled
- [ ] Firestore database created
- [ ] Storage enabled (optional)
- [ ] `.env.local` file created with your config
- [ ] `.env.local` in `.gitignore`
- [ ] Dev server restarted
- [ ] Google Sign-In works in browser
- [ ] Security rules deployed

---

## 🎯 Next Steps

Once all checkboxes are ✅:

1. **Option B**: Implement real authentication
2. **Option C**: Build real-time chat
3. **Phase 3**: Add AI features

---

## 🆘 Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Check `.env.local` file exists
- Restart dev server
- Verify all environment variables are set

### Error: "Firebase: Error (auth/unauthorized-domain)"
1. Go to Firebase Console → Authentication → Settings
2. Add `localhost` and `vercel.app` to authorized domains

### Google Sign-In popup blocked
- Allow popups in browser
- Try incognito mode
- Check browser console for errors

---

## 📝 Important Notes

1. **Never commit `.env.local`** to Git
2. **Test mode expires in 30 days** - security rules prevent this
3. **Keep API keys secret** - but `NEXT_PUBLIC_*` keys are safe for frontend
4. **Use different projects** for dev/staging/production

---

## ✅ You're Done!

Firebase is now set up and ready for real authentication and real-time features!

**Next**: Let's implement real Google Sign-In in your app! 🚀
