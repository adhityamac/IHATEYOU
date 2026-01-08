# 🏠 3D Sanctuary Dashboard

## Overview
The 3D Sanctuary is an immersive, interactive dashboard experience that transforms your wellness app into a cozy attic bedroom where each element represents a different feature of the application.

## Features

### 🎮 Interactive 3D Environment
- **Full 3D Room Model**: A beautifully rendered wooden attic bedroom
- **Interactive Hotspots**: Glowing orbs positioned throughout the room
- **Camera Controls**: 
  - Drag to rotate the view
  - Scroll to zoom in/out
  - Auto-rotation for ambient movement

### 🎯 Hotspot Locations

Each glowing orb in the room corresponds to a different app section:

| Location | Feature | Color | Description |
|----------|---------|-------|-------------|
| 🛏️ Bed | Daily Check-In | Purple (#c4b5fd) | Track your mood & emotions |
| 💻 Computer | Messages | Yellow (#fde047) | Neural Link conversations |
| 📚 Left Shelf | Wellness Hub | Pink (#fda4af) | Self-care tools |
| 📖 Books | Journal | Purple (#a78bfa) | Guided reflection |
| 💡 String Lights | Streak Tracker | Green (#bef264) | Your daily streak |
| 🌱 Plant (Right) | Soul Guide | Blue (#93c5fd) | AI Companion |
| 🪟 Window | Vision Board | Teal (#5eead4) | Dream Pixels |
| 🎯 Floor Center | Discovery | Orange (#fdba74) | Find resonance |

### 🔄 Toggle Between Modes

You can switch between 2D and 3D modes using the toggle button in the header:
- **2D View**: Traditional dashboard with cards and widgets
- **3D Sanctuary**: Immersive 3D room experience

The toggle button only appears when you're on the Dashboard section.

## Technical Implementation

### Components
- **Dashboard3D.tsx**: Main 3D dashboard component
- **AtticRoom**: 3D model loader using React Three Fiber
- **InteractiveHotspot**: Clickable glowing orbs with hover effects
- **Scene**: Three.js scene setup with lighting and camera

### Technologies Used
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for R3F
- **Three.js**: 3D graphics library
- **Framer Motion**: Animations for UI overlays
- **GLB Model**: 3D model format for the attic room

### File Structure
```
src/
├── components/
│   └── shared/
│       ├── Dashboard.tsx (2D)
│       └── Dashboard3D.tsx (3D)
├── app/
│   └── page.tsx (Main app with toggle)
└── public/
    └── attic-room.glb (3D model)
```

## User Experience

### Loading State
- Displays a loading screen while the 3D model loads
- Animated spinner with "Loading Your Sanctuary" message

### Instructions
Bottom overlay shows:
- 🟣 Drag to rotate
- 🔴 Scroll to zoom
- 🌹 Click orbs to navigate

### Legend
Top-right corner displays a legend showing:
- Which room elements correspond to which features
- Color-coded for easy identification

## Performance Considerations

- **Model Preloading**: GLB model is preloaded for faster initial load
- **Scene Cloning**: Model is cloned to avoid instance conflicts
- **Optimized Lighting**: Balanced ambient, directional, and point lights
- **Tone Mapping**: ACES Filmic for better color reproduction

## Future Enhancements

Potential improvements:
- [ ] Add animations to room objects (e.g., swaying plants, flickering lights)
- [ ] Implement day/night cycle
- [ ] Add ambient sounds
- [ ] Create custom 3D models for each feature
- [ ] Add particle effects
- [ ] Implement VR support
- [ ] Add more interactive elements (clickable objects)
- [ ] Seasonal themes (winter, spring, summer, fall)

## Accessibility

- Keyboard navigation support
- Screen reader friendly labels
- Alternative 2D mode always available
- Clear visual indicators for interactive elements

## Browser Compatibility

Works best on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ Mobile browsers (may have performance limitations)

## Credits

- 3D Model: Wooden Attic Bedroom
- Design Inspiration: Cozy sanctuary concept
- Built with: React Three Fiber ecosystem
