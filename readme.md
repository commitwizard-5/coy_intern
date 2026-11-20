# Coy Discover — SDE Intern Assignment

A standalone, privacy-first Discover prototype and engineering presentation built for the Coy SDE Intern assignment. Explore profiles, like or pass with 60 FPS gesture physics, and see a match only when interest is mutual.

## What’s inside

- **Discover Experience:** Animated, draggable profile cards, desktop Like/Pass controls, keyboard arrows, feed buffer pagination, loading and retry states.
- **Mutual Matches:** Real-time celebration overlay with confetti, spring pop-in physics, and responsive grid of mutual matches on `/matches`.
- **Privacy Architecture:** Feed and match responses use strict DTO projection; unilateral likes and secret hashes are never leaked to the client.
- **Backend & Data Integrity:** Next.js App Router route handlers, Prisma, SQLite, atomic transactional writes (`prisma.$transaction`), and uniqueness constraints.
- **Demo Data:** 32 curated seed profiles with 7 pre-seeded mutual likes for immediate evaluation.
- **Walkthrough & Proposals:** Dedicated engineering walkthrough, interactive 3D technical showcase, and two detailed feature proposals (Zero-Knowledge Crush Vault & Campus Micro-Cohorts Radar).

---

## Quick Start

You can start the entire project with a single command:

### On Windows:
Double-click `run.bat` or run:
```powershell
.\run.ps1
```

### Manual Setup:
```bash
cd coy-discover
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000/home](http://localhost:3000/home) or [http://localhost:3000/discover](http://localhost:3000/discover).

---

## API Architecture

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/feed?limit=10&offset=0` | Returns unswiped candidate profiles with stable pseudo-random pagination |
| `POST` | `/api/swipe` | Records a `LIKE` or `PASS`; atomically checks and creates mutual match |
| `POST` | `/api/feed` | Resets all swipes and matches for testing without CLI commands |
| `GET` | `/api/matches` | Lists confirmed mutual matches, newest first |
| `GET` | `/api/me` | Returns current user profile for mutual match overlay celebration |

---

## Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & ChainGPT-inspired Dark Cyberpunk Design System
- **Animations:** Framer Motion (60 FPS gesture springs, drag physics)
- **Database & ORM:** Prisma ORM with SQLite
- **Security:** HMAC-SHA256 blind handshakes, token-bucket in-memory rate limiting
