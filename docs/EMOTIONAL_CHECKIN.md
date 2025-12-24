# Emotional Check-In Social App

## Overview
A mobile-first, emotionally aware social app where users don't "post content" — they check in emotionally and let posts emerge from mood. The UI feels calm but raw, expressive without being childish, premium and intentional.

## Core Philosophy

> **"You're allowed to feel this without performing it."**

- **Emotion > Engagement**
- **Silence is allowed**
- **Fewer actions, deeper meaning**
- **No validation metrics**

## Emotional Check-In System

### 12 Core Emotions (Social-Mapped)

Each emotion reflects a social state, not just a feeling:

1. **Calm** - "Quiet, but not at peace."
2. **Joyful** - "Light feels possible today."
3. **Detached** - "Here, but not really."
4. **Overthinking** - "Stuck in loops again."
5. **Drained** - "Running on empty."
6. **Lonely** - "Surrounded, still alone."
7. **Invisible** - "No one sees me today."
8. **Confident** - "I know who I am."
9. **Anxious** - "Everything feels too much."
10. **Hurt** - "Still processing the ache."
11. **Numb** - "Feeling nothing at all."
12. **Angry** - "Fire beneath the surface."

### Emotion Representation

Each emotion has:
- **Abstract shape** (circle, blob, square, triangle, rounded)
- **Muted pastel color** (no gradients)
- **Minimal face** (eyes + mouth only)
- **Emotional sentence** (contextual, honest)

### Color Palette

**Muted Pastels:**
- Calm: `#A8C5E0` (soft blue)
- Joyful: `#F5A8C8` (soft pink)
- Detached: `#B8B8C8` (gray-purple)
- Overthinking: `#C8A8E8` (lavender)
- Drained: `#A8B8C8` (muted blue-gray)
- Lonely: `#8898B8` (deep blue-gray)
- Invisible: `#98A8B8` (steel blue)
- Confident: `#F8C888` (warm amber)
- Anxious: `#E8B898` (peachy tan)
- Hurt: `#E8A898` (soft coral)
- Numb: `#A8A8A8` (neutral gray)
- Angry: `#E89888` (muted red)

## UI Components

### Check-In Grid
- **Layout**: 3-4 columns (adaptive)
- **Spacing**: 16px gaps
- **Interaction**:
  - Tap → expands slightly
  - Selected → soft glow
  - Others → fade to 40% opacity
- **No bounce, no noise, no gamification**

### Hero Card (Daily Emotional Anchor)

**Structure:**
- Full-width card
- 28px border radius
- Soft inner shadow (embedded feel)

**Content:**
- Top: "Today's state" label
- Center: Selected emotion name (large, colored)
- Middle: Emotional sentence in quotes
- Bottom: Two action buttons
  - Primary: "Post from this mood"
  - Secondary: "Just check in"

### Feed (Emotion-Based, Not Chronological)

**Post Cards:**
- Mood icon (top-left)
- Username (subtle, muted)
- Post content (relaxed line height)
- Timestamp (small, muted)

**Resonance Actions (No Counters):**
- "I feel this"
- "I see you"
- "Same space"

### Bottom Navigation

**Floating pill design:**
- Icons only (no labels)
- Home, Feed, Create, Messages, Profile
- Active state: subtle glow
- Fixed at bottom with backdrop blur

## Design System

### Colors
- **Background**: `#0D0D0F` (near-black)
- **Cards**: `#1A1A1E` (deep charcoal)
- **Text Primary**: `rgba(255, 255, 255, 0.92)`
- **Text Secondary**: `rgba(255, 255, 255, 0.65)`
- **Text Muted**: `rgba(255, 255, 255, 0.42)`

### Typography
- **Emotion names**: Bold, calm, human
- **Sentences**: Relaxed line height (1.6-1.7)
- **No playful fonts**
- **Font**: SF Pro Display / Inter

### Shadows
- **Soft**: `0 4px 16px rgba(0, 0, 0, 0.2)`
- **Inner**: `inset 0 2px 8px rgba(0, 0, 0, 0.15)`
- **Glow**: `0 0 20px rgba(255, 255, 255, 0.1)`

### Border Radius
- **Cards**: 28px
- **Emotions**: 20px
- **Pills**: 9999px (fully rounded)

## Interaction Patterns

### Emotion Selection
1. User taps emotion icon
2. Icon scales to 1.05x with soft glow
3. Other icons fade to 40% opacity
4. Hero card appears with animation
5. Emotional sentence displays
6. Action buttons become available

### Post Creation (Contextual)
When "Post from this mood" is tapped:
- Post UI inherits emotion color
- Caption prompts adapt to emotion:
  - "What made you feel this way?"
  - "Say it without explaining."
  - "You don't owe clarity."

### Feed Interaction
- No like counts
- No follower numbers
- No engagement metrics
- Only resonance actions
- Posts sorted by emotional relevance, not time

## Mobile Optimization

### Layout Rules
- **Single-column only**
- **Thumb-zone optimized**
- **Bottom nav in reach**
- **Hero card always visible**
- **Generous padding** (24px)

### Touch Targets
- Minimum 44x44px
- Comfortable spacing
- No accidental taps

### Animations
- **Subtle only**
- **0.2-0.3s duration**
- **Ease-in-out timing**
- **No bounce effects**

## UX Principles

### What We DON'T Do
❌ Gamification  
❌ Engagement metrics  
❌ Loud animations  
❌ Harsh contrasts  
❌ Neon colors  
❌ Performance pressure  

### What We DO
✅ Emotional honesty  
✅ Calm interactions  
✅ Meaningful resonance  
✅ Safe expression  
✅ No judgment  
✅ Silence is valid  

## Files Created

1. **`globals.css`** - Emotional design system
2. **`EmotionalCheckIn.tsx`** - Main check-in interface
3. **`EMOTIONAL_CHECKIN.md`** - This documentation

## Key Features

- **12 emotions** with unique shapes and colors
- **Hero card** that changes based on selected emotion
- **Emotional feed** with resonance actions instead of likes
- **Bottom navigation** with floating pill design
- **No metrics** - no follower counts, no like counts
- **Contextual posting** - posts inherit emotional context
- **Mobile-first** - optimized for thumb-zone interaction

## The Experience

Users feel:
- **Seen, not judged**
- **Allowed to be silent**
- **Free to express without performing**
- **Connected through resonance, not validation**

This isn't a platform for content creation.  
It's a space for emotional existence.
