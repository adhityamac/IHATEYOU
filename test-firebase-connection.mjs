// Test Firebase Connection
import { readFileSync } from 'fs';

console.log('🔥 Firebase Connection Test\n');
console.log('================================\n');

// Read .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const envLines = envContent.split('\n');

const config = {};
envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        config[key.trim()] = value.trim();
    }
});

const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allGood = true;

required.forEach(key => {
    if (!config[key]) {
        console.log(`❌ ${key}: MISSING`);
        allGood = false;
    } else if (config[key].includes('your-') || config[key].includes('demo')) {
        console.log(`⚠️  ${key}: Placeholder value`);
        allGood = false;
    } else {
        const masked = config[key].substring(0, 10) + '...';
        console.log(`✅ ${key}: ${masked}`);
    }
});

console.log('\n================================\n');

if (allGood) {
    console.log('✅ Firebase credentials are configured!\n');
    console.log('📋 Next Steps:');
    console.log('1. Restart your dev server');
    console.log('2. Open http://localhost:3001');
    console.log('3. Try Google Sign-In');
    console.log('4. Check browser console for errors\n');
} else {
    console.log('❌ Firebase credentials need attention!\n');
}
