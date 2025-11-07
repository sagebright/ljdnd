# LJDND Setup Guide

This guide will walk you through setting up the LJDND project from scratch.

## Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A GitHub account (optional, for deployment)
- A Vercel account (optional, for deployment)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in the project details
4. Wait for the project to be provisioned

### 2.2 Get Your Credentials

1. Go to Project Settings > API
2. Copy your Project URL
3. Copy your `anon` public key

### 2.3 Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.4 Run the Database Migration

1. Go to Supabase Dashboard > SQL Editor
2. Open the file `supabase/migrations/20250106000000_initial_schema.sql`
3. Copy all the SQL code
4. Paste it into the SQL Editor in Supabase
5. Click "Run"

This will create all the necessary tables, RLS policies, and functions.

### 2.5 Configure Auth Providers

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Email provider
3. Optionally configure other providers (Google, GitHub, etc.)

## Step 3: Set Up MCP Servers (Optional)

MCP servers enable Claude Code to interact with Supabase, GitHub, and Vercel directly.

### 3.1 Get Your Supabase Access Token

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/account/tokens)
2. Click "Generate New Token"
3. Copy the token

### 3.2 Get Your GitHub Personal Access Token

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Generate and copy the token

### 3.3 Configure MCP

Run the setup script:

```bash
./setup-mcp.sh
```

Or manually edit `.mcp.json` with your tokens:

```json
{
  "mcpServers": {
    "supabase": {
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_token_here"
      }
    },
    "github": {
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

### 5.1 Create Two Test Accounts

1. Go to `/signup`
2. Create your first account
3. Sign out
4. Create a second account (you can use a different browser or incognito mode)

### 5.2 Create a Chat Room

1. Sign in with the first account
2. Go to `/chat`
3. Create a new room and invite the second user

### 5.3 Test Real-time Chat

1. Open the chat room in both browsers
2. Send messages from both accounts
3. Messages should appear in real-time for both users

### 5.4 Test Dice Rolling

1. Click any of the quick roll buttons (d20, d6, etc.)
2. Or use custom notation (e.g., "3d6+2")
3. Dice rolls should appear as special messages with roll details

## Step 6: Run Tests

### Unit Tests (Vitest)

```bash
npm test
```

### E2E Tests (Playwright)

```bash
# Install browsers first (one-time)
npx playwright install

# Run tests
npm run test:e2e
```

## Step 7: Deploy to Vercel (Optional)

### 7.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/sagebright/ljdnd.git
git push -u origin main
```

### 7.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and anon key in `.env.local`
- Check that the migration script ran successfully
- Ensure RLS policies are enabled

### Authentication Not Working

- Check Supabase Auth settings
- Verify email provider is enabled
- Check browser console for errors

### Real-time Updates Not Working

- Ensure Realtime is enabled in Supabase
- Check that the tables are added to the `supabase_realtime` publication
- Verify RLS policies allow SELECT access

### MCP Servers Not Working

- Ensure tokens are correctly set in `.mcp.json`
- Verify the MCP server packages are installed
- Restart Claude Code after updating `.mcp.json`

## Next Steps

- Customize the UI/UX
- Add more dice roll presets
- Implement user invitations system
- Add file/image sharing
- Create character sheets integration
- Add voice/video chat

## Support

For issues, please create a GitHub issue at: https://github.com/sagebright/ljdnd/issues
