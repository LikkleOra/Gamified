# 🎮 Gamified Habit Tracker

A gamified habit and productivity tracker with RPG-style mechanics. Turn your daily habits and focus sessions into an epic quest for self-improvement!

## ✨ Features

### 🎯 Core Functionality
- **Habit Tracking**: Create and manage positive/negative habits with customizable difficulty levels
- **Pomodoro Timer**: Focus sessions with customizable work/break durations
- **Daily Tasks**: Recurring tasks with checklist support
- **Todo Management**: One-time tasks with due dates and priority levels
- **Reward System**: Earn gold to purchase custom rewards

### 🎮 Gamification
- **XP System**: Earn experience points for completing habits and Pomodoro sessions
- **Level Progression**: Level up every 1000 XP with celebratory confetti animations
- **Achievement Badges**: Unlock 6+ badges for reaching milestones
  - 🦶 First Step - Complete your first habit
  - 👑 Habit Master - Complete 100 habits
  - 🍅 Focus Novice - Complete 5 Pomodoro sessions
  - 🧘 Focus Guru - Complete 50 Pomodoro sessions
  - 🔥 On Fire - Reach a 7-day streak
  - 🖐️ High Five - Reach Level 5
- **Streak Tracking**: Build daily login streaks
- **HP System**: Negative habits deal damage; death resets progress
- **Gold Economy**: Earn and spend gold on rewards

### 📊 Stats & Progress
- Real-time XP and level tracking
- Daily streak counter
- Session statistics (Pomodoros completed today)
- Focus time tracking
- Achievement progress visualization

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Backend**: [Convex](https://convex.dev/) - Real-time database and serverless functions
- **Authentication**: [Clerk](https://clerk.com/) - User authentication and management
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Date Utils**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Convex account ([sign up free](https://convex.dev/))
- Clerk account ([sign up free](https://clerk.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LikkleOra/Gamified.git
   cd Gamified/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `app` directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Convex
   CONVEX_DEPLOYMENT=...
   NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
   ```

4. **Initialize Convex**
   ```bash
   npx convex dev
   ```
   
   This will:
   - Set up your Convex project
   - Create the database schema
   - Start the Convex dev server

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### First-Time Setup

1. Sign up/login using Clerk authentication
2. Initialize badges (run once in Convex dashboard):
   ```javascript
   api.badges.initializeBadges()
   ```
3. Start creating habits and completing Pomodoros!

## 📁 Project Structure

```
Gamified/
├── app/                          # Next.js app directory
│   ├── app/                      # Route pages
│   │   ├── dashboard/            # Dashboard routes
│   │   │   ├── habits/           # Habits page
│   │   │   ├── pomodoro/         # Pomodoro timer page
│   │   │   └── progress/         # Progress & achievements page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   ├── components/               # React components
│   │   ├── features/             # Feature-specific components
│   │   │   ├── dailies/          # Daily tasks
│   │   │   ├── gamification/     # Badges, level-up modal
│   │   │   ├── habits/           # Habit tracking
│   │   │   ├── pomodoro/         # Pomodoro timer
│   │   │   ├── rewards/          # Reward shop
│   │   │   └── todos/            # Todo management
│   │   ├── layout/               # Layout components
│   │   ├── providers/            # Context providers
│   │   └── ui/                   # Reusable UI components
│   ├── convex/                   # Convex backend
│   │   ├── schema.ts             # Database schema
│   │   ├── users.ts              # User mutations/queries
│   │   ├── habits.ts             # Habit tracking logic
│   │   ├── pomodoro.ts           # Pomodoro sessions
│   │   ├── badges.ts             # Achievement system
│   │   ├── dailies.ts            # Daily tasks
│   │   └── todos.ts              # Todo management
│   ├── lib/                      # Utility functions
│   └── public/                   # Static assets
├── SPRINT_2_SUMMARY.md           # Sprint 2 documentation
├── SPRINT_3_SUMMARY.md           # Sprint 3 documentation
└── README.md                     # This file
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start Next.js development server
npx convex dev       # Start Convex backend server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🎮 How to Use

### Creating Habits
1. Navigate to the Dashboard
2. Click "New Habit" 
3. Set title, difficulty, and frequency
4. Choose positive/negative/both actions
5. Start tracking!

### Pomodoro Timer
1. Go to Pomodoro page
2. Choose mode: Work (25min), Short Break (5min), or Long Break (15min)
3. Click Start
4. Earn XP when work sessions complete!

### Earning Badges
- Complete your first habit → 🦶 First Step
- Reach 7-day streak → 🔥 On Fire
- Complete 5 Pomodoros → 🍅 Focus Novice
- Reach Level 5 → 🖐️ High Five

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically redeploy on every push to main.

### Environment Variables

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`

## 🤝 Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 Development Roadmap

### ✅ Sprint 2: Core Features (Completed)
- Habit tracking with XP rewards
- Pomodoro timer integration
- User stats dashboard
- Real-time data updates

### ✅ Sprint 3: Enhanced Gamification (Completed)
- Badge/Achievement system
- Streak tracking
- Level-up animations
- HP and death penalty system

### 🔜 Sprint 4: Analytics & Insights (Planned)
- Weekly/monthly XP charts
- Habit completion rates
- Pomodoro productivity insights
- Calendar heatmap view
- Streak visualization

### 🔜 Sprint 5: Polish & UX (Planned)
- Onboarding flow
- Habit categories/tags
- Dark/light mode toggle
- Sound effects & notifications
- Badge notification toasts

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Convex](https://convex.dev/)
- Authentication by [Clerk](https://clerk.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ and ☕ by the Gamified team**
