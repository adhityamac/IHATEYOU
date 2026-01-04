# 🔮 Enhanced Emotional Check-In: Secret Hints System

## Overview
The emotional check-in now has a **progressive hint system** that helps users discover hidden easter eggs/puzzles without spoiling the mystery.

---

## 🎯 The Three Secrets

### 1. 🌑 **The Gate**
- **Trigger**: Click emotions in sequence: `Overwhelmed → Lonely → Calm`
- **Meaning**: An emotional journey from chaos, through isolation, to peace
- **Reward**: Opens a glitch terminal mode with Echo messages
- **Discovery**: Tracked in `discoveredSecrets` array

### 2. 🌅 **The Midnight Sun**
- **Trigger**: Select "Hopeful" emotion between 11 PM - 1 AM
- **Reward**: Special message: "✨ The sun speaks when the world sleeps. You found it. ✨"
- **Hint**: During daytime, if hint level ≥ 2, shows: "Waiting for the sunrise... but what if you looked at midnight?"

### 3. 🎮 **The Quiet World**
- **Trigger**: Click the archetype text 5 times quickly (in Profile tab)
- **Reward**: Opens "Her World" game
- **Existing**: Already implemented, just added to hint system

---

## 💡 Progressive Hint System

### Hint Levels (Based on Visit Count)
```
Visit 1-2:   Level 0 - No hints
Visit 3-6:   Level 1 - Vague hints appear
Visit 7-13:  Level 2 - More specific hints
Visit 14+:   Level 3 - Direct instructions (if not discovered)
```

### Visual Indicators

#### 1. **Hint Button** (Top Right)
- Appears after 3+ visits
- 💡 icon
- Yellow pulse dot when Level 3 unlocked
- Click to open "Hidden Frequencies" overlay

#### 2. **Sequence Progress Feedback**
- When clicking emotions in partial sequence:
  - 1/3 correct: "Something stirs in the void..."
  - 2/3 correct: "The static grows louder. One more step."
- Appears as purple notification below emotion description

#### 3. **Visual Glow on Sequence Emotions**
- At Level 3, `Empty`, `Numb`, and `Lonely` have subtle purple glow
- Helps guide users to the correct emotions

#### 4. **Secret Counter**
- Bottom right corner
- Shows: "🔓 X/3 Secrets Found"
- Only appears after discovering at least one secret

---

## 🎨 Hint Overlay UI

### "Hidden Frequencies" Modal
Displays all three secrets with progressive information:

**Level 1:**
- Shows secret names only
- Vague poetic hints

**Level 2:**
- More specific clues
- Time/location hints

**Level 3:**
- Exact instructions (if not yet discovered)
- Checkmarks for discovered secrets

### Example Progression:

#### The Gate (Level 1)
> "An emotional journey, when walked in order, opens hidden doors..."

#### The Gate (Level 2)
> "An emotional journey, when walked in order, opens hidden doors..."
> "From chaos, through darkness, to peace."

#### The Gate (Level 3, Not Discovered)
> "An emotional journey, when walked in order, opens hidden doors..."
> "From chaos, through darkness, to peace."
> "Try: Overwhelmed → Lonely → Calm"

#### The Gate (Discovered)
> "An emotional journey, when walked in order, opens hidden doors..."
> "✓ Discovered!"

---

## 🔧 Technical Implementation

### State Management
```tsx
const [hintLevel, setHintLevel] = useState(0);
const [discoveredSecrets, setDiscoveredSecrets] = useState<string[]>([]);
const [showHintOverlay, setShowHintOverlay] = useState(false);
```

### LocalStorage Tracking
- `checkin_visits`: Increments each time component mounts
- Used to determine hint level

### Sequence Detection
```tsx
const getSequenceHint = () => {
    const recent = clickSequence.slice(-3).join(',');
    const progress = SEQUENCE_ARRAY.filter((step, i) => 
        clickSequence.slice(-3)[i] === step
    ).length;
    
    if (progress === 1) return "Something stirs in the void...";
    if (progress === 2) return "The static grows louder. One more step.";
    return null;
};
```

---

## 🎁 User Experience Flow

### First-Time User (Visits 1-2)
- No hints visible
- Pure discovery mode
- Secrets are completely hidden

### Curious User (Visits 3-6)
- 💡 button appears
- Vague poetic hints in overlay
- Encourages exploration

### Engaged User (Visits 7-13)
- More specific hints
- "Hopeful" shows midnight hint during day
- Sequence emotions start to stand out

### Dedicated User (Visits 14+)
- Full instructions revealed (if not discovered)
- Purple glow on sequence emotions
- Clear path to all secrets

---

## 🚀 Future Enhancements

1. **More Secrets**: Add additional hidden layers
2. **Achievement System**: Badges for discovering all secrets
3. **Time-Limited Secrets**: Special events on specific dates
4. **Shared Secrets**: Multiplayer puzzles
5. **Reward System**: Unlock themes/features for discoveries

---

## 📝 Notes for Your Girlfriend

The hint system is designed to:
- **Not spoil** the magic of discovery
- **Guide gently** if she's stuck
- **Celebrate** when she finds something
- **Track progress** so she knows what's left to find

The system respects the player's journey while ensuring nothing is permanently hidden.
