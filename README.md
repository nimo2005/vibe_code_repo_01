# DayLog - Personal Daily Activity Log

A simple, private daily activity log/report app built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Authentication**: Email/password auth via Supabase
- **Daily Entries**: Create, edit, delete entries with date, title, content, and tags
- **Timeline**: View all entries newest-first with search and tag filtering
- **Calendar**: Monthly view showing days with entries
- **Private**: All data is scoped to the logged-in user via Row Level Security

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Supabase (Auth + Postgres)
- Tailwind CSS
- date-fns for date formatting
- Deployed on Vercel

## Getting Started

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. Go to Settings → API and copy:
   - Project URL
   - Anon (public) key

### 2. Run the Database Migration

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the migration

This creates:
- `entries` table with RLS policies
- Indexes for performance
- Auto-updating `updated_at` trigger

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install Dependencies & Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in Vercel
3. Add the same environment variables in Vercel Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Authenticated routes
│   │   ├── layout.tsx   # App layout with Nav
│   │   ├── page.tsx     # Timeline (home)
│   │   ├── new/         # New entry page
│   │   ├── calendar/    # Calendar view
│   │   └── entry/[id]/  # View/edit entry
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Tailwind imports
├── components/
│   ├── Nav.tsx          # Navigation bar
│   ├── EntryForm.tsx    # Entry create/edit form
│   ├── EntryItem.tsx    # Single entry in list
│   ├── EntryList.tsx    # Filterable entry list
│   ├── Calendar.tsx     # Month calendar
│   └── ConfirmDialog.tsx# Delete confirmation
├── lib/
│   ├── supabase/
│   │   ├── client.ts    # Browser Supabase client
│   │   └── server.ts    # Server Supabase client
│   ├── auth.ts          # Auth helpers
│   └── db.ts            # Database queries
├── types/
│   └── index.ts         # TypeScript types
├── middleware.ts        # Auth middleware
supabase/
└── schema.sql           # Database migration
```

## Environment Variables for Vercel

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

## License

MIT