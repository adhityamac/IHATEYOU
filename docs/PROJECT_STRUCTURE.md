# 🏗️ Project Structure Documentation

## Overview
This document describes the new, organized structure of the IHATEYOU application after the comprehensive restructuring completed on December 24, 2025.

## 📁 Directory Structure

```
ihateyou/
├── .agent/                      # Agent workflows and automation
│   └── workflows/
├── docs/                        # All documentation files
│   ├── auth/
│   ├── firebase/
│   ├── features/
│   └── deployment/
├── public/                      # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── backgrounds/        # Visual effect components
│   │   │   ├── EmojiDoodleBackground.tsx
│   │   │   ├── InteractiveGrid.tsx
│   │   │   ├── LiquidBackground.tsx
│   │   │   ├── NeuralAura.tsx
│   │   │   └── SpiralBackground.tsx
│   │   ├── shared/             # Shared/global components
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── CursorContext.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dock.tsx
│   │   │   ├── GradientThemeProvider.tsx
│   │   │   ├── NeuralAudio.tsx
│   │   │   ├── NeuralNotifications.tsx
│   │   │   ├── SearchSection.tsx
│   │   │   ├── SettingsSection.tsx
│   │   │   ├── SoundProvider.tsx
│   │   │   ├── SynapseMap.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   └── UnifiedHome.tsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── Breadcrumbs.tsx
│   │       ├── DynamicInfoBox.tsx
│   │       ├── LoadingAnimation.tsx
│   │       ├── Magnetic.tsx
│   │       ├── ScrollProgress.tsx
│   │       └── Typewriter.tsx
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/                   # Mock data and constants
│   │   ├── emojiPack.ts
│   │   └── mockData.ts
│   ├── features/               # Feature-based modules
│   │   ├── auth/
│   │   │   └── components/
│   │   │       ├── AuthScreen.tsx
│   │   │       ├── LoadingScreen.tsx
│   │   │       ├── LoginScreen.tsx
│   │   │       ├── OnboardingFlow.tsx
│   │   │       └── SplashScreen.tsx
│   │   ├── chat/
│   │   │   └── components/
│   │   │       ├── ChatSequence.tsx
│   │   │       ├── MessageBubble.tsx
│   │   │       ├── MessageInput.tsx
│   │   │       ├── MessageReactions.tsx
│   │   │       ├── MessageSearch.tsx
│   │   │       ├── MessagesSection.tsx
│   │   │       ├── ReadReceipt.tsx
│   │   │       ├── TypingIndicator.tsx
│   │   │       └── VoiceMessage.tsx
│   │   ├── games/
│   │   │   └── components/
│   │   │       ├── FunZone.tsx
│   │   │       ├── MemoryGame.tsx
│   │   │       ├── ReactionGame.tsx
│   │   │       └── TicTacToe.tsx
│   │   ├── social/
│   │   │   └── components/
│   │   │       ├── EmojiReactionPicker.tsx
│   │   │       ├── HashtagFeed.tsx
│   │   │       ├── Leaderboard.tsx
│   │   │       ├── SocialHub.tsx
│   │   │       ├── TrendingPosts.tsx
│   │   │       └── UserRecommendations.tsx
│   │   └── wellness/
│   │       └── components/
│   │           ├── BreathingExercise.tsx
│   │           ├── DailyAffirmations.tsx
│   │           ├── EmotionalCheckIn.tsx
│   │           ├── JournalPrompts.tsx
│   │           ├── MoodInsights.tsx
│   │           ├── SoulGuide.tsx
│   │           └── WellnessSection.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAlgorithm.ts
│   │   ├── useDarkMode.ts
│   │   ├── useGradientTheme.ts
│   │   ├── useSignals.ts
│   │   └── useTheme.ts
│   ├── lib/                    # Utilities and services
│   │   ├── algorithm/
│   │   │   ├── decisions.ts
│   │   │   ├── index.ts
│   │   │   ├── interpreter.ts
│   │   │   ├── signals.ts
│   │   │   └── types.ts
│   │   ├── firebase/
│   │   │   ├── auth.ts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── userService.ts
│   │   ├── firebase.ts
│   │   └── mockData.ts
│   └── types/                  # TypeScript type definitions
│       ├── component-types.ts
│       ├── GradientThemes.ts
│       ├── story-group.ts
│       ├── theme.ts
│       ├── themeMode.ts
│       └── types.ts
├── .env.local                  # Environment variables
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Organization Principles

### 1. **Feature-Based Architecture**
Components are organized by feature domain (auth, chat, wellness, social, games) for better maintainability and scalability.

### 2. **Component Categories**
- **`features/`**: Feature-specific components grouped by domain
- **`components/shared/`**: Components used across multiple features
- **`components/ui/`**: Reusable UI primitives
- **`components/backgrounds/`**: Visual effect components

### 3. **Import Paths**
All imports use absolute paths with the `@/` alias:
```typescript
// ✅ Good
import Dashboard from '@/components/shared/Dashboard';
import AuthScreen from '@/features/auth/components/AuthScreen';
import { useAlgorithm } from '@/hooks/useAlgorithm';

// ❌ Avoid
import Dashboard from '../../components/Dashboard';
```

## 📝 Key Changes from Previous Structure

### Before
```
src/
└── components/  (56 files in one folder)
```

### After
```
src/
├── components/
│   ├── backgrounds/  (5 files)
│   ├── shared/      (14 files)
│   └── ui/          (6 files)
└── features/
    ├── auth/        (5 files)
    ├── chat/        (9 files)
    ├── games/       (4 files)
    ├── social/      (6 files)
    └── wellness/    (7 files)
```

## 🔧 Development Guidelines

### Adding New Components

1. **Feature-Specific Component**
   ```
   src/features/[feature-name]/components/ComponentName.tsx
   ```

2. **Shared Component**
   ```
   src/components/shared/ComponentName.tsx
   ```

3. **UI Primitive**
   ```
   src/components/ui/ComponentName.tsx
   ```

### Import Best Practices

- Always use absolute imports with `@/`
- Group imports by category (external, internal, types)
- Keep imports organized and clean

## 🚀 Benefits

1. **Scalability**: Easy to add new features without cluttering existing code
2. **Maintainability**: Clear separation of concerns
3. **Developer Experience**: Faster file navigation and understanding
4. **Team Collaboration**: Clear ownership and boundaries
5. **Code Reusability**: Shared components are easily identifiable

## 📚 Documentation

All documentation has been moved to the `docs/` directory:
- Authentication docs → `docs/auth/`
- Firebase setup → `docs/firebase/`
- Feature specs → `docs/features/`
- Deployment guides → `docs/deployment/`

## ✅ Verification

The restructuring was completed successfully with:
- ✅ All 56 components moved to organized folders
- ✅ All imports updated to use absolute paths
- ✅ Zero build errors
- ✅ Site functionality preserved
- ✅ UI/UX intact
- ✅ Documentation organized

## 🎉 Result

The project now has a clean, professional structure that will scale well as the application grows!
