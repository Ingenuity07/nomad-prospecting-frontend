/**
 * App-wide constants.
 *
 * Central place for every string, route, and API configuration so the
 * frontend stays easy to re-brand or point at a real backend.
 */

export const APP = {
  name: 'nomad',
  tagline: 'Nomad — Operational Prospecting',
  description: 'Discover customers by the operational problems they need to solve.',
} as const

/* ------------------------------------------------------------------ */
/* Backend API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Base URL of the backend API. Point this at your real service by
 * setting VITE_API_BASE_URL in a .env file (see .env.example).
 * When the backend is unreachable, every endpoint silently falls back
 * to the bundled mock data (src/api/mockData.ts).
 */
export const API = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'https://api.nomad-prospecting.example.com',
  timeoutMs: 4500,
  endpoints: {
    dashboard: '/dashboard',
    metrics: '/dashboard/metrics',
    problems: '/dashboard/problems',
    signalPulse: '/dashboard/signal-pulse',
    priorityAccounts: '/dashboard/priority-accounts',
    activity: '/dashboard/activity',
  } as const,
} as const

/* ------------------------------------------------------------------ */
/* Workspace (sidebar)                                                 */
/* ------------------------------------------------------------------ */

export const WORKSPACE = {
  initials: 'RO',
  name: 'RouteOps',
  plan: 'Growth workspace',
  creditsLeft: '1,752 credits left',
  renewsOn: 'Renews on 1 September',
  creditUsedPercent: 58,
  managePlanLabel: 'Manage plan',
  userInitials: 'PS',
  userName: 'Priya Shah',
  userRole: 'Admin',
} as const

export const SEARCH_PLACEHOLDER = 'Search accounts, signals, or lists…'

export const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { to: '/', label: 'Overview', icon: 'layout-dashboard', end: true },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/discover', label: 'Discover', icon: 'radar', badge: 'AI' },
      { to: '/signals', label: 'Problem signals', icon: 'zap', count: 12 },
    ],
  },
  {
    label: 'Activation',
    items: [
      { to: '/leads', label: 'Leads', icon: 'users-round' },
      { to: '/lists', label: 'Lists', icon: 'list-filter' },
      { to: '/campaigns', label: 'Campaigns', icon: 'message-square-text' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/analytics', label: 'Analytics', icon: 'chart-column' },
    ],
  },
] as const

export const SIDEBAR_FOOTER_LINKS = [
  { to: '/settings', label: 'Settings', icon: 'settings' },
  { to: '#help', label: 'Help & resources', icon: 'circle-help' },
] as const

/* ------------------------------------------------------------------ */
/* Overview page copy                                                  */
/* ------------------------------------------------------------------ */

export const OVERVIEW = {
  eyebrow: 'Workspace overview',
  title: 'Turn operational friction into pipeline.',
  description:
    'Nomad finds companies with expensive, visible problems — then shows you the evidence behind every match.',
  ctaLabel: 'Start discovery',
  // Opportunity map
  opportunityEyebrow: 'Opportunity map',
  opportunityTitle: 'Where the pain is showing',
  viewAllSignals: 'View all signals',
  // Signal pulse
  pulseEyebrow: 'Signal pulse',
  pulseTitle: 'Demand is rising',
  pulseDescription: 'New operational-problem signals found over the last 8 weeks.',
  pulseThisWeek: 'This week',
  // Priority accounts
  priorityEyebrow: 'Priority accounts',
  priorityTitle: 'Best opportunities right now',
  allAccounts: 'All accounts',
  // Activity
  activityEyebrow: 'Activity',
  activityTitle: 'What changed',
  markRead: 'Mark read',
  viewActivity: 'View workspace activity',
} as const
