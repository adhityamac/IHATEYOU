---
description: Complete App Refinement Implementation Plan
---

# IHATEYOU App Refinement - Implementation Roadmap

## Phase 1: Critical UX Fixes (Immediate)

### 1.1 Auto-Hide Header & Dock on Scroll
**Files to modify:**
- `src/app/page.tsx` - Update scroll handler to hide header/dock universally
- `src/components/shared/Dock.tsx` - Add scroll-based visibility logic
- `src/features/chat/components/MessagesSection.tsx` - Ensure scroll events propagate

**Implementation:**
```typescript
// Add to all scrollable sections:
const [showUI, setShowUI] = useState(true);
const lastScrollY = useRef(0);

const handleScroll = (e) => {
  const currentScrollY = e.currentTarget.scrollTop;
  if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
    setShowUI(false); // Hide on scroll down
  } else if (currentScrollY < lastScrollY.current) {
    setShowUI(true); // Show on scroll up
  }
  lastScrollY.current = currentScrollY;
};
```

### 1.2 Messages Section Redesign
**Current Issues:**
- Bottom/top bars don't hide
- No profile/call/video buttons visible
- Layout doesn't match Instagram UX

**Solution:**
- Move to full-screen chat layout
- Add Instagram-style header with profile pic, call, video, info buttons
- Make input bar sticky at bottom with proper z-index
- Add swipe-to-back gesture for mobile

### 1.3 Mobile Responsiveness
**Files to modify:**
- `src/app/globals.css` - Add mobile-specific utilities
- `src/app/mobile.css` - Enhance existing mobile styles
- All component files - Add responsive Tailwind classes

**Key Changes:**
- Use `h-screen` instead of fixed heights
- Add `touch-action` CSS for better mobile scrolling
- Implement viewport-relative units (vh, vw)
- Add `will-change` for animated elements

### 1.4 Performance Optimization
**Causes of Lag:**
- Heavy animations on mobile
- Too many re-renders
- Large bundle size
- Unoptimized images

**Solutions:**
- Add `React.memo()` to expensive components
- Use `useMemo()` and `useCallback()` for heavy computations
- Lazy load images with Next.js Image component
- Reduce motion on mobile with `prefers-reduced-motion`
- Debounce scroll handlers

## Phase 2: Feature Enhancements

### 2.1 Light Mode Implementation
**Files to create/modify:**
- `src/contexts/ThemeContext.tsx` - Add light/dark toggle
- `src/app/globals.css` - Define light mode CSS variables
- All components - Use theme-aware colors

**Color Palette (Light Mode):**
```css
:root[data-theme="light"] {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --accent: #FF6B6B;
  --border: #E0E0E0;
}
```

### 2.2 Enhanced Echo Bot (Headspace-style AI)
**Files to modify:**
- `src/lib/bots/echo.ts` - Upgrade response logic
- `src/features/wellness/components/SoulGuide.tsx` - Improve UI

**Features to add:**
- Emotion detection from user messages
- Contextual responses based on mood
- Guided meditation suggestions
- Check-in reminders
- Empathetic conversation flow

### 2.3 Settings Overhaul
**New Settings Sections:**
1. **Account** - Name, email, phone, ghost name, avatar
2. **Privacy** - Who can message, online status, read receipts
3. **Notifications** - Push, email, in-app preferences
4. **Appearance** - Theme (dark/light/retro), font size, animations
5. **Data & Storage** - Clear cache, download data, delete account
6. **Help & Support** - FAQ, contact, terms, privacy policy

**Files to create:**
- `src/features/settings/components/AccountSettings.tsx`
- `src/features/settings/components/PrivacySettings.tsx`
- `src/features/settings/components/NotificationSettings.tsx`
- `src/features/settings/components/AppearanceSettings.tsx`
- `src/features/settings/components/DataSettings.tsx`

### 2.4 Remove Unused Features
**Files to delete/modify:**
- Remove camera/stories functionality
- Remove social feed (keep only chat + emotional check-in)
- Simplify navigation to: Home, Messages, Music, Soul Guide, Settings

## Phase 3: Special Features

### 3.1 Retro Theme
**Inspiration:** 90s/2000s nostalgia, cassette tapes, pixel art, neon colors

**Design Elements:**
- Pixelated fonts (Press Start 2P)
- CRT screen effect overlay
- Cassette tape UI elements
- Retro color palette (cyan, magenta, yellow)
- Scanline animations
- VHS-style glitch effects

**Files to create:**
- `src/components/themes/RetroTheme.tsx`
- `src/styles/retro.css`

### 3.2 Real User Preparation
**Database Schema Updates:**
- User profiles with real data
- Conversation persistence
- Message delivery status
- Online presence tracking
- Push notification tokens

**Files to modify:**
- `src/lib/firebase/chat.ts` - Add real-time listeners
- `src/lib/firebase/users.ts` - User management
- `src/hooks/usePresence.ts` - Online status tracking

## Implementation Order

**Week 1:**
1. Fix Messages Section layout ✓
2. Implement auto-hide header/dock ✓
3. Mobile responsiveness fixes ✓
4. Performance optimization ✓

**Week 2:**
5. Light mode implementation
6. Enhanced Echo bot
7. Settings overhaul
8. Remove unused features

**Week 3:**
9. Retro theme creation
10. Real user support
11. Testing & bug fixes
12. Deployment

## Testing Checklist

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test with slow network (3G)
- [ ] Test with multiple users
- [ ] Test all gestures (swipe, pinch, tap)
- [ ] Test light/dark mode switching
- [ ] Test retro theme
- [ ] Performance audit (Lighthouse)

## Notes

- Focus on chat + emotions (core value)
- Keep UI minimal and fast
- Prioritize mobile experience
- Make it feel personal and intimate
- Add delightful micro-interactions
- Ensure accessibility (a11y)
