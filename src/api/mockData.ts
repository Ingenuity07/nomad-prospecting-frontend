import {
  Building2,
  Clock3,
  Globe,
  Handshake,
  MailCheck,
  Radar,
  Route,
  Send,
  Target,
  TimerReset,
  TrendingUp,
  Users,
  UsersRound,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type {
  AccountDetail,
  AccountList,
  ActivityEvent,
  ActivityTone,
  AnalyticsMetric,
  Campaign,
  CampaignMetric,
  Contact,
  DashboardData,
  EvidenceItem,
  EvidenceOption,
  FunnelStage,
  LeadKpi,
  LeadRow,
  Momentum,
  Playbook,
  PriorityAccount,
  ProblemCluster,
  ProblemPerformance,
  ProblemSignal,
  SignalCategory,
  SignalPulse,
  SignalStat,
  SourceRanking,
  WorkspaceMetric,
} from '../types'

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

const metrics: WorkspaceMetric[] = [
  {
    id: 'qualified-accounts',
    label: 'Qualified accounts',
    value: '1,248',
    change: '18%',
    direction: 'up',
    note: 'vs. last 30 days',
    icon: Building2,
  },
  {
    id: 'active-problems',
    label: 'Active problems',
    value: '12',
    change: '3 new',
    direction: 'up',
    note: 'across 5 industries',
    icon: Wrench,
  },
  {
    id: 'in-buying-window',
    label: 'In buying window',
    value: '36%',
    change: '6.4%',
    direction: 'up',
    note: '448 accounts',
    icon: Clock3,
  },
  {
    id: 'positive-replies',
    label: 'Positive replies',
    value: '14.2%',
    change: '2.1%',
    direction: 'up',
    note: 'problem-led campaigns',
    icon: TrendingUp,
  },
]

const problems: ProblemCluster[] = [
  {
    id: 'manual-route-planning',
    title: 'Manual route planning',
    category: 'Routing & dispatch',
    liveSignals: 8,
    accounts: 184,
    momentum: 'Rising',
    icon: Route,
    iconTone: 'lime',
  },
  {
    id: 'scheduling-bottlenecks',
    title: 'Scheduling bottlenecks',
    category: 'Workforce operations',
    liveSignals: 6,
    accounts: 127,
    momentum: 'High',
    icon: TimerReset,
    iconTone: 'blue',
  },
  {
    id: 'unplanned-fleet-downtime',
    title: 'Unplanned fleet downtime',
    category: 'Fleet reliability',
    liveSignals: 5,
    accounts: 96,
    momentum: 'Rising',
    icon: Wrench,
    iconTone: 'amber',
  },
  {
    id: 'poor-delivery-visibility',
    title: 'Poor delivery visibility',
    category: 'Customer operations',
    liveSignals: 7,
    accounts: 83,
    momentum: 'New',
    icon: Radar,
    iconTone: 'violet',
  },
]

const pulse: SignalPulse = {
  weeks: ['Jun 23', 'Jul 7', 'Jul 21', 'Aug 4'],
  values: [28, 41, 57, 89],
  changePct: 24,
  total: 89,
  note: 'New operational-problem signals found over the last 8 weeks.',
}

const priorityAccounts: PriorityAccount[] = [
  {
    id: 'northstar-logistics',
    name: 'Northstar Logistics',
    location: 'Manchester, UK',
    initials: 'NL',
    markTone: 'navy',
    problem: 'Manual route planning',
    window: 'Act now',
    fitScore: 92,
  },
  {
    id: 'atlas-foods',
    name: 'Atlas Foods',
    location: 'Birmingham, UK',
    initials: 'AF',
    markTone: 'orange',
    problem: 'Poor delivery visibility',
    window: 'This quarter',
    fitScore: 88,
  },
  {
    id: 'greenline-services',
    name: 'Greenline Services',
    location: 'Bristol, UK',
    initials: 'GS',
    markTone: 'green',
    problem: 'Scheduling bottlenecks',
    window: 'This quarter',
    fitScore: 85,
  },
  {
    id: 'vertex-couriers',
    name: 'Vertex Couriers',
    location: 'Leeds, UK',
    initials: 'VC',
    markTone: 'purple',
    problem: 'Last-mile margin pressure',
    window: 'Researching',
    fitScore: 81,
  },
]

const activityIcons: Record<ActivityTone, LucideIcon> = {
  lime: Radar,
  blue: MailCheck,
  amber: TimerReset,
}

const activity: ActivityEvent[] = [
  {
    id: 'discovery-run-completed',
    title: 'Discovery run completed',
    detail: '34 accounts matched ‘Manual route planning’',
    time: '8 min',
    tone: 'lime',
    icon: activityIcons.lime,
  },
  {
    id: 'campaign-reply-detected',
    title: 'Campaign reply detected',
    detail: 'Maya Chen at Atlas Foods asked for a walkthrough',
    time: '42 min',
    tone: 'blue',
    icon: activityIcons.blue,
  },
  {
    id: 'buying-window-changed',
    title: 'Buying window changed',
    detail: 'Northstar Logistics moved to ‘Act now’',
    time: '2 hr',
    tone: 'amber',
    icon: activityIcons.amber,
  },
]

export const mockDashboard: DashboardData = {
  metrics,
  problems,
  pulse,
  priorityAccounts,
  activity,
}

/* ------------------------------------------------------------------ */
/* Discover                                                            */
/* ------------------------------------------------------------------ */

export const discoveryProblem = {
  statement:
    'Teams are losing time and margin to manual route planning as delivery volume grows.',
  commonProblems: ['Manual route planning', 'Scheduling bottlenecks', 'Late deliveries', 'Unplanned downtime', 'Poor customer visibility'],
  evidence: [
    { id: 'hiring', title: 'Hiring evidence', description: 'Roles that suggest the problem exists', icon: UsersRound },
    { id: 'technology', title: 'Technology gaps', description: 'Missing or fragmented tooling', icon: Wrench },
    { id: 'language', title: 'Public language', description: 'Problem terms on the company website', icon: Globe },
    { id: 'change', title: 'Change events', description: 'Expansion, contracts, or new locations', icon: Zap },
  ] as EvidenceOption[],
  market: {
    target: 'United Kingdom',
    locations: 'All UK',
    companySize: '51–1,000 employees',
    firmographicOptions: ['United Kingdom', 'United States', 'Europe'],
    sizeOptions: ['51–1,000 employees', '11–200 employees', '201–5,000 employees'],
  },
  estimatedReach: '2,400–3,100 companies',
  model: {
    problem: 'Manual route planning at growing delivery teams',
    evidenceBundle: 'Hiring + technology gaps + expansion',
    qualified: 'Strong fit with a near-term buying window',
    precisionLabel: 'Expected precision',
    precision: 'High · 82–91%',
    precisionBar: 86,
    precisionNote: 'Based on your selected evidence mix',
  },
  tip: 'Specific operational language creates fewer, stronger matches than broad industry keywords.',
}

/* ------------------------------------------------------------------ */
/* Signals                                                             */
/* ------------------------------------------------------------------ */

export const signalStats: SignalStat[] = [
  { id: 'active', label: 'Active signals', value: '12', note: 'added this month', highlight: '3', tone: 'lime', icon: Radar },
  { id: 'accounts', label: 'Matched accounts', value: '1,248', note: 'in 30 days', highlight: '+18%', tone: 'blue', icon: UsersRound },
  { id: 'rising', label: 'Rising problems', value: '5', note: 'Across logistics & field ops', tone: 'amber', icon: TrendingUp },
  { id: 'precision', label: 'Avg. precision', value: '86%', note: 'from evidence tuning', highlight: '+4.2%', tone: 'violet', icon: Target },
]

export const signalCategories: SignalCategory[] = [
  { id: 'routing', label: 'Routing & dispatch' },
  { id: 'workforce', label: 'Workforce operations' },
  { id: 'fleet', label: 'Fleet reliability' },
  { id: 'customer', label: 'Customer operations' },
]

export const signals: ProblemSignal[] = [
  {
    id: 'manual-route-planning',
    title: 'Manual route planning',
    description: 'Teams are coordinating multi-stop routes in spreadsheets or generic mapping tools.',
    category: 'Routing & dispatch',
    iconTone: 'lime',
    momentum: 'Rising',
    evidenceTypes: 8,
    updatedAgo: '1h ago',
    accounts: 184,
    trend: [35, 49, 44, 67, 74, 88],
    health: 'High precision',
    watching: true,
  },
  {
    id: 'scheduling-bottlenecks',
    title: 'Scheduling bottlenecks',
    description: 'Dispatchers and operations teams are manually reconciling shifts, jobs, and capacity.',
    category: 'Workforce operations',
    iconTone: 'blue',
    momentum: 'High',
    evidenceTypes: 6,
    updatedAgo: '2h ago',
    accounts: 127,
    trend: [39, 52, 49, 70, 78, 86],
    health: 'High precision',
    watching: true,
  },
  {
    id: 'unplanned-fleet-downtime',
    title: 'Unplanned fleet downtime',
    description: 'Maintenance is reactive, asset visibility is fragmented, and service delays are increasing.',
    category: 'Fleet reliability',
    iconTone: 'amber',
    momentum: 'Rising',
    evidenceTypes: 5,
    updatedAgo: '3h ago',
    accounts: 96,
    trend: [43, 55, 54, 73, 82, 84],
    health: 'High precision',
    watching: true,
  },
  {
    id: 'poor-delivery-visibility',
    title: 'Poor delivery visibility',
    description: 'Customers and support teams lack reliable ETAs or real-time delivery status.',
    category: 'Customer operations',
    iconTone: 'violet',
    momentum: 'New',
    evidenceTypes: 7,
    updatedAgo: '4h ago',
    accounts: 83,
    trend: [47, 58, 59, 76, 86, 82],
    health: 'High precision',
    watching: false,
  },
  {
    id: 'last-mile-margin-pressure',
    title: 'Last-mile margin pressure',
    description: 'Rising cost per stop and failed deliveries are eroding route profitability.',
    category: 'Unit economics',
    iconTone: 'rose',
    momentum: 'High',
    evidenceTypes: 9,
    updatedAgo: '5h ago',
    accounts: 71,
    trend: [51, 61, 64, 79, 90, 80],
    health: 'High precision',
    watching: false,
  },
  {
    id: 'manual-proof-of-delivery',
    title: 'Manual proof-of-delivery',
    description: 'Paper-based handoffs and delayed records slow invoicing and create disputes.',
    category: 'Field workflows',
    iconTone: 'teal',
    momentum: 'Stable',
    evidenceTypes: 4,
    updatedAgo: '6h ago',
    accounts: 64,
    trend: [55, 64, 69, 82, 94, 78],
    health: 'Needs tuning',
    watching: false,
  },
]

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export const leadKpis: LeadKpi[] = [
  { id: 'total', label: 'Total qualified', value: '1,248', icon: UsersRound },
  { id: 'high-fit', label: 'High fit · 85+', value: '386', note: '↗ 12%', tone: 'up', icon: Target },
  { id: 'act-now', label: 'Act now', value: '104', note: '8 added today', tone: 'hot', icon: Zap },
  { id: 'unassigned', label: 'Unassigned', value: '229', note: 'Needs review', icon: Users },
]

export const leads: LeadRow[] = [
  {
    id: 'northstar-logistics',
    name: 'Northstar Logistics',
    industry: '3PL & logistics',
    location: 'Manchester, UK',
    initials: 'NL',
    markTone: 'navy',
    problem: 'Manual route planning',
    signals: 8,
    sources: 3,
    window: 'Act now',
    fitScore: 92,
    owner: 'Maya',
    ownerInitials: 'M',
    lastSeen: '2h ago',
  },
  {
    id: 'atlas-foods',
    name: 'Atlas Foods',
    industry: 'Food distribution',
    location: 'Birmingham, UK',
    initials: 'AF',
    markTone: 'orange',
    problem: 'Poor delivery visibility',
    signals: 6,
    sources: 3,
    window: 'This quarter',
    fitScore: 88,
    owner: 'Jon',
    ownerInitials: 'J',
    lastSeen: '5h ago',
  },
  {
    id: 'greenline-services',
    name: 'Greenline Services',
    industry: 'Field services',
    location: 'Bristol, UK',
    initials: 'GS',
    markTone: 'green',
    problem: 'Scheduling bottlenecks',
    signals: 5,
    sources: 3,
    window: 'This quarter',
    fitScore: 85,
    owner: 'Shivam',
    ownerInitials: 'S',
    lastSeen: '1d ago',
  },
  {
    id: 'vertex-couriers',
    name: 'Vertex Couriers',
    industry: 'Parcel delivery',
    location: 'Leeds, UK',
    initials: 'VC',
    markTone: 'purple',
    problem: 'Last-mile margin pressure',
    signals: 7,
    sources: 3,
    window: 'Researching',
    fitScore: 81,
    owner: 'Maya',
    ownerInitials: 'M',
    lastSeen: '2d ago',
  },
  {
    id: 'harbor-facilities',
    name: 'Harbor Facilities',
    industry: 'Facilities management',
    location: 'London, UK',
    initials: 'HF',
    markTone: 'blue',
    problem: 'Manual route planning',
    signals: 4,
    sources: 3,
    window: 'Researching',
    fitScore: 79,
    owner: 'Unassigned',
    ownerInitials: '+',
    unassigned: true,
    lastSeen: '2d ago',
  },
  {
    id: 'morrow-medical',
    name: 'Morrow Medical',
    industry: 'Medical distribution',
    location: 'Oxford, UK',
    initials: 'MM',
    markTone: 'rose',
    problem: 'Unplanned fleet downtime',
    signals: 3,
    sources: 3,
    window: 'Monitoring',
    fitScore: 76,
    owner: 'Jon',
    ownerInitials: 'J',
    lastSeen: '4d ago',
  },
]

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */

export const accountLists: AccountList[] = [
  {
    id: 'route-optimization-q3',
    name: 'Route optimization · Q3',
    description: 'UK logistics teams with manual planning and an active buying window.',
    kind: 'smart',
    iconTone: 'lime',
    accounts: 84,
    newThisWeek: 12,
    actNow: 32,
    owners: ['SS', 'JM'],
    updated: '8 min ago',
  },
  {
    id: 'field-service-scheduling',
    name: 'Field service scheduling',
    description: 'Growing service businesses hiring dispatch and workforce planning roles.',
    kind: 'smart',
    iconTone: 'blue',
    accounts: 61,
    newThisWeek: 7,
    actNow: 23,
    owners: ['SS'],
    updated: '2 hours ago',
  },
  {
    id: 'high-fit-unassigned',
    name: 'High-fit · unassigned',
    description: 'Accounts scoring 85+ that still need an owner and next action.',
    kind: 'smart',
    iconTone: 'amber',
    accounts: 38,
    newThisWeek: 4,
    actNow: 18,
    owners: ['JM', 'AK'],
    updated: 'Today',
  },
  {
    id: 'food-distribution-uk',
    name: 'Food distribution · UK',
    description: 'Static account list',
    kind: 'static',
    iconTone: 'violet',
    accounts: 47,
    newThisWeek: 0,
    actNow: 0,
    owners: ['AK'],
    updated: 'Yesterday',
  },
  {
    id: 'campaign-replies-august',
    name: 'Campaign replies · August',
    description: 'Static account list',
    kind: 'static',
    iconTone: 'teal',
    accounts: 23,
    newThisWeek: 0,
    actNow: 0,
    owners: ['JM'],
    updated: '2 days ago',
  },
]

/* ------------------------------------------------------------------ */
/* Campaigns                                                           */
/* ------------------------------------------------------------------ */

export const campaignMetrics: CampaignMetric[] = [
  {
    id: 'contacted',
    label: 'Accounts contacted',
    value: '129',
    note: 'of 170 enrolled',
    change: '↗ 18%',
    icon: Send,
  },
  {
    id: 'reply-rate',
    label: 'Positive reply rate',
    value: '14.2%',
    note: 'Problem-led average',
    change: '↗ 2.1%',
    icon: MailCheck,
  },
  {
    id: 'meetings',
    label: 'Meetings booked',
    value: '11',
    note: 'This month',
    change: '↗ 4',
    icon: Handshake,
  },
  {
    id: 'time-to-reply',
    label: 'Avg. time to reply',
    value: '2.4d',
    note: 'Across live campaigns',
    change: '— 0.2d',
    flat: true,
    icon: Clock3,
  },
]

export const campaigns: Campaign[] = [
  {
    id: 'route-planning-act-now',
    name: 'Route planning · Act now',
    problem: 'Manual route planning',
    updated: '12 min ago',
    status: 'Live',
    sent: 58,
    total: 84,
    positiveReplies: 17.2,
    meetings: 6,
    owner: 'SS',
    iconTone: 'lime',
  },
  {
    id: 'delivery-visibility-food',
    name: 'Delivery visibility · Food',
    problem: 'Poor delivery visibility',
    updated: '1 hour ago',
    status: 'Live',
    sent: 32,
    total: 47,
    positiveReplies: 12.5,
    meetings: 3,
    owner: 'AK',
    iconTone: 'blue',
  },
  {
    id: 'fleet-downtime-q3',
    name: 'Fleet downtime · Q3',
    problem: 'Unplanned fleet downtime',
    updated: 'Yesterday',
    status: 'Paused',
    sent: 39,
    total: 39,
    positiveReplies: 10.3,
    meetings: 2,
    owner: 'JM',
    iconTone: 'amber',
  },
]

export const campaignInsight = {
  title: 'Problem evidence is lifting replies',
  body: 'Messages that reference a recent hiring or growth signal are outperforming generic personalization by',
  multiplier: '2.7×',
  evidenceLed: { label: 'Evidence-led', value: '17.8%', bar: 89 },
  generic: { label: 'Generic personalization', value: '6.6%', bar: 33 },
}

export const playbooks: Playbook[] = [
  {
    id: 'manual-to-scalable',
    title: 'Manual planning to scalable operations',
    problem: 'Manual route planning',
    steps: 4,
    avgReply: '18.4%',
    iconTone: 'lime',
  },
  {
    id: 'visibility-growth-lever',
    title: 'Make delivery visibility a growth lever',
    problem: 'Poor delivery visibility',
    steps: 5,
    avgReply: '15.1%',
    iconTone: 'blue',
  },
  {
    id: 'reactive-fleet-maintenance',
    title: 'Reduce reactive fleet maintenance',
    problem: 'Unplanned fleet downtime',
    steps: 4,
    avgReply: '13.8%',
    iconTone: 'amber',
  },
]

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: 'pipeline',
    label: 'Problem-led pipeline',
    value: '£453k',
    change: '↗ 22.8%',
    note: 'vs. previous period',
    featured: true,
    spark: [20, 31, 27, 49, 43, 68, 74, 95],
    icon: TrendingUp,
  },
  { id: 'signals', label: 'Signals discovered', value: '1,842', change: '↗ 18.4%', note: 'from 1,556', icon: Radar },
  { id: 'qualified', label: 'Qualified accounts', value: '448', change: '24.3%', note: 'signal-to-qualified', icon: Target },
  { id: 'replies', label: 'Positive replies', value: '14.2%', change: '↗ 2.1%', note: 'vs. previous period', icon: MailCheck },
]

export const pipeline = {
  aria: 'Problem-led pipeline rising from £18k to £72k weekly over the last thirty days',
  weeks: ['Jul 7', 'Jul 14', 'Jul 21', 'Jul 28', 'Aug 4'],
  actual: [18, 31, 27, 44, 52, 61, 72],
  previous: [14, 22, 24, 33, 38, 44, 51],
  yLabels: ['£80k', '£60k', '£40k', '£20k', '£0'],
  tooltip: { week: 'Week of 3 Aug', value: '£72.4k', change: '↗ 18.2%' },
}

export const funnelStages: FunnelStage[] = [
  { id: 'signals', label: 'Signals', count: 1842, pct: '100%', width: 100 },
  { id: 'qualified', label: 'Qualified', count: 448, pct: '24.3%', width: 82 },
  { id: 'contacted', label: 'Contacted', count: 294, pct: '65.6%', width: 65 },
  { id: 'positive', label: 'Positive reply', count: 42, pct: '14.2%', width: 48 },
  { id: 'meetings', label: 'Meetings', count: 29, pct: '69.0%', width: 35 },
]

export const funnelInsight = {
  title: 'Largest opportunity',
  body: 'Improving qualification precision by 5% could add 22 more contacted accounts per month.',
}

export const problemPerformance: ProblemPerformance[] = [
  { id: 'manual-route-planning', problem: 'Manual route planning', tone: 'lime', accounts: 184, qualified: 71, positiveReply: 18.4, meetings: 12, pipeline: '£186k' },
  { id: 'scheduling-bottlenecks', problem: 'Scheduling bottlenecks', tone: 'blue', accounts: 127, qualified: 54, positiveReply: 15.7, meetings: 8, pipeline: '£121k' },
  { id: 'poor-delivery-visibility', problem: 'Poor delivery visibility', tone: 'violet', accounts: 83, qualified: 32, positiveReply: 13.9, meetings: 5, pipeline: '£84k' },
  { id: 'unplanned-fleet-downtime', problem: 'Unplanned fleet downtime', tone: 'amber', accounts: 96, qualified: 29, positiveReply: 11.2, meetings: 4, pipeline: '£62k' },
]

export const sourceRanking: SourceRanking[] = [
  { id: 'hiring', name: 'Hiring language', rate: '19.8%', bar: 82 },
  { id: 'expansion', name: 'Expansion events', rate: '17.1%', bar: 68 },
  { id: 'technology', name: 'Technology gaps', rate: '14.6%', bar: 55 },
  { id: 'website', name: 'Website problem language', rate: '12.9%', bar: 43 },
]

/* ------------------------------------------------------------------ */
/* Account detail                                                      */
/* ------------------------------------------------------------------ */

export const accountDetails: Record<string, AccountDetail> = {
  'northstar-logistics': {
    id: 'northstar-logistics',
    name: 'Northstar Logistics',
    domain: 'northstarlogistics.co.uk',
    industry: '3PL & logistics',
    location: 'Manchester, UK',
    initials: 'NL',
    markTone: 'navy',
    status: 'Qualified account',
    problem: 'Manual route planning',
    score: 92,
    scoreLabel: 'Excellent problem fit',
    scoreNote: 'Top 4% of accounts for your route-optimization wedge',
    factors: [
      { id: 'fit', label: 'Problem fit', value: 96 },
      { id: 'evidence', label: 'Evidence strength', value: 91 },
      { id: 'window', label: 'Buying window', value: 88 },
    ],
    nextStep: 'Lead with route-planning capacity',
    confidence: 'High confidence',
    thesis:
      'Northstar’s delivery network is expanding faster than its planning workflow. Multiple signals suggest dispatch teams still rely on manual processes for a growing number of routes.',
    evidenceTotal: 8,
    evidence: [
      {
        id: 'e1',
        title: 'Hiring for route-planning capacity',
        time: '2 days ago',
        detail:
          'Open roles for two Transport Planners mention “manually sequencing daily multi-drop routes” and “improving route efficiency.”',
        source: 'Careers page',
        strength: 'strong',
        tone: 'lime',
      },
      {
        id: 'e2',
        title: 'Announced two new distribution contracts',
        time: '12 days ago',
        detail:
          'The contracts add an estimated 1,200 weekly drops across the North West, increasing planning complexity and fleet utilization.',
        source: 'Company news',
        strength: 'medium',
        tone: 'blue',
      },
      {
        id: 'e3',
        title: 'No dedicated route-optimization platform detected',
        time: '21 days ago',
        detail:
          'Technology footprint shows a TMS and telematics provider, but no routing or dispatch optimization layer.',
        source: 'Technology profile',
        strength: 'strong',
        tone: 'amber',
      },
    ],
    contacts: [
      { id: 'c1', name: 'Elena Morris', role: 'VP Operations', initials: 'EM', relevance: 'Decision maker', relevancePct: 92, avatarClass: 'contact-0', relevanceClass: 'relevance-0' },
      { id: 'c2', name: 'Marcus Webb', role: 'Director of Fleet', initials: 'MW', relevance: 'Problem owner', relevancePct: 86, avatarClass: 'contact-1', relevanceClass: 'relevance-1' },
      { id: 'c3', name: 'Sophie Khan', role: 'Head of Transformation', initials: 'SK', relevance: 'Champion', relevancePct: 80, avatarClass: 'contact-2', relevanceClass: 'relevance-2' },
    ],
    window: 'Act now',
    windowScore: 88,
    windowNote: 'Three recent changes make the next 30–60 days a strong outreach window.',
    windowReasons: ['New operations hiring', 'Volume expansion announced', 'No optimization layer detected'],
    windowUpdated: 'Window updated 2 hours ago',
    snapshot: [
      { label: 'Company size', value: '201–500' },
      { label: 'Revenue', value: '£48M est.' },
      { label: 'Headquarters', value: 'Manchester, UK' },
      { label: 'Coverage', value: '18 UK depots' },
      { label: 'Founded', value: '1998' },
    ],
    talkingPoints: [
      'Reference the two new distribution contracts and added route density.',
      'Connect planner hiring to the cost of manual sequencing at scale.',
      'Offer a capacity model using their likely multi-drop profile.',
    ],
  },
}

/* Fallback for other account slugs — derives from the leads table data. */
export function buildFallbackAccountDetail(id: string): AccountDetail | undefined {
  const lead = leads.find((row) => row.id === id)
  if (!lead) return undefined
  return {
    id: lead.id,
    name: lead.name,
    domain: `${lead.id}.co.uk`,
    industry: lead.industry,
    location: lead.location,
    initials: lead.initials,
    markTone: lead.markTone,
    status: 'Qualified account',
    problem: lead.problem,
    score: lead.fitScore,
    scoreLabel: lead.fitScore >= 85 ? 'Excellent problem fit' : 'Strong problem fit',
    scoreNote: 'Matched from recent operational signals in your workspace.',
    factors: [
      { id: 'fit', label: 'Problem fit', value: Math.min(98, lead.fitScore + 4) },
      { id: 'evidence', label: 'Evidence strength', value: Math.min(96, lead.fitScore) },
      { id: 'window', label: 'Buying window', value: Math.min(94, lead.fitScore - 3) },
    ],
    nextStep: 'Lead with evidence from the latest operational signal',
    confidence: 'High confidence',
    thesis: `${lead.name} shows multiple signals consistent with ${lead.problem.toLowerCase()}.`,
    evidenceTotal: lead.signals,
    evidence: [
      {
        id: 'e1',
        title: `Signals match ‘${lead.problem}’`,
        time: 'Recently',
        detail: `${lead.signals} observable signals detected across ${lead.sources} distinct sources.`,
        source: 'Workspace signals',
        strength: 'strong',
        tone: 'lime',
      },
    ],
    contacts: [
      { id: 'c1', name: 'Operations Lead', role: 'Operations', initials: 'OL', relevance: 'Decision maker', relevancePct: 88, avatarClass: 'contact-0', relevanceClass: 'relevance-0' },
    ],
    window: lead.window,
    windowScore: lead.fitScore,
    windowNote: 'Timing is inferred from the freshness of recent evidence.',
    windowReasons: ['Fresh evidence detected', 'Active problem language'],
    windowUpdated: 'Window updated today',
    snapshot: [
      { label: 'Industry', value: lead.industry },
      { label: 'Location', value: lead.location },
    ],
    talkingPoints: ['Reference the recent operational signal evidence.'],
  }
}

export type { EvidenceItem, Contact, Momentum }
