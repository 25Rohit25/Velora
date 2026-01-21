# Velora - Relationship Sanctuary App
**Status:** Phase 1 Complete | Phase 2 In Progress  
**Last Updated:** January 21, 2026

---

## 🌸 What is Velora?

**Velora** is a private, two-person sanctuary designed to preserve intimacy, memories, and emotional closeness — without performance, comparison, or exposure.

Every feature satisfies three core principles:
- **Privacy-first** — No public sharing, no algorithms
- **Emotion-first** — Designed to feel warm, not transactional  
- **Couple-only** — A closed loop between two people

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS Variables |
| Animations | Framer Motion |
| State | Zustand |
| Backend | Supabase (Auth, Database, Realtime, Storage) |
| Icons | Lucide React |
| Fonts | Nunito, Playfair Display, Indie Flower |

---

## ✅ Completed Features

### 🔐 Authentication & Pairing
- Email/Password Sign Up & Sign In
- Profile setup (nickname, avatar)
- Partner pairing via unique "Love Code" (e.g., `LOVE-8821`)
- Real-time partner linking

### 🏠 Home ("Us" Dashboard)
- Dual avatar display with mood sync
- **Mood Selector** — Share how you're feeling in real-time
- **"Thinking of You" Pulse** — Send love with one tap (heart animation)
- **The Fridge (Sticky Note)** — Shared note that syncs in real-time

### 📷 Memory Wall (NEW)
- **Photo Uploads** — Add moments, not just files
- **Photo Frames** — Polaroid, Sticky Tape, Scrapbook, Pastel, Minimal
- **Memory Notes** — "What this moment meant" (not captions)
- **Frame Selection** — Soft, imperfect, human-feeling frames
- No likes, no comments, no reactions

### 📖 Our Diary
- Unified timeline of diary entries AND memories
- Daily prompts integration
- Mood tagging per entry
- Dual-view: Your answers + Partner's answers
- Feels like "something you'll read years later"

### 💬 Velora Chat
- Real-time messaging
- **Touch Actions** — Send hugs (🤗) and kisses (💋)
- Optimistic UI for instant feedback
- Partner presence indicator

### 💡 Ideas for Us (NEW)
- Gentle date suggestions based on mood
- Categories: At Home, Outside, Playful, Reconnect
- No pressure, no reminders, no guilt
- Mood-aware recommendations

---

## 📁 Project Structure

```
velora-app/
├── app/
│   ├── (main)/
│   │   ├── home/         # Us Dashboard
│   │   ├── memories/     # Memory Wall
│   │   ├── chat/         # Private Chat
│   │   ├── journal/      # Our Diary
│   │   ├── ideas/        # Date Suggestions
│   │   └── profile/      # User Settings
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── home/             # MoodSelector, StickyNote
│   ├── memories/         # AddMemoryModal
│   ├── navigation/       # BottomNav
│   └── ui/               # Button, Input
├── store/
│   └── userStore.ts      # Zustand global state
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
└── SUPABASE_SCHEMA.sql   # Database schema
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User data, mood, avatar, partner link |
| `couples` | Links two users, stores sticky note |
| `messages` | Chat history |
| `journal_entries` | Diary entries with prompts |
| `memories` | Memory Wall photos with frames & notes |
| `moods` | Mood history (optional) |

---

## 🚀 Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/25Rohit25/Velora.git
cd velora-app
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Supabase
1. Create a new Supabase project
2. Run the SQL from `SUPABASE_SCHEMA.sql` in SQL Editor
3. Create a Storage bucket named `memories` (public)
4. Enable Realtime for all tables

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Roadmap

### ✅ Phase 1 (Complete)
- [x] Authentication & Pairing
- [x] Home Dashboard with Moods & Pulse
- [x] Memory Wall with Frames
- [x] Our Diary with Timeline
- [x] Velora Chat

### 🔄 Phase 2 (In Progress)
- [x] Ideas for Us (Gentle Date Suggestions)
- [ ] Photo uploads to Chat/Diary
- [ ] Premium frame designs
- [ ] Profile settings & avatar upload

### 📅 Phase 3 (Planned)
- [ ] Memory export (PDF / Video)
- [ ] Push notifications (PWA)
- [ ] Breakup-safe data handling
- [ ] Secure RLS policies for production

---

## 🔒 Privacy Guarantees

- ✅ No content is public
- ✅ No content is indexed
- ✅ No sharing without explicit action
- ✅ All data tied to one couple only
- ✅ API keys stored in `.env.local` (gitignored)

---

## 🎨 Design Philosophy

> *"Velora must always feel like a quiet place where love rests."*

- **Aesthetic:** Soft Luxury, Glassmorphism
- **Colors:** Rose, Cream, Lavender, Slate
- **Typography:** Handwriting for notes, Serif for headers
- **Animations:** Smooth, gentle, never jarring
- **Language:** "Moments" not "Posts", "Notes" not "Captions"

---

## 📄 License

Private project. Not open source.

---

**Built with 💕 for couples who want to feel closer.**
