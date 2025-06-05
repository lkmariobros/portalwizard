# PortalWizard: Real Estate Transaction Management System

## 1. Project Overview

PortalWizard is a comprehensive real estate transaction management system built on the Better-T-Stack. It features distinct portals for **Agents** and **Admins** to streamline property transaction workflows.

**Core Tenets:**
*   **Dual Portals:**
    *   **Agent Portal:** Enables agents to submit new transactions, upload documents, track status, and manage client information.
    *   **Admin Portal:** Allows administrators to review, approve/reject transactions, manage users (future), and oversee system activity.
*   **Technology Stack (Better-T-Stack):**
    *   **Frontend (`apps/web`):** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix UI), Tanstack Query v5, Tanstack Router, Tanstack Form, Tanstack Table.
    *   **Backend (`apps/server`):** Next.js (Route Handlers for API), tRPC, Bun runtime (target).
    *   **Database:** PostgreSQL (managed via Supabase).
    *   **ORM:** Drizzle ORM.
    *   **Authentication:** Better Auth.
    *   **Monorepo Management:** Turborepo.
*   **Goal:** To provide an MVP (Minimum Viable Product) focused on a robust transaction submission and approval process, with a clean, intuitive UI for both agent and admin users.

## 2. Project Structure

The project is organized as a monorepo using Turborepo:

```
portalwizard/
├── apps/
│   ├── web/  (Next.js Frontend - Agent & Admin Portals)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/ # Next.js App Router
│   │   │   │   ├── (auth)/ # Auth-specific pages (login, signup)
│   │   │   │   ├── agent/  # Agent portal routes & layouts
│   │   │   │   ├── admin/  # Admin portal routes & layouts
│   │   │   │   ├── layout.tsx # Root application layout
│   │   │   │   └── page.tsx   # Root application page
│   │   │   ├── components/ # Shared UI components (shadcn/ui here)
│   │   │   ├── features/   # Feature-specific components (e.g., transaction form)
│   │   │   ├── lib/        # tRPC client, utils, constants
│   │   │   ├── providers/  # React context providers
│   │   │   └── middleware.ts # Auth & role-based route protection
│   │   ├── next.config.mjs
│   │   └── package.json
│   └── server/ (Next.js Backend - tRPC API)
│       ├── src/
│       │   ├── app/
│       │   │   └── trpc/[trpc]/route.ts # tRPC handler (handles /trpc requests)
│       │   ├── db/
│       │   │   ├── migrations/ # Drizzle migration files
│       │   │   ├── schema/     # Drizzle schema definitions (auth.ts, core.ts, index.ts)
│       │   │   ├── index.ts    # Drizzle client instance
│       │   │   └── drizzle.config.ts
│       │   ├── lib/
│       │   │   └── auth.ts # Better Auth initialization
│       │   ├── trpc/
│       │   │   ├── middleware/ # Custom tRPC middlewares
│       │   │   ├── routers/    # tRPC routers (_app.ts, transaction.ts, admin.ts)
│       │   │   └── trpc.ts     # tRPC initialization (context, procedures)
│       ├── next.config.mjs
│       └── package.json
├── packages/
│   ├── config/         # Shared ESLint, TypeScript configurations
│   └── ui/             # (Currently unused, shadcn/ui is in apps/web)
├── .env.example        # Example environment variables
├── .gitignore
├── package.json        # Root pnpm workspace config
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json          # Turborepo configuration
```

**Key Components:** See section `1. Project Overview` for technologies used in each app. The `apps/server/src/db/schema/core.ts` and `apps/server/src/db/schema/index.ts` files are critical for defining and exporting database schemas for transactions and related entities.

## 3. Turborepo Configuration (`turbo.json`)

Turborepo orchestrates tasks across the monorepo. A typical `turbo.json` might look like:

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": [
        "DATABASE_URL",
        "BETTER_AUTH_URL",
        "BETTER_AUTH_SECRET",
        "AUTH_TRUST_HOST",
        "FRONTEND_URL", // Used by server for CORS Access-Control-Allow-Origin
        "NEXT_PUBLIC_APP_URL"
        // Add any other build-time env vars
      ]
    },
    "web#build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": [
        "NEXT_PUBLIC_APP_URL",
        "NEXT_PUBLIC_SERVER_URL"
        // Add specific frontend build-time env vars
      ]
    },
    "server#build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"],
      "env": [
        "DATABASE_URL",
        "BETTER_AUTH_URL",
        "BETTER_AUTH_SECRET",
        "AUTH_TRUST_HOST",
        "FRONTEND_URL" // Used by server for CORS Access-Control-Allow-Origin
        // Add specific backend build-time env vars
      ]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:generate": {
      "cache": false,
      "dependsOn": []
    },
    "db:push": {
      "cache": false,
      "dependsOn": ["db:generate"]
    },
    "clean": {
      "cache": false
    }
  }
}
```
*   `pipeline`: Defines tasks like `build`, `dev`, `lint`.
*   `dependsOn`: Specifies task dependencies (e.g., `^build` means parent package's build).
*   `outputs`: Tells Turborepo what artifacts a task produces for caching.
*   `env` / `passThroughEnv`: Crucial for making environment variables available during Turborepo tasks, especially for Vercel builds. Variables listed in `env` for a task (like `build`) must also be set in the Vercel project settings.

## 4. Environment Variables

Create `.env` files in `apps/server` and `apps/web` (or `apps/web/.env.local`) based on `.env.example`.

**`apps/server/.env`:**
```env
# PostgreSQL Connection String (Supabase)
# Replace [YOUR-PASSWORD] and the project-specific part of the hostname (YOUR_PROJECT_REF).
# Option 1: Use Shared Connection Pooler (supports IPv4/IPv6, recommended for most cases, port 6543)
# DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres"
# Example: DATABASE_URL="postgresql://postgres.drelzxbshewqkaznwhrn:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Option 2: Use Dedicated Connection Pooler (port 6543, if your network supports IPv6 or you purchased IPv4 addon)
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.YOUR_PROJECT_REF.supabase.co:6543/postgres"
# Example: DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.drelzxbshewqkaznwhrn.supabase.co:6543/postgres"

# Note on Supabase Pooler Modes & Drivers:
# - Supabase offers connection poolers (recommended) and direct database connections.
# - Pooler URLs typically use port 6543 (Session mode by default) or 5432 (Transaction mode by default).
# - Session Mode is generally more flexible and recommended for most applications with Drizzle ORM.
# - Transaction Mode has limitations regarding prepared statements. While 'node-postgres' (the driver this project uses) 
#   doesn't rely heavily on prepared statements by default with Drizzle, ensure thorough testing if Transaction Mode is chosen.
# - For this project (using 'node-postgres'), the shared pooler (Option 1) or dedicated pooler (Option 2) in Session Mode (port 6543) is advisable.
# Select ONE of the DATABASE_URL formats above and uncomment/edit it as your actual connection string.
DATABASE_URL="YOUR_CHOSEN_SUPABASE_CONNECTION_STRING"

# Better Auth Configuration
BETTER_AUTH_URL="http://localhost:3000/api/auth" # For local dev; update for production
BETTER_AUTH_SECRET="your-strong-random-secret-for-better-auth-sessions" # Min 32 chars
AUTH_TRUST_HOST="true" # For local dev with HTTP; set to false in production if using HTTPS proxy correctly

# Frontend URL for CORS Access-Control-Allow-Origin header in tRPC responses
# This is used by apps/server/src/app/trpc/[trpc]/route.ts to allow credentialed requests.
FRONTEND_URL="http://localhost:3000" # Frontend URL (e.g., http://localhost:3000 or your production frontend domain); update for production

# Optional: If using primary-after-mutation middleware with separate primary DB URL
# PRIMARY_DATABASE_URL="your-direct-primary-db-connection-string"
```

**`apps/web/.env` or `apps/web/.env.local`:**
```env
# Public URL of this frontend app
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Update for production

# Public URL of the backend server (apps/server)
NEXT_PUBLIC_SERVER_URL="http://localhost:3001" # Update for production

# Optional: If using a third-party service with a public key
# NEXT_PUBLIC_SOME_SERVICE_KEY="your-public-key"
```
**Important:** For Vercel deployments, these variables (excluding `NEXT_PUBLIC_` prefixes for server-side ones) must be configured in the Vercel project's Environment Variables settings.

## 5. Portal Specifics

### 5.1 Agent Portal

The Agent Portal provides functionalities for real estate agents to manage their transactions.

**Key Features Implemented:**
*   **Dashboard:** Displays a list of the agent's 10 most recent transactions.
*   **Live Data:** Fetches transaction data dynamically from the backend via tRPC.
*   **Authentication:** Access to transaction data is protected and specific to the logged-in agent.
*   **Transaction Submission Form:** (Details to be added once fully implemented - allows agents to submit new property transactions.)

**Key Frontend Components (`apps/web`):**
*   **Agent Dashboard Page:** `src/app/agent/page.tsx`
*   **tRPC Client:** `src/lib/trpc.ts` (configured to send credentials for authenticated requests).
*   **Transaction-related hooks and types:** `src/features/transactions/`

### 5.2 Backend Configuration for Agent Portal (`apps/server`)

The backend provides the API and data services for the Agent Portal.

**Key Configurations & Implementations:**
*   **tRPC Routers:**
    *   `src/routers/transactions.ts`: Contains the `getRecentList` procedure to fetch agent-specific transactions. This router is merged into the main `appRouter` (`src/routers/index.ts`).
*   **CORS (Cross-Origin Resource Sharing):**
    *   The tRPC handler at `src/app/trpc/[trpc]/route.ts` is configured to allow cross-origin requests from the frontend (defined by `FRONTEND_URL` env var), including those with credentials (cookies).
*   **Authentication & Authorization:**
    *   tRPC `protectedProcedure` (defined in `src/lib/trpc.ts`) is used for sensitive operations like fetching transactions. It verifies the agent's session from cookies passed in the request headers.
    *   Session context is created in `src/lib/context.ts` using Better Auth.

## 6. Build and Deployment Instructions

**Prerequisites:**
*   Node.js (LTS version)
*   pnpm ( `npm install -g pnpm` )
*   Supabase account & project for PostgreSQL database.

**Local Development:**
1.  **Clone Repository.**
2.  **Install Dependencies:** `pnpm install`
3.  **Setup Environment Variables:** Create `.env` files in `apps/server` and `apps/web` as per section 4. Update `DATABASE_URL` with your Supabase connection string.
4.  **Database Migrations (Drizzle ORM):**
    *   Ensure `apps/server/src/db/schema/core.ts` and `apps/server/src/db/schema/index.ts` are correctly defined with your transaction schemas.
    *   Generate migration files: `pnpm --filter server exec drizzle-kit generate:pg`
    *   Apply migrations to Supabase: `pnpm --filter server exec drizzle-kit migrate`
        *   *(Note: `push:pg` is for rapid prototyping. For production, use `migrate` with generated SQL files.)*
5.  **Run Development Servers:** `pnpm dev`
    *   Frontend (`apps/web`) typically runs on `http://localhost:3000`.
    *   Backend (`apps/server`) typically runs on `http://localhost:3001`.

**Deployment to Vercel:**
PortalWizard typically involves deploying two separate Vercel projects: one for the frontend (`apps/web`) and one for the backend (`apps/server`).

**For `apps/web` (Frontend Vercel Project):**
*   **Connect Git Repository.**
*   **Framework Preset:** Next.js
*   **Root Directory:** `apps/web`
*   **Build Command:** `pnpm build` (or `turbo run build --filter=web...`)
*   **Output Directory:** Vercel usually autodetects `.next` for Next.js projects when the root directory is correctly set.
*   **Environment Variables:**
    *   `NEXT_PUBLIC_APP_URL`: Production URL of this frontend.
    *   `NEXT_PUBLIC_SERVER_URL`: Production URL of your `apps/server` deployment.
    *   Ensure any variables listed in `turbo.json` under `web#build`'s `env` array are set here.

**For `apps/server` (Backend Vercel Project):**
*   **Connect Git Repository.**
*   **Framework Preset:** Next.js
*   **Root Directory:** `apps/server`
*   **Build Command:** `pnpm build` (or `turbo run build --filter=server...`)
*   **Output Directory:** Vercel usually autodetects `.next`.
*   **Environment Variables:**
    *   `DATABASE_URL` (pointing to production Supabase)
    *   `BETTER_AUTH_URL` (production URL of this server's auth endpoint, e.g., `https://your-server-domain.vercel.app/api/auth`)
    *   `BETTER_AUTH_SECRET`
    *   `AUTH_TRUST_HOST="false"` (typically, if Vercel handles SSL termination)
    *   `FRONTEND_URL` (production URL of your `apps/web` deployment, used for CORS `Access-Control-Allow-Origin`)
    *   Ensure any variables listed in `turbo.json` under `server#build`'s `env` array are set here.

**Important for Vercel & Turborepo:**
*   Environment variables defined in the Vercel UI **must** also be listed in the `env` (or `passThroughEnv`) array for the relevant build task in `turbo.json` to ensure Turborepo makes them available during the build process.
*   Ensure `outputs` in `turbo.json` for build tasks correctly point to build artifacts (e.g., `.next/**`).

## 6. Common Development Workflows and Commands

*   **Start all dev servers:** `pnpm dev`
*   **Build all apps:** `pnpm build`
*   **Lint all apps:** `pnpm lint`
*   **Clean all build artifacts:** `pnpm clean`
*   **Generate DB Migrations (server app):** `pnpm --filter server exec drizzle-kit generate:pg`
*   **Apply DB Migrations (server app):** `pnpm --filter server exec drizzle-kit migrate`
*   **Open Drizzle Studio (server app):** `pnpm --filter server exec drizzle-kit studio`

## 7. Key Architectural Decisions & Current Focus (as of 2025-05-15)

*   **Dual Portals in `apps/web`:** Both Agent and Admin portals are served from the single `apps/web` Next.js application, utilizing role-based access control and distinct layouts (`/agent/*`, `/admin/*`).
*   **Shared UI Shell:** The existing dashboard layout (header, responsive sidebar) will be reused for both portals, with navigation items and content tailored per role.
*   **MVP Core:** The primary focus is on implementing the multi-step **Transaction Form** for agents and the corresponding approval/review workflow for admins. This form is central to data input and system functionality.
*   **Database Schemas:**
    *   `users` table (from Better Auth) will be augmented with a `role` column (`agent`, `admin`).
    *   Core schemas (`transactions`, `transactionDocuments`, `transactionStatusHistory`) are defined in `apps/server/src/db/schema/core.ts` to support the transaction workflow. **Ensuring these files are correctly created and migrations run is a prerequisite for feature development.**
*   **Naming Conventions:**
    *   Database (PostgreSQL/Drizzle schema columns): `snake_case`.
    *   TypeScript/JavaScript (variables, functions, object properties): `camelCase`.
    *   API (tRPC inputs/outputs): `camelCase`. Drizzle ORM handles the mapping.
    *   Components (React): `PascalCase`.
    *   File/Directory names: `kebab-case` or as per Next.js conventions (e.g., `page.tsx`).
*   **Tech Choices:** Tanstack Form for the multi-step transaction form, Tanstack Table for data grids, Tanstack Router for type-safe routing.

## 8. Known Issues or Limitations

*   **(Example) Read Replica Consistency:** If read replicas are introduced for Supabase, the current `primary-after-mutation.ts` tRPC middleware (if implemented with an in-memory cache) will be per-instance on Vercel. For guaranteed read-after-write consistency across all serverless instances, a distributed cache (e.g., Redis/Upstash) for `userMutationTimestamps` would be necessary. (Currently, no read replicas are planned, so this is for future awareness).
*   **(Placeholder) Vercel Deployment Configuration:** Double-check Turborepo `env` passthrough and Vercel project settings (Root Directory, Build Command) for each app to avoid deployment issues (previously encountered `ENOTFOUND` for `DATABASE_URL` and incorrect app being served). Refer to Memories [9bb4f5e6...] and [d3791d8a...].

## 9. Contribution Guidelines

*   Follow existing code style and naming conventions.
*   Ensure `pnpm lint` passes before committing.
*   Write clear, concise commit messages.
*   For new features, consider discussing the approach or API design first.
*   Update this `README.md` if changes affect project setup, environment variables, or build processes.

---
This document aims to be a living guide. Please update it as the project evolves.
