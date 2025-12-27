#!/bin/bash

# Add Firebase environment variables to Vercel
echo "Adding Firebase environment variables to Vercel..."

# API Key
echo "AIzaSyC9KnR8qtxCdcYNP_y6m4Qe55a-X93XwRY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production --yes

# Auth Domain  
echo "ihateyou-2f7c0.firebaseapp.com" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production --yes

# Project ID
echo "ihateyou-2f7c0" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production --yes

# Storage Bucket
echo "ihateyou-2f7c0.firebasestorage.app" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production --yes

# Messaging Sender ID
echo "71135129834" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production --yes

# App ID
echo "1:71135129834:web:d8e4d9b66475e56df66793" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production --yes

echo "Done! All Firebase environment variables added to Vercel."
