# 🚀 Deployment Workflow - IHATEYOU

## The Simple Truth
**You code locally → Push to GitHub → Vercel auto-deploys → Done!**

No manual Firebase updates. No Vercel config changes. Just code and push.

---

## 📋 One-Time Setup (Already Done!)

### 1. GitHub Repository
```bash
git init
git remote add origin https://github.com/yourusername/ihateyou.git
```

### 2. Vercel Connection
- Connected to your GitHub repo
- Auto-deploys on every push to `main` branch
- Environment variables already set

### 3. Firebase Configuration
- `.env.local` for local development
- `.env.production` for production (Vercel uses this)
- Firestore rules deployed once

---

## 🔄 Daily Development Workflow

### Step 1: Code Locally
```bash
# Start dev server
npm run dev

# Make your changes
# Test at http://localhost:3000
```

### Step 2: Commit Changes
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Added Command Menu (⌘K) feature"

# Push to GitHub
git push origin main
```

### Step 3: Wait for Deployment
```bash
# Vercel automatically:
# ✅ Detects the push
# ✅ Installs dependencies
# ✅ Builds the app
# ✅ Deploys to production
# ✅ Sends you a notification

# Time: ~2-3 minutes
```

### Step 4: Verify
```bash
# Check your live site
https://ihateyou.vercel.app

# Or check Vercel dashboard
https://vercel.com/dashboard
```

---

## 🎯 Common Scenarios

### Adding a New Feature
```bash
# 1. Code it locally
# 2. Test it works
npm run dev

# 3. Push to GitHub
git add .
git commit -m "Added new feature"
git push

# 4. Vercel deploys automatically
# Done! ✅
```

### Installing New Package
```bash
# 1. Install locally
npm install cmdk

# 2. Use it in your code
# 3. Push to GitHub
git add .
git commit -m "Added cmdk for command palette"
git push

# 4. Vercel runs npm install automatically
# Done! ✅
```

### Updating Firebase Rules
```bash
# 1. Edit firestore.rules locally
# 2. Deploy rules
firebase deploy --only firestore:rules

# 3. Code changes still go through Git
git add .
git commit -m "Updated Firestore security rules"
git push

# Done! ✅
```

### Fixing a Bug
```bash
# 1. Fix the bug locally
# 2. Test it works
# 3. Push
git add .
git commit -m "Fixed: Echo bot avatar not showing"
git push

# 4. Live in 2 minutes
# Done! ✅
```

---

## 🔥 Advanced: Preview Deployments

### Feature Branch Workflow
```bash
# Create a feature branch
git checkout -b feature/command-menu

# Make changes and push
git add .
git commit -m "WIP: Command menu"
git push origin feature/command-menu

# Vercel creates a preview URL:
# https://ihateyou-git-feature-command-menu.vercel.app

# Test the preview
# If good, merge to main:
git checkout main
git merge feature/command-menu
git push

# Production updates automatically
```

---

## 📊 Deployment Status

### Check Deployment Status
1. Go to https://vercel.com/dashboard
2. See all deployments
3. Click any deployment to see:
   - Build logs
   - Preview URL
   - Deployment time
   - Errors (if any)

### Get Notifications
- Vercel emails you on every deployment
- Success ✅ or Failure ❌
- Click link to see details

---

## 🛠️ Environment Variables

### Local Development (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
# ... etc
```

### Production (Vercel Dashboard)
1. Go to Project Settings
2. Environment Variables
3. Add/Edit variables
4. Redeploy to apply changes

**Note:** Already set up! You don't need to touch these unless adding new services.

---

## 🚨 Troubleshooting

### Build Failed on Vercel
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Environment variables

# Fix locally, then push again
git add .
git commit -m "Fixed build error"
git push
```

### Firebase Not Working in Production
```bash
# Check environment variables in Vercel
# Make sure they match .env.production

# Redeploy if needed:
# Vercel Dashboard → Deployments → Redeploy
```

### Want to Rollback
```bash
# Vercel Dashboard → Deployments
# Find previous working deployment
# Click "..." → "Promote to Production"
# Done in 10 seconds!
```

---

## 📈 Best Practices

### 1. Commit Often
```bash
# Small, focused commits
git commit -m "Added tangerine avatar to Echo bot"
git commit -m "Fixed Twisted Void theme performance"
git commit -m "Added Command Menu component"
```

### 2. Test Locally First
```bash
# Always test before pushing
npm run dev
# Click around, test features
# Then push
```

### 3. Use Descriptive Messages
```bash
# Good ✅
git commit -m "Fixed: White screen blinking on mouse move"

# Bad ❌
git commit -m "fix stuff"
```

### 4. Check Vercel Dashboard
```bash
# After pushing, check:
# https://vercel.com/dashboard
# Make sure deployment succeeds
```

---

## 🎉 Summary

### What You Do:
1. Code locally
2. `git push`
3. Wait 2 minutes

### What Happens Automatically:
1. Vercel detects push
2. Installs packages
3. Builds app
4. Deploys to production
5. Firebase stays connected
6. Users see updates

### What You DON'T Do:
- ❌ Manually update Vercel
- ❌ Manually update Firebase
- ❌ FTP files anywhere
- ❌ Configure servers
- ❌ Worry about scaling

---

## 🔗 Quick Links

- **Live Site:** https://ihateyou.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com
- **GitHub Repo:** https://github.com/yourusername/ihateyou

---

## 💡 Pro Tip

Set up this alias for super-fast deploys:

```bash
# Add to your terminal profile (.bashrc or .zshrc)
alias deploy="git add . && git commit -m 'Update' && git push"

# Now just type:
deploy

# And everything updates! 🚀
```

---

**Last Updated:** December 27, 2025
**Status:** ✅ Fully Automated
