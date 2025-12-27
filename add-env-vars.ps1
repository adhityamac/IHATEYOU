# PowerShell script to add Firebase env vars to Vercel
Write-Host "Adding Firebase environment variables to Vercel..." -ForegroundColor Green

$env:VERCEL_ORG_ID = ""
$env:VERCEL_PROJECT_ID = ""

# Set the variables
$vars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyC9KnR8qtxCdcYNP_y6m4Qe55a-X93XwRY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "ihateyou-2f7c0.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "ihateyou-2f7c0"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "ihateyou-2f7c0.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "71135129834"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:71135129834:web:d8e4d9b66475e56df66793"
}

foreach ($key in $vars.Keys) {
    Write-Host "Adding $key..." -ForegroundColor Yellow
    $value = $vars[$key]
    echo "n`n$value" | vercel env add $key production
}

Write-Host "Done! All variables added." -ForegroundColor Green
Write-Host "Now run: vercel --prod" -ForegroundColor Cyan
