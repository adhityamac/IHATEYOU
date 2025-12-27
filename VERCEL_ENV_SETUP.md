# 🔐 Vercel Environment Variables Setup

## Copy these EXACT variables to Vercel:

When you're on the Vercel "Configure Project" page, click "Environment Variables" and add each of these:

### How to Add:
1. Click "Add" or "New Variable"
2. Copy the KEY (left side)
3. Paste it in the "Name" field
4. Copy the VALUE from your .env.local file
5. Paste it in the "Value" field
6. Click "Add"
7. Repeat for all variables below

---

## Required Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

---

## Where to Find the Values:

**Option 1:** Open your `.env.local` file in VS Code and copy the values

**Option 2:** Go to Firebase Console:
1. https://console.firebase.google.com
2. Select your project
3. Click the gear icon → Project settings
4. Scroll down to "Your apps"
5. Click the web app icon
6. Copy the config values

---

## Example Format:

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: your-project.firebaseapp.com

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: your-project-id

... and so on
```

---

## After Adding All Variables:

1. Click "Deploy" button
2. Wait 2-3 minutes
3. You'll get a live URL!
4. Test your app

---

## 🎯 Quick Checklist:

- [ ] Opened Vercel (https://vercel.com/login)
- [ ] Signed in with GitHub
- [ ] Clicked "Add New" → "Project"
- [ ] Found and imported "IHATEYOU"
- [ ] Added all 7 environment variables
- [ ] Clicked "Deploy"
- [ ] Waited for deployment to finish
- [ ] Got live URL
- [ ] Tested the app

---

**Need help?** Just tell me where you're stuck!
