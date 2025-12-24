# PowerShell Migration Script
# This script moves components and updates imports automatically

$migrations = @{
    # Auth Components
    "src\components\AuthScreen.tsx" = "src\features\auth\components\AuthScreen.tsx"
    "src\components\LoginScreen.tsx" = "src\features\auth\components\LoginScreen.tsx"
    "src\components\OnboardingFlow.tsx" = "src\features\auth\components\OnboardingFlow.tsx"
    "src\components\SplashScreen.tsx" = "src\features\auth\components\SplashScreen.tsx"
    "src\components\LoadingScreen.tsx" = "src\features\auth\components\LoadingScreen.tsx"
    
    # Chat Components
    "src\components\MessagesSection.tsx" = "src\features\chat\components\MessagesSection.tsx"
    "src\components\MessageBubble.tsx" = "src\features\chat\components\MessageBubble.tsx"
    "src\components\MessageInput.tsx" = "src\features\chat\components\MessageInput.tsx"
    "src\components\MessageReactions.tsx" = "src\features\chat\components\MessageReactions.tsx"
    "src\components\MessageSearch.tsx" = "src\features\chat\components\MessageSearch.tsx"
    "src\components\TypingIndicator.tsx" = "src\features\chat\components\TypingIndicator.tsx"
    "src\components\VoiceMessage.tsx" = "src\features\chat\components\VoiceMessage.tsx"
    "src\components\ReadReceipt.tsx" = "src\features\chat\components\ReadReceipt.tsx"
    "src\components\ChatSequence.tsx" = "src\features\chat\components\ChatSequence.tsx"
    
    # Wellness Components
    "src\components\EmotionalCheckIn.tsx" = "src\features\wellness\components\EmotionalCheckIn.tsx"
    "src\components\MoodInsights.tsx" = "src\features\wellness\components\MoodInsights.tsx"
    "src\components\WellnessSection.tsx" = "src\features\wellness\components\WellnessSection.tsx"
    "src\components\BreathingExercise.tsx" = "src\features\wellness\components\BreathingExercise.tsx"
    "src\components\DailyAffirmations.tsx" = "src\features\wellness\components\DailyAffirmations.tsx"
    "src\components\JournalPrompts.tsx" = "src\features\wellness\components\JournalPrompts.tsx"
    "src\components\SoulGuide.tsx" = "src\features\wellness\components\SoulGuide.tsx"
    
    # Social Components
    "src\components\SocialHub.tsx" = "src\features\social\components\SocialHub.tsx"
    "src\components\HashtagFeed.tsx" = "src\features\social\components\HashtagFeed.tsx"
    "src\components\TrendingPosts.tsx" = "src\features\social\components\TrendingPosts.tsx"
    "src\components\UserRecommendations.tsx" = "src\features\social\components\UserRecommendations.tsx"
    "src\components\Leaderboard.tsx" = "src\features\social\components\Leaderboard.tsx"
    "src\components\EmojiReactionPicker.tsx" = "src\features\social\components\EmojiReactionPicker.tsx"
    
    # Games Components
    "src\components\FunZone.tsx" = "src\features\games\components\FunZone.tsx"
    "src\components\MemoryGame.tsx" = "src\features\games\components\MemoryGame.tsx"
    "src\components\ReactionGame.tsx" = "src\features\games\components\ReactionGame.tsx"
    "src\components\TicTacToe.tsx" = "src\features\games\components\TicTacToe.tsx"
    
    # UI Components
    "src\components\Breadcrumbs.tsx" = "src\components\ui\Breadcrumbs.tsx"
    "src\components\DynamicInfoBox.tsx" = "src\components\ui\DynamicInfoBox.tsx"
    "src\components\LoadingAnimation.tsx" = "src\components\ui\LoadingAnimation.tsx"
    "src\components\ScrollProgress.tsx" = "src\components\ui\ScrollProgress.tsx"
    "src\components\Typewriter.tsx" = "src\components\ui\Typewriter.tsx"
    "src\components\Magnetic.tsx" = "src\components\ui\Magnetic.tsx"
    
    # Background Components
    "src\components\LiquidBackground.tsx" = "src\components\backgrounds\LiquidBackground.tsx"
    "src\components\SpiralBackground.tsx" = "src\components\backgrounds\SpiralBackground.tsx"
    "src\components\InteractiveGrid.tsx" = "src\components\backgrounds\InteractiveGrid.tsx"
    "src\components\EmojiDoodleBackground.tsx" = "src\components\backgrounds\EmojiDoodleBackground.tsx"
    "src\components\NeuralAura.tsx" = "src\components\backgrounds\NeuralAura.tsx"
    
    # Shared Components
    "src\components\Dashboard.tsx" = "src\components\shared\Dashboard.tsx"
    "src\components\UnifiedHome.tsx" = "src\components\shared\UnifiedHome.tsx"
    "src\components\Dock.tsx" = "src\components\shared\Dock.tsx"
    "src\components\SearchSection.tsx" = "src\components\shared\SearchSection.tsx"
    "src\components\SettingsSection.tsx" = "src\components\shared\SettingsSection.tsx"
    "src\components\CustomCursor.tsx" = "src\components\shared\CustomCursor.tsx"
    "src\components\CursorContext.tsx" = "src\components\shared\CursorContext.tsx"
    "src\components\GradientThemeProvider.tsx" = "src\components\shared\GradientThemeProvider.tsx"
    "src\components\ThemeSelector.tsx" = "src\components\shared\ThemeSelector.tsx"
    "src\components\SoundProvider.tsx" = "src\components\shared\SoundProvider.tsx"
    "src\components\NeuralAudio.tsx" = "src\components\shared\NeuralAudio.tsx"
    "src\components\NeuralNotifications.tsx" = "src\components\shared\NeuralNotifications.tsx"
    "src\components\SynapseMap.tsx" = "src\components\shared\SynapseMap.tsx"
    "src\components\EnhancedUserProfile.tsx" = "src\components\shared\EnhancedUserProfile.tsx"
}

Write-Host "Starting component migration..." -ForegroundColor Cyan

foreach ($source in $migrations.Keys) {
    $dest = $migrations[$source]
    if (Test-Path $source) {
        Write-Host "Moving: $source -> $dest" -ForegroundColor Green
        Move-Item -Path $source -Destination $dest -Force
    } else {
        Write-Host "Skipping (not found): $source" -ForegroundColor Yellow
    }
}

Write-Host "`nMigration complete!" -ForegroundColor Cyan
