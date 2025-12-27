# 🧠 Premium "High IQ" Workflows Guide

This document outlines the architectural changes required to elevate **IHATEYOU** from a functional app to a "High IQ" premium experience.

## 1. The "God Mode" Workflow (Command Palette) ⌘K

**The Philosophy:**
High-end apps (Linear, Raycast, VS Code) prioritize keyboard efficiency. Users should never have to lift their hands from the keyboard to perform common actions.

**The Workflow:**
1. User presses `Cmd+K` (Mac) or `Ctrl+K` (Windows).
2. A modal appears instantly with a search bar.
3. User types "Dark" -> Selects "Theme: Dark Mode".
4. User types "Echo" -> Jumps straight to Echo conversation.

### Implementation Strategy

Install `cmdk` (the best library for this):
`npm install cmdk`

**Proposed Component Structure (`src/components/CommandMenu.tsx`):**

```tsx
import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle with Keyboard Shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    }
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => router.push('/messages')}>
            💬 Go to Messages
          </Command.Item>
          <Command.Item onSelect={() => router.push('/settings')}>
            ⚙️ Go to Settings
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => toggleTheme('dark')}>
            🌙 Switch to Dark Mode
          </Command.Item>
          <Command.Item onSelect={() => toggleTheme('light')}>
            ☀️ Switch to Light Mode
          </Command.Item>
          <Command.Item onSelect={() => triggerLogout()}>
            🚪 Log Out
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
```

---

## 2. Optimistic UI (Perceived Performance)

**The Philosophy:**
The app should never make the user wait for the server. If I click "Send", it should show as sent *immediately*. If the server fails 2 seconds later, *then* show an error.

**The Workflow:**
1. User types message and hits Enter.
2. **IMMEDIATELY:** Append message to local React state (UI updates instantly).
3. **BACKGROUND:** Send request to Firestore.
4. **SYNC:** When Firestore listener fires, it reconciles the ID.

### Implementation Strategy

Modify `useChat.ts` to include a temporary local state.

```typescript
const sendMessage = async (text: string) => {
  const tempId = Date.now().toString();
  
  // 1. Optimistic Update
  setMessages(prev => [...prev, {
    id: tempId,
    text,
    senderId: currentUser.uid,
    timestamp: new Date(),
    status: 'sending' // Show a little hollow checkmark
  }]);

  try {
    // 2. Actual Network Request
    await addDoc(collection(db, 'messages'), { text, ... });
  } catch (error) {
    // 3. Rollback on failure
    setMessages(prev => prev.filter(m => m.id !== tempId));
    toast.error("Failed to send");
  }
};
```

---

## 3. Skeleton Loading Screens

**The Philosophy:**
Spinners draw attention to the fact that the user is waiting. Skeleton screens (gray pulsing bars) mimic the content structure, making the app feel like it's "rendering" rather than "fetching".

**The Workflow:**
1. User opens "Messages".
2. Instead of a center spinner, they see 5 gray rectangles where user rows will be.
3. As data arrives, the gray rectangles cross-fade into real user rows.

**CSS Class for Skeleton (Tailwind):**
```tsx
<div className="animate-pulse flex space-x-4">
  <div className="rounded-full bg-slate-700 h-10 w-10"></div>
  <div className="flex-1 space-y-6 py-1">
    <div className="h-2 bg-slate-700 rounded"></div>
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-4">
        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
      </div>
    </div>
  </div>
</div>
```

---

## 4. Contextual "Toast" Notifications

**The Philosophy:**
Alerts (`window.alert`) are disruptive and "low IQ". Toasts are non-blocking, stackable, and auto-dismissing.

**Use Cases:**
- "Settings saved" (Success, Green)
- "Lost connection" (Error, Red)
- "New message from Echo" (Info, Blue)

**Recommendation:** Use `sonner` or `react-hot-toast` for beautiful, stacked notifications that don't block the user's workflow.