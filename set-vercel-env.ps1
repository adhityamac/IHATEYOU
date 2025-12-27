# Set Firebase environment variables in Vercel
Write-Host "Setting Firebase environment variables in Vercel..." -ForegroundColor Cyan

# Using vercel env pull to get project details, then setting vars
$vars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY"             = "AIzaSyC9KnR8qtxCdcYNP_y6m4Qe55a-X93XwRY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"         = "ihateyou-2f7c0.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"          = "ihateyou-2f7c0"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"      = "ihateyou-2f7c0.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "71135129834"
    "NEXT_PUBLIC_FIREBASE_APP_ID"              = "1:71135129834:web:d8e4d9b66475e56df66793"
}

# Create .env.production file
$envContent = ""
foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    $envContent += "$key=$value`n"
}

Set-Content -Path ".env.production" -Value $envContent
Write-Host "Created .env.production file" -ForegroundColor Green

# Also create .env.local for local development
Set-Content -Path ".env.local" -Value $envContent
Write-Host "Created .env.local file" -ForegroundColor Green

Write-Host "`nEnvironment files created successfully!" -ForegroundColor Green
Write-Host "Now commit and redeploy with: git add . && git commit -m 'Add env files' && vercel --prod" -ForegroundColor Yellow
