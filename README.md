# DSA Progress Tracker

A premium, full-stack DSA tracking application built with Next.js, Prisma, and Supabase.

## Features
- **Modern Auth**: Glassmorphic login with JWT-based sessions.
- **Dynamic Dashboard**: Track your Easy, Medium, and Hard problem stats with visual progress bars.
- **Top 10 Topics**: Organized curriculum (Algorithms, DS, DP, etc.).
- **Subtopic Details**: Direct links to LeetCode, YouTube, and Articles.
- **Real-time Updates**: Toggle status to see instant progress board updates.
- **Topic Mastery**: Visual recognition when a topic is 100% complete.

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Next.js API Routes (TypeScript).
- **Database**: Supabase (PostgreSQL) with Prisma ORM.
- **Styling**: Tailwind CSS for utility-first responsive design.

## Local Setup
1. **Clone the repo.**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**: Create a `.env` file with:
   ```env
   DATABASE_URL="your-supabase-connection-string"
   DIRECT_URL="your-supabase-direct-connection-string"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
4. **Database Migration**:
   ```bash
   npx prisma db push
   ```
5. **Run the App**:
   ```bash
   npm run dev
   ```