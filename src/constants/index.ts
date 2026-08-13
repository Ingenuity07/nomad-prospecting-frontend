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
  baseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000/api/v3/prospecting',
  timeoutMs: 15000,
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

/* ------------------------------------------------------------------ */
/* Start discovery (ProspectingDiscoverAPIView)                        */
/* ------------------------------------------------------------------ */

export const DISCOVER = {
  eyebrow: 'Start discovery',
  title: 'Find new customers',
  description:
    'Tell us the problem your customers have and where they are based. We search for companies that match, then check each one for you.',
  // Form
  problemLabel: 'What problem do your customers have?',
  problemPlaceholder: 'e.g. Teams plan delivery routes by hand and lose hours every week',
  problemExamples: ['Manual route planning', 'Scheduling bottlenecks', 'Poor delivery visibility'],
  locationLabel: 'Where are they based?',
  locationPlaceholder: 'e.g. Leeds, Manchester, or United Kingdom',
  locationExamples: ['Leeds', 'Manchester', 'London'],
  submitLabel: 'Start discovery',
  submittingLabel: 'Starting…',
  // Validation
  problemRequired: 'Tell us the problem you solve.',
  locationRequired: 'Tell us where your customers are based.',
  // How it works
  howTitle: 'How it works',
  howSteps: [
    { title: 'We find companies', detail: 'We search for businesses that match your problem and location.' },
    { title: 'We check each one', detail: 'We look at their website and contacts to confirm the fit.' },
    { title: 'You get a lead list', detail: 'Qualified companies appear in your Leads page with a fit score.' },
  ],
  // Run status
  runStarted: 'Discovery started',
  runFor: 'Looking for',
  runStagePrefix: 'Step',
  runStages: [
    { stage: 'queued', progress: 5, message: 'Starting the search' },
    { stage: 'discovering', progress: 20, message: 'Finding companies' },
    { stage: 'resolving', progress: 40, message: 'Removing duplicates' },
    { stage: 'researching', progress: 70, message: 'Checking each company' },
    { stage: 'completed', progress: 100, message: 'Done' },
  ] as const,
  // Completion
  completeTitle: 'Discovery complete',
  foundLabel: 'companies found',
  newLabel: 'new to you',
  duplicateLabel: 'already known',
  viewLeads: 'View leads',
  startAnother: 'Start another discovery',
  // Failure
  failedTitle: 'Discovery failed',
  failedDetail: 'Something went wrong while finding companies. Please try again.',
  tryAgain: 'Try again',
} as const

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
      { to: '/llm-analytics', label: 'LLM Cost & Tokens', icon: 'cpu' },
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
  eyebrow: 'Overview',
  title: 'See your best opportunities at a glance.',
  description:
    'We find companies with the problems you solve, check each one, and score how good a fit they are.',
  ctaLabel: 'Start discovery',
  // Opportunity map
  opportunityEyebrow: 'Top problems',
  opportunityTitle: 'Problems your customers have',
  viewAllSignals: 'View all signals',
  // Signal pulse
  pulseEyebrow: 'Signals over time',
  pulseTitle: 'New signals each week',
  pulseDescription: 'New operational-problem signals found over the last 8 weeks.',
  pulseThisWeek: 'This week',
  // Priority accounts
  priorityEyebrow: 'Priority accounts',
  priorityTitle: 'Top accounts to contact',
  allAccounts: 'View all leads',
} as const
