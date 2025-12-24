---
description: Complete project restructuring plan
---

# Project Restructuring Plan

## Phase 1: Create New Folder Structure
1. Create feature-based directories
2. Create organized component folders
3. Create docs folder for markdown files

## Phase 2: Move Components (with import updates)
1. Auth components → `src/features/auth/components/`
2. Chat components → `src/features/chat/components/`
3. Wellness components → `src/features/wellness/components/`
4. Social components → `src/features/social/components/`
5. Games → `src/features/games/components/`
6. UI components → `src/components/ui/`
7. Backgrounds → `src/components/backgrounds/`
8. Shared → `src/components/shared/`

## Phase 3: Consolidate Types & Hooks
1. Move types to feature folders
2. Move hooks to feature folders
3. Keep shared types/hooks in root

## Phase 4: Clean Up Root
1. Move all MD files to `docs/` folder
2. Organize by category

## Phase 5: Update All Imports
1. Update page.tsx imports
2. Update component cross-references
3. Create barrel exports (index.ts files)

## Phase 6: Verify & Test
1. Check TypeScript compilation
2. Test dev server
3. Verify UI works correctly
