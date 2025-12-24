# 🎯 Firebase Setup - Quick Start

## ✅ What You Need to Do

### 1. Follow the Setup Guide
Open and follow: **`FIREBASE_SETUP_GUIDE.md`**

It has detailed step-by-step instructions with screenshots descriptions.

### 2. Create Your `.env.local` File

After completing the Firebase Console setup, create `.env.local` in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

Replace `your-actual-*` with values from Firebase Console.

### 3. Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 4. Test Google Sign-In

1. Go to http://localhost:3000
2. Complete splash screen
3. Click "Enter the Void" on emoji grid
4. Click "Continue with Google"
5. Sign in with your Google account
6. Complete onboarding

If it works → Firebase is connected! ✅

---

## 📋 Checklist

- [ ] Created Firebase project
- [ ] Enabled Google Sign-In
- [ ] Created Firestore database
- [ ] Created `.env.local` with your config
- [ ] Restarted dev server
- [ ] Tested Google Sign-In

---

## 🆘 Need Help?

See **`FIREBASE_SETUP_GUIDE.md`** for:
- Detailed instructions
- Troubleshooting
- Security rules
- Next steps

---

## 🚀 After Setup

Once Firebase is working, we'll implement:
1. ✅ Real authentication (Google, Phone, Email)
2. ✅ User profiles in Firestore
3. ✅ Real-time chat
4. ✅ Mood tracking
5. ✅ Feed with real posts

Let me know when you're ready for the next step!
