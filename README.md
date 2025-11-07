# LJDND - D&D Chat & Dice Roller

A real-time chat application for D&D sessions with integrated dice rolling functionality.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS
- **Backend**: Supabase (Postgres, Auth, Realtime)
- **Dice Rolling**: @dice-roller/rpg-dice-roller
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel

## Features

1. Real-time chat between two authenticated users
2. D&D dice rolling with results recorded in chat
3. Persistent chat history
4. Shared chat rooms

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Get your Supabase access token from your account settings
4. Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Configure MCP Servers

The project uses MCP (Model Context Protocol) servers for Supabase, GitHub, and Vercel integration.

Update `.mcp.json` with your credentials:

```json
{
  "mcpServers": {
    "supabase": {
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_supabase_access_token"
      }
    },
    "github": {
      "env": {
        "GITHUB_TOKEN": "your_github_personal_access_token"
      }
    }
  }
}
```

**Getting tokens:**

- **Supabase Access Token**: [Supabase Dashboard](https://supabase.com/dashboard/account/tokens) > Account > Access Tokens
- **GitHub Token**: [GitHub Settings](https://github.com/settings/tokens) > Developer Settings > Personal Access Tokens > Tokens (classic)
  - Required scopes: `repo`, `workflow`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Vitest unit tests
- `npm run test:ui` - Run Vitest with UI
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run Playwright with UI

## Project Structure

```
ljdnd/
├── app/              # Next.js app directory
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
├── lib/             # Utility functions and Supabase client
├── .mcp.json        # MCP server configuration (gitignored)
└── .env.local       # Environment variables (gitignored)
```

## Next Steps

The basic project structure is set up. Next we need to:

1. Create the Supabase database schema (tables for chat rooms, messages, dice rolls)
2. Configure Supabase Auth
3. Build the authentication flow
4. Create the chat interface with real-time updates
5. Implement dice rolling functionality
6. Add tests
7. Deploy to Vercel

## License

ISC
