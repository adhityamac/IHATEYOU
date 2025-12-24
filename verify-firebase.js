// Quick Firebase Connection Verification Script
// This checks if your Firebase credentials are properly configured

const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('🔥 Firebase Configuration Check\n');
console.log('================================\n');

let allConfigured = true;
let hasPlaceholders = false;

requiredEnvVars.forEach(varName => {
    const value = process.env[varName];

    if (!value) {
        console.log(`❌ ${varName}: NOT SET`);
        allConfigured = false;
    } else if (value.includes('demo') || value.includes('your-') || value.includes('123456789')) {
        console.log(`⚠️  ${varName}: Using placeholder/demo value`);
        hasPlaceholders = true;
    } else {
        console.log(`✅ ${varName}: Configured`);
    }
});

console.log('\n================================\n');

if (!allConfigured) {
    console.log('❌ RESULT: Some Firebase environment variables are missing!');
    console.log('\n📝 ACTION NEEDED:');
    console.log('1. Copy env.example.txt to .env.local');
    console.log('2. Get your Firebase config from: https://console.firebase.google.com/');
    console.log('3. Fill in the values in .env.local');
    console.log('4. Restart your dev server\n');
    process.exit(1);
} else if (hasPlaceholders) {
    console.log('⚠️  RESULT: Firebase is using placeholder/demo values!');
    console.log('\n📝 ACTION NEEDED:');
    console.log('1. Go to: https://console.firebase.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Get your real Firebase config values');
    console.log('4. Update .env.local with real values');
    console.log('5. Restart your dev server\n');
    console.log('💡 TIP: Real authentication will NOT work with demo values!\n');
    process.exit(1);
} else {
    console.log('✅ RESULT: All Firebase environment variables are configured!');
    console.log('\n🎉 Your Firebase connection should work!');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Make sure you enabled Google Sign-In in Firebase Console');
    console.log('2. Test the Google Sign-In button in your app');
    console.log('3. Check browser console for any Firebase errors\n');
    process.exit(0);
}
