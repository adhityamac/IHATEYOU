---
description: Complete roadmap to build IHATEYOU into a real, functional app
---

# IHATEYOU - Real App Implementation Roadmap

## Phase 1: Core Authentication & User Management ⚡ (PRIORITY)

### 1.1 Connect Real Firebase Auth
- [ ] Wire up Google Sign-In button to actual Firebase auth
- [ ] Add auth state persistence
- [ ] Handle auth errors properly
- [ ] Add loading states during auth

### 1.2 User Profile System
- [ ] Save user data to Firestore on signup
- [ ] Load user profile from Firestore on login
- [ ] Save onboarding data (ghostName, moodBaseline, intent) to Firestore
- [ ] Create user profile page

### 1.3 Session Management
- [ ] Persist auth state across refreshes
- [ ] Auto-login if session exists
- [ ] Proper logout functionality
- [ ] Handle token refresh

**Files to modify:**
- `src/features/auth/components/AuthScreen.tsx` - Connect Google button
- `src/contexts/AuthContext.tsx` - Add real Firebase integration
- `src/lib/firebase/auth.ts` - Already has functions, just need to use them

---

## Phase 2: Real-Time Chat System 💬

### 2.1 Firestore Chat Schema
```
conversations/
  {conversationId}/
    participants: [userId1, userId2]
    createdAt: timestamp
    lastMessage: {text, timestamp, senderId}
    
    messages/
      {messageId}/
        senderId: string
        content: string
        timestamp: timestamp
        isRead: boolean
        reactions: []
```

### 2.2 Chat Functionality
- [ ] Create new conversations in Firestore
- [ ] Send messages to Firestore
- [ ] Real-time message listeners (onSnapshot)
- [ ] Mark messages as read
- [ ] Add reactions to messages
- [ ] Delete messages
- [ ] Message search

### 2.3 Presence System
- [ ] Online/offline status using Firestore
- [ ] "Typing..." indicators
- [ ] Last seen timestamps

**Files to create:**
- `src/lib/firebase/chat.ts` - Chat operations
- `src/lib/firebase/presence.ts` - Presence system

**Files to modify:**
- `src/features/chat/components/MessagesSection.tsx`
- `src/features/chat/components/MessageInput.tsx`

---

## Phase 3: User Discovery & Connections 🔍

### 3.1 User Discovery
- [ ] Search users by ghostName
- [ ] Browse random users (discovery feed)
- [ ] View user profiles

### 3.2 Connection System
- [ ] Send connection requests
- [ ] Accept/reject requests
- [ ] Friends list
- [ ] Block users

### 3.3 Firestore Schema
```
users/
  {userId}/
    ghostName: string
    avatar: string
    bio: string
    connections: [userId1, userId2]
    blockedUsers: [userId]
    
connectionRequests/
  {requestId}/
    from: userId
    to: userId
    status: 'pending' | 'accepted' | 'rejected'
    timestamp: timestamp
```

**Files to create:**
- `src/lib/firebase/users.ts` - User operations
- `src/lib/firebase/connections.ts` - Connection management
- `src/features/social/components/UserDiscovery.tsx`

---

## Phase 4: Echo Bot Integration 🤖

### 4.1 Echo Bot System
- [ ] Create Echo bot user in Firestore
- [ ] Auto-create conversation with Echo on signup
- [ ] Simple response system (mirrors user messages)
- [ ] Add personality/variations to responses

### 4.2 Future AI Integration
- [ ] Prepare structure for AI API integration
- [ ] Add context awareness
- [ ] Emotional response system

**Files to create:**
- `src/lib/bots/echo.ts` - Echo bot logic

---

## Phase 5: Essential Features 🎯

### 5.1 Notifications
- [ ] In-app notifications for new messages
- [ ] Connection request notifications
- [ ] Push notifications (optional)

### 5.2 Media Support
- [ ] Image upload to Firebase Storage
- [ ] Image messages in chat
- [ ] Voice messages (already have UI)
- [ ] Emoji reactions (already have UI)

### 5.3 Settings & Preferences
- [ ] Save theme preference to Firestore
- [ ] Notification settings
- [ ] Privacy settings
- [ ] Account deletion

**Files to create:**
- `src/lib/firebase/storage.ts` - File uploads
- `src/lib/firebase/notifications.ts` - Notification system

---

## Phase 6: Polish & Production Ready 🚀

### 6.1 Error Handling
- [ ] Network error handling
- [ ] Offline mode
- [ ] Retry logic
- [ ] User-friendly error messages

### 6.2 Performance
- [ ] Message pagination
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Cache management

### 6.3 Security
- [ ] Firestore security rules
- [ ] Input validation
- [ ] Rate limiting
- [ ] XSS protection

### 6.4 Testing
- [ ] Test auth flow
- [ ] Test chat functionality
- [ ] Test on mobile
- [ ] Test offline behavior

---

## Quick Start: What to Build First? 🎬

**Recommended order:**
1. **Connect Google Sign-In** (30 min)
2. **Save user to Firestore** (20 min)
3. **Real-time chat messages** (1-2 hours)
4. **Send/receive messages** (1 hour)
5. **Echo bot** (30 min)
6. **User discovery** (1 hour)

**Total MVP time: ~5-6 hours**

---

## Current Status

- ✅ Firebase configured
- ✅ UI components built
- ✅ Auth functions written
- ❌ Not connected to real data
- ❌ No real-time functionality
- ❌ No data persistence

**Next immediate step: Phase 1.1 - Connect Google Sign-In**
