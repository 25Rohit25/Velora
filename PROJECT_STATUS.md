# Velora Project Status & Documentation
**Date:** January 21, 2026
**Status:** MVP (Minimum Viable Product) Core Phase Complete
**Completion Estimate:** ~80%

## 1. Project Overview
**Velora** is a private "relationship sanctuary" app designed for couples to foster intimacy, connection, and shared memory-keeping. Unlike social media, it is a closed loop between two people.

## 2. Technology Stack
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 + Vanilla CSS Variables
*   **Animations:** Framer Motion (Advanced physics & transitions)
*   **State Management:** Zustand (Global user/partner store)
*   **Backend & Database:** Supabase (PostgreSQL, Auth, Realtime)
*   **Icons:** Lucide React
*   **Utilities:** date-fns, clsx, tailwind-merge

## 3. Completed Features

### 🔐 Authentication & Onboarding
*   **Supabase Auth:** Email/Password Sign Up & Sign In.
*   **Profile Setup:** Users can set a nickname and avatar URL.
*   **Pairing System:**
    *   User A generates a unique "Love Code" (e.g., `LOVE-8821`).
    *   User B enters the code to link accounts instantly.
    *   Database creates a `couples` record and links both `profiles`.

### 🏠 "Us" Dashboard (Home Page)
*   **Real-time Avatars:** Displays both partners with connection status.
*   **Mood Sync:**
    *   Users can select their current mood (Happy, Tired, Flirty, etc.).
    *   Updates appear instantly on the partner's screen.
*   **"Thinking of You" Pulse:**
    *   A single-tap action to send a vibration/heart visual to the partner.
    *   Includes a giant full-screen heart animation when received.
*   **The Fridge (Sticky Note):**
    *   A shared sticky note on the home screen.
    *   Real-time syncing (updates as one type).
    *   Customizable colors (Yellow, Pink, Blue).
    *   Handwritten font style (`Indie Flower`).
*   **Daily Prompt:**
    *   Daily relationship question (e.g., "Favorite memory?").
    *   Interactive card to answer and share with partner.

### 📖 Shared Journal (Time Capsule)
*   **Timeline View:** A vertical scrolling timeline of shared memories.
*   **Automatic Grouping:** Entries are grouped by date.
*   **Dual View:** Shows both user's and partner's answers side-by-side.
*   **Integrated Workflow:** Answers from the Home Page prompt automatically save here.

### 💬 Velora Chat
*   **Real-time Messaging:** Instant text communication.
*   **Optimistic UI:** Messages appear immediately before server confirmation for a snappy feel.
*   **"Touch" Actions:**
    *   Special non-text buttons (Hug, Kiss).
    *   Renders large animated emojis instead of text bubbles.
*   **Partner Presence:** Header shows partner's avatar and "Connected" status.

## 4. Current Design Language
*   **Aesthetic:** "Soft Luxury" / Glassmorphism.
*   **Palette:** Rose, Cream, Slate, and Pastel accents.
*   **Typography:**
    *   Headings: *Playfair Display* (Serif)
    *   Body: *Nunito* (Rounded Sans)
    *   Notes: *Indie Flower* (Handwriting)
*   **Background:** Dynamic, moving animated blobs (Living Wall).

## 5. Remaining Roadmap (To-Do)
1.  **Media Uploads:**
    *   Allow users to upload photos to Chat and Journal (requires Supabase Storage bucket setup).
2.  **Profile Settings:**
    *   Ability to change password, update avatar image, or unlink partner.
3.  **Push Notifications:**
    *   Integrate actual mobile push notifications (PWA or Native wrap) so users get alerted when not in the app.
4.  **Security Hardening:**
    *   Refine RLS (Row Level Security) policies in Supabase to strictly enforce `couple_id` access control.

## 6. How to Run
```bash
npm run dev
```
Access at `http://localhost:3000`.

## 7. Database Functionality
The app relies on the following Supabase tables:
*   `profiles`: User users data.
*   `couples`: Links two users, stores `sticky_note`.
*   `journal_entries`: Stores prompts and answers.
*   `messages`: Stores chat history.
