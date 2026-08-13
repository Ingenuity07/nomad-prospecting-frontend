# Nomad — Operational Prospecting (React + TypeScript)

A React + TypeScript (Vite) frontend for Nomad, an operational-prospecting platform.
Every page — overview, start discovery, signal library, leads, lists, campaigns,
analytics, settings, and the account detail view — is componentized and data-driven.

The UI is deliberately **simple and readable**: one consistent type scale (no tiny text),
plain-language copy, functional buttons only, and smooth transitions between pages.

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
    mockData.ts       dummy payloads used when the backend is down
    accounts.ts       account detail lookup for /leads/:id
  components/
    layout/           AppShell, Sidebar, Topbar (incl. ⌘K command palette)
    dashboard/        Overview building blocks (metrics, chart, tables)
    ui/               Shared building blocks
  constants/        Every string, route, and API config lives here
  hooks/            useAsyncData, useLocalStorage
  pages/            Route-level pages (one per nav destination)
  types/            Shared TypeScript models
  utils/            chart helpers (smoothing, scaling)
  App.tsx           Route configuration
  index.css         Design system (reference palette + readable type scale)
  main.tsx          React entry point
```

## Pages

| Route                     | Page                                          |
| ------------------------- | --------------------------------------------- |
| `/`                       | Workspace overview (metrics + top accounts)   |
| `/discover`               | **Start discovery** — two-field form          |
| `/signals`                | Signal library                                |
| `/leads`                  | Qualified accounts directory                   |
| `/leads/:id`              | Account detail (evidence, people)             |
| `/lists`                  | Account lists (create list works)             |
| `/campaigns`              | Campaigns + playbooks                         |
| `/analytics`              | Pipeline, funnel, performance                  |
| `/settings`               | Workspace settings                            |

## Start discovery — API contract

The `/discover` page is built around `ProspectingDiscoverAPIView` in the backend
(`POST /discover/`). It sends exactly what the API requires:

```http
POST {VITE_API_BASE_URL}/discover/
Content-Type: application/json

{ "keyword": "Manual route planning", "location": "Leeds" }
```

- **201** → `{ "status": "success", "run_id": "<uuid>", "message": "..." }`
- **400** → both `keyword` and `location` are required (the form validates the same way)

After the run starts, the page animates through the same stages the backend task
`discover_campaign_async` broadcasts (`broadcast_progress` in `prospecting/tasks.py`):
`queued → discovering → resolving → researching → completed`, then shows a summary and a
link to the Leads page. When the backend is unreachable the run still completes against
mock numbers so the flow is always demonstrable.

## Backend API

Every section loads through a typed endpoint in `src/api/dashboard.ts`, with the base URL
in `src/constants/index.ts`.

- Set `VITE_API_BASE_URL` (copy `.env.example` → `.env`) to point at your backend.
- Each endpoint calls the backend first; if it is unreachable it silently falls back to the
  bundled mock data (`src/api/mockData.ts`), so the UI always renders.
- When the backend **is** reachable, its data is used (e.g. overview metrics, `/leads/`,
  `/dashboard/funnel/`, `/dashboard/opportunities/`).
