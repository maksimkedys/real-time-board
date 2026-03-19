# Real-Time Collaborative Board

A real-time collaborative project management board built with Next.js, Supabase, and TypeScript.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix UI)
- **Drag & Drop**: @hello-pangea/dnd
- **State**: React hooks
- **Validation**: Zod
- **Testing**: Jest + Testing Library
- **Language**: TypeScript (strict mode)

## Features

- **Boards & Columns** — Create, edit, delete boards and columns with inline renaming
- **Card Management** — Add cards with title, description, due dates; edit via detail modal with activity history
- **Drag & Drop** — Drag cards between columns and reorder columns with optimistic updates and conflict resolution
- **Real-Time Sync** — Live updates across multiple browser tabs/users via Supabase Realtime subscriptions
- **Presence Indicators** — See who is currently viewing the board in real-time
- **Workspaces** — Multi-workspace support with switcher, create/manage workspaces
- **Workspace Members** — Invite and manage workspace members
- **Card Assignees** — Assign workspace members to cards
- **Authentication** — Sign up, sign in, forgot password with Supabase Auth + OAuth callback
- **Profile Settings** — Update display name and avatar
- **Dark / Light Mode** — Theme toggle with next-themes
- **Input Validation** — Zod schemas for all API inputs, forms, and server queries
- **Row-Level Security** — Workspace isolation via Supabase RLS policies

## Project Structure

```
src/
├── app/              # Next.js App Router pages & layouts
│   ├── (auth)/       # Auth pages (sign-in, sign-up, forgot-password, callback)
│   ├── (main)/       # Main app pages (boards, settings)
│   └── providers/    # Theme provider
├── entities/         # Server-side data access (board, session, workspace queries)
├── features/         # Feature modules
│   ├── auth/         # Auth actions (server actions with Zod validation)
│   ├── boards/       # Board hooks & UI (columns, cards, drag-drop, modals)
│   ├── settings/     # Profile settings
│   ├── theme-toggle/ # Dark/light mode toggle
│   └── workspaces/   # Workspace switcher & members
├── shared/           # Shared code
│   ├── api/          # Supabase client/server helpers
│   ├── lib/          # Utilities (cn)
│   ├── schemas/      # Zod validation schemas (auth, board, workspace)
│   ├── types/        # TypeScript types (generated from Supabase schema)
│   └── ui/           # shadcn/ui components
└── widgets/          # Layout widgets (header, sidebar)
```

## Getting Started

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `yarn dev`           | Start development server                 |
| `yarn build`         | Production build                         |
| `yarn start`         | Start production server                  |
| `yarn lint`          | Run ESLint                               |
| `yarn test`          | Lint + type-check + unit tests           |
| `yarn test:unit`     | Run Jest unit tests                      |
| `yarn test:watch`    | Run tests in watch mode                  |
| `yarn test:coverage` | Run tests with coverage report           |
| `yarn type-check`    | TypeScript type checking                 |
| `yarn format`        | Format code with Prettier                |
