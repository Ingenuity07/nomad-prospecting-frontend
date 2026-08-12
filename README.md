# Nomad — Operational Prospecting (React + TypeScript)

A React + TypeScript (Vite) recreation of the Nomad operational-prospecting dashboard.
Every page of the reference site — workspace overview, discover, signal library, leads,
lists, campaigns, analytics, settings, and the account detail view — replicates the
reference UI, layout, and design system, and is fully componentized and data-driven.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  api/              Typed API endpoints with mock-data fallback
    client.ts         fetch wrapper (base URL + timeout)
    dashboard.ts      per-page endpoints (backend first, mock fallback)
    mockData.ts       dummy payloads mirroring the reference site
    accounts.ts       account detail lookup for /leads/:id
  components/
    layout/           AppShell, Sidebar, Topbar (incl. ⌘K command palette)
    dashboard/        Overview building blocks (metrics, chart, tables, feed)
    ui/               Shared building blocks
  constants/        Every string, route, and API config lives here
  hooks/            useAsyncData, useLocalStorage
  pages/            Route-level pages (one per nav destination)
  types/            Shared TypeScript models
  utils/            chart helpers (smoothing, scaling)
  App.tsx           Route configuration
  index.css         Full design system extracted from the reference site
  main.tsx          React entry point
```

## Pages

| Route                     | Page                              |
| ------------------------- | --------------------------------- |
| `/`                       | Workspace overview                |
| `/discover`               | Problem-first discovery form      |
| `/signals`                | Signal library                    |
| `/leads`                  | Qualified accounts directory      |
| `/leads/:id`              | Account detail (evidence, people) |
| `/lists`                  | Account lists                     |
| `/campaigns`              | Campaigns + playbooks             |
| `/analytics`              | Pipeline, funnel, performance     |
| `/settings`               | Workspace settings                |

## Backend API

The frontend is built to be dynamic: every section is loaded through a typed endpoint in
`src/api/dashboard.ts`, using endpoints and a base URL defined in `src/constants/index.ts`.

- Set `VITE_API_BASE_URL` (copy `.env.example` → `.env`) to point at your backend.
- Each endpoint first calls the backend and, if it is unreachable, errors, or times out,
  silently falls back to the bundled mock data (`src/api/mockData.ts`), so the UI always
  renders.
- Endpoint shapes mirror the types in `src/types/index.ts`. Return those JSON shapes from
  the backend and no component code needs to change.
