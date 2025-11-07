# LJDND Quick Start Guide

Your LJDND project is fully set up and ready to use!

## ✅ What's Been Configured

- ✅ Next.js 16 project initialized
- ✅ All dependencies installed
- ✅ Supabase connection configured (shared with daggergm)
- ✅ MCP servers configured (Supabase, GitHub, Vercel)
- ✅ GitHub repository created: https://github.com/sagebright/ljdnd
- ✅ Code committed and pushed
- ✅ Dev server tested and working

## 🚀 Next Steps

### 1. Run the Database Migration

**Important:** You need to run the migration to create the LJDND tables in your Supabase database.

See [run-migration.md](run-migration.md) for detailed instructions.

Quick version:
1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ogvbbfzfljglfanceest/sql)
2. Copy contents of `supabase/migrations/20250106000000_initial_schema.sql`
3. Paste and run in SQL Editor

### 2. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Test the Application

1. **Sign Up**: Create two test accounts at `/signup`
2. **Create Room**: Sign in with first account, create a chat room
3. **Join Room**: Sign in with second account (different browser/incognito)
4. **Chat**: Send messages between both accounts
5. **Roll Dice**: Try the dice roller buttons (d20, d6, etc.)

### 4. Run Tests

```bash
# Unit tests
npm test

# E2E tests (install browsers first)
npx playwright install
npm run test:e2e
```

## 🔧 Configuration Files

All configuration files are in place:

- `.env.local` - Environment variables (Supabase credentials)
- `.mcp.json` - MCP server configuration (gitignored)
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS v4 configuration
- `vitest.config.ts` - Vitest test configuration
- `playwright.config.ts` - Playwright E2E test configuration

## 📁 Project Structure

```
ljdnd/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── chat/              # Chat interface
│       ├── page.tsx       # Room list
│       └── [roomId]/      # Chat room
├── components/
│   ├── auth/              # Auth forms
│   └── chat/              # Chat components
├── lib/
│   ├── dice.ts            # Dice rolling logic
│   └── supabase/          # Supabase clients
├── supabase/migrations/   # Database schema
├── test/ & tests/         # Unit & E2E tests
└── types/                 # TypeScript types
```

## 🔑 Key Features

1. **Authentication**: Email/password signup and login
2. **Real-time Chat**: Live updates using Supabase Realtime
3. **Dice Rolling**: D&D dice with common presets and custom notation
4. **Persistent Storage**: All data stored in Postgres
5. **Secure**: Row Level Security policies on all tables
6. **Tested**: Unit tests (Vitest) and E2E tests (Playwright)

## 🐛 Troubleshooting

### Dev server won't start
- Check that `.env.local` exists and has correct Supabase credentials
- Verify no other process is using port 3000

### Authentication not working
- Ensure database migration has been run
- Check Supabase Auth is enabled in dashboard
- Verify RLS policies are enabled

### Real-time not working
- Ensure Realtime is enabled in Supabase project settings
- Check that tables are added to `supabase_realtime` publication
- Verify RLS policies allow SELECT access

## 📚 Documentation

- [README.md](README.md) - Full project overview
- [SETUP.md](SETUP.md) - Detailed setup instructions
- [run-migration.md](run-migration.md) - Database migration guide

## 🚢 Ready to Deploy?

When you're ready to deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Add environment variables from `.env.local`
4. Deploy!

---

**Note:** This project shares the Supabase database with daggergm. The tables are separate and won't conflict.

**Repository:** https://github.com/sagebright/ljdnd
