# PortalWizard Web Application

This is the frontend web application for PortalWizard, providing interfaces for both Agents and Administrators (planned).

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Component Library**: Shadcn/UI (built on Radix UI)
- **API Communication**: tRPC (for type-safe API calls to the backend)
- **State Management**: React Context, `useState`, `useEffect`. Tanstack Query for server state via tRPC.
- **Package Manager**: PNPM (within a Turborepo monorepo setup)

## Getting Started

### Prerequisites

- Node.js (version recommended by Next.js, e.g., 18.x or 20.x)
- PNPM package manager

### Installation

1. Clone the main `portalwizard` monorepo.
2. Navigate to the root of the monorepo: `cd portalwizard`
3. Install dependencies for all workspaces: `pnpm install`

### Running the Development Server

1. From the root of the `portalwizard` monorepo, run:
   ```bash
   pnpm dev
   ```
   This command, managed by Turborepo, will typically start the development servers for both the `web` (this application) and `server` (backend) packages.
2. The web application will usually be available at `http://localhost:3000`.

### Key Environment Variables

Ensure your backend server is properly configured, especially with `DATABASE_URL` for PostgreSQL connectivity, as the web application relies on the backend for data and authentication.

## Project Structure (Key Directories in `apps/web`)

- `src/app/`: Contains all routes, layouts, and pages using the Next.js App Router.
  - `src/app/agent/`: Specific routes and UI for the Agent Portal.
  - `src/app/admin/`: (Planned) Specific routes and UI for the Admin Portal.
- `src/components/`: Shared UI components used across the application.
  - `src/components/ui/`: Shadcn UI components.
  - `src/components/dashboard/`: Custom components built for dashboards.
- `src/features/`: Feature-specific modules, including hooks, types, and components (e.g., `src/features/transactions/`).
- `src/lib/`: Utility functions, tRPC client setup, etc.
- `src/styles/`: Global styles.
- `public/`: Static assets.

## Agent Portal

The Agent Portal is designed to provide real estate agents with a dashboard to monitor their performance, manage transactions, and access essential tools.

### Overview

Accessed via the `/agent` route, the dashboard offers a dynamic and responsive interface for agents to get a quick overview of their sales activities and earnings.

### Features

1.  **Dynamic Greeting**:
    *   Displays a time-sensitive greeting (e.g., "Good morning", "Good afternoon") along with the agent's name.
    *   Implemented in: `src/app/agent/page.tsx`.

2.  **Key Performance Metrics**:
    *   A responsive grid displaying five key metric cards:
        *   Cumulative Sales Volume
        *   Total Commission Earned
        *   Next Month's Pending Payout
        *   Total Units Sold
        *   Average Deal Size
    *   Currency is formatted in MYR.
    *   Utilizes the reusable `MetricCard` component.
    *   Implemented in: `src/app/agent/page.tsx` using `src/components/dashboard/MetricCard.tsx`.
    *   Currently uses mock data; backend integration via tRPC is planned for live data.

3.  **Transaction Logging/Management**:
    *   Agents can log new transactions through a multi-step form.
    *   The form is integrated with the backend tRPC API (`transactions.create`) for data persistence in the PostgreSQL database.
    *   Authentication via Better Auth ensures that only logged-in agents can create transactions.
    *   Relevant hooks and components are located in `src/features/transactions/`.

4.  **Quick Actions**:
    *   Provides a readily accessible button (e.g., "Log New Transaction") in the header area of the dashboard for common tasks.
    *   Implemented in: `src/app/agent/page.tsx`.

5.  **Recent Transactions List & Details Modal**:
    *   Displays a table of the agent's 10 most recent transactions, fetched live from the database.
    *   Columns include Date, Property Name, Transaction Value, Status, and Actions.
    *   A "View Details" button for each transaction opens a modal displaying comprehensive information about that specific transaction.
    *   The modal is implemented using Shadcn UI `Dialog` and includes details like full property info, client info, commission, co-broking details, etc.
    *   Implemented in: `src/app/agent/page.tsx` using `src/components/dashboard/RecentTransactionsTable.tsx` and `src/components/dashboard/TransactionDetailsModal.tsx`.
    *   Now fetches live data from the backend via the `transactions.getRecentList` tRPC procedure.

### Key Components

- **Agent Dashboard Page**: `src/app/agent/page.tsx`
  - The main page component for the agent dashboard, orchestrating the display of the greeting and metric cards.
- **Metric Card**: `src/components/dashboard/MetricCard.tsx`
  - A reusable UI component built with Shadcn `Card` components to display individual metrics.
- **Agent Layout**: `src/app/agent/layout.tsx` (and potentially `src/components/layout/AgentLayout.tsx` if refactored)
  - Provides the overall structure for the agent portal, including navigation and main content area.
- **Recent Transactions Table**: `src/components/dashboard/RecentTransactionsTable.tsx`
  - A table component to display a list of transactions with key details and an action button.
- **Transaction Details Modal**: `src/components/dashboard/TransactionDetailsModal.tsx`
  - A modal dialog component to show comprehensive details of a selected transaction.

### Future Enhancements (Agent Portal)

- Full integration with tRPC queries to fetch real agent profile data and performance metrics (recent transactions list is now live).
- Implementation of loading and error states for all data fetching operations.
- Connection of the "Log New Transaction" quick action button to the actual transaction form/flow.
- Development of Performance Charts.

## Admin Portal

(Details to be added once development begins on the Admin Portal.)

## Deployment

(Details to be added regarding deployment strategy, e.g., Vercel, Netlify, or self-hosting.)

## Contributing

(Guidelines for contributing to the project will be added here.)
