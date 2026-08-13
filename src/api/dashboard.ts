import { Building2, Target, Zap, Users, UsersRound } from 'lucide-react'
import type {
  AccountList,
  AnalyticsMetric,
  Campaign,
  CampaignMetric,
  DashboardData,
  EvidenceOption,
  FunnelStage,
  LeadKpi,
  LeadRow,
  Playbook,
  PriorityAccount,
  ProblemPerformance,
  ProblemSignal,
  ProblemCluster,
  SignalCategory,
  SignalPulse,
  SignalStat,
  SourceRanking,
  WorkspaceMetric,
  Momentum,
  BuyingWindow
} from '../types'
import { apiFetch } from './client'
import {
  accountDetails,
  analyticsMetrics,
  buildFallbackAccountDetail,
  campaignInsight,
  discoveryProblem,
  funnelInsight,
  mockDashboard,
  pipeline,
} from './mockData'

type Loader<T> = () => Promise<T>

/** Try the backend; on any failure fall back to the bundled mock data. */
async function withFallback<T>(endpoint: string, fallback: T, options?: any): Promise<T> {
  try {
    return await apiFetch<T>(endpoint, options)
  } catch {
    return fallback
  }
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

export const getDashboard = async (): Promise<DashboardData> => {
  try {
    const raw = await apiFetch<any>('/dashboard/overview/')
    const dynamicMetrics: WorkspaceMetric[] = [
      {
        id: 'qualified-accounts',
        label: 'Discovered leads',
        value: String(raw.discovered ?? 0),
        change: 'New',
        direction: 'up',
        note: 'leads found',
        icon: Building2,
      },
      {
        id: 'high-fit',
        label: 'Qualified leads',
        value: String(raw.qualified ?? 0),
        change: 'Active',
        direction: 'up',
        note: 'high match fit',
        icon: Target,
      },
      {
        id: 'act-now',
        label: 'Contacted leads',
        value: String(raw.contacted ?? 0),
        change: 'Engaged',
        direction: 'up',
        note: 'outreach active',
        icon: Zap,
      },
      {
        id: 'unassigned',
        label: 'Positive replies',
        value: String(raw.positive ?? 0),
        change: 'Interested',
        direction: 'up',
        note: 'ready to book',
        icon: Users,
      }
    ]
    return {
      ...mockDashboard,
      metrics: dynamicMetrics,
    }
  } catch {
    const emptyDashboard: DashboardData = {
      metrics: [
        { id: 'qualified-accounts', label: 'Discovered leads', value: '-', change: '-', direction: 'flat', note: 'no connection', icon: Building2 },
        { id: 'high-fit', label: 'Qualified leads', value: '-', change: '-', direction: 'flat', note: 'no connection', icon: Target },
        { id: 'act-now', label: 'Contacted leads', value: '-', change: '-', direction: 'flat', note: 'no connection', icon: Zap },
        { id: 'unassigned', label: 'Positive replies', value: '-', change: '-', direction: 'flat', note: 'no connection', icon: Users },
      ],
      problems: [],
      pulse: { weeks: [], values: [], changePct: 0, total: 0, note: '-' },
      priorityAccounts: [],
      activity: [],
    }
    return emptyDashboard
  }
}

export const getMetrics = async (): Promise<WorkspaceMetric[]> => {
  const dash = await getDashboard()
  return dash.metrics
}

export const getProblems = async (): Promise<ProblemCluster[]> => {
  try {
    const raw = await apiFetch<any[]>('/dashboard/signals/')
    const tones: Array<'lime' | 'blue' | 'amber' | 'violet' | 'teal' | 'rose'> = ['lime', 'blue', 'amber', 'violet', 'teal', 'rose']
    const momentums: Momentum[] = ['High', 'Rising', 'Stable', 'New']
    return raw.map((item, idx) => ({
      id: String(idx),
      title: item.signal__name || 'Unknown problem',
      category: item.signal__category || 'Operations',
      liveSignals: item.total_detections || 0,
      accounts: item.active_count || 0,
      momentum: momentums[idx % momentums.length],
      icon: Target,
      iconTone: tones[idx % tones.length],
    }))
  } catch {
    return []
  }
}

export const getSignalPulse: Loader<SignalPulse> = () => withFallback('/dashboard/overview/', mockDashboard.pulse)
export const getPriorityAccounts: Loader<PriorityAccount[]> = () => withFallback('/dashboard/overview/', mockDashboard.priorityAccounts)
export const getActivity: Loader<DashboardData['activity']> = () => withFallback('/dashboard/overview/', mockDashboard.activity)

/* ------------------------------------------------------------------ */
/* Discover                                                            */
/* ------------------------------------------------------------------ */

export const getDiscoveryProblem = () => withFallback('/discover/', discoveryProblem)
export const getEvidenceOptions = () => withFallback('/discover/', discoveryProblem.evidence as EvidenceOption[])
export const postDiscover = (body: any) => withFallback('/discover/', { run_id: 'mock-run' }, { method: 'POST', body })

/* ------------------------------------------------------------------ */
/* Signals                                                             */
/* ------------------------------------------------------------------ */

export const getSignalStats = async (): Promise<SignalStat[]> => {
  try {
    const raw = await apiFetch<any[]>('/dashboard/signals/')
    const tones: Array<'lime' | 'blue' | 'amber' | 'violet'> = ['lime', 'blue', 'amber', 'violet']
    return raw.slice(0, 4).map((item, idx) => ({
      id: String(idx),
      label: item.signal__name || 'Unknown',
      value: String(item.total_detections || 0),
      note: 'Detections in last 30d',
      tone: tones[idx % tones.length],
      icon: Zap,
    }))
  } catch {
    return []
  }
}
export const getSignalCategories = async (): Promise<SignalCategory[]> => {
  try {
    const raw = await apiFetch<any[]>('/dashboard/signals/')
    const categories = Array.from(new Set(raw.map(item => item.signal__category || 'Operations')))
    return categories.map((cat, idx) => ({
      id: String(idx),
      label: cat,
    }))
  } catch {
    return []
  }
}
export const getSignals = () => withFallback('/signals/', [] as ProblemSignal[])

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export const getLeadKpis = async (): Promise<LeadKpi[]> => {
  try {
    const raw = await apiFetch<any>('/dashboard/overview/')
    return [
      { id: 'total', label: 'Total qualified', value: String(raw.discovered ?? 0), icon: UsersRound },
      { id: 'high-fit', label: 'High fit · 85+', value: String(raw.qualified ?? 0), note: '-', tone: 'up', icon: Target },
      { id: 'act-now', label: 'Act now', value: String(raw.contacted ?? 0), note: '-', tone: 'hot', icon: Zap },
      { id: 'unassigned', label: 'Positive replies', value: String(raw.positive ?? 0), note: '-', icon: Users },
    ]
  } catch {
    return [
      { id: 'total', label: 'Total qualified', value: '-', icon: UsersRound },
      { id: 'high-fit', label: 'High fit · 85+', value: '-', note: '-', tone: 'up', icon: Target },
      { id: 'act-now', label: 'Act now', value: '-', note: '-', tone: 'hot', icon: Zap },
      { id: 'unassigned', label: 'Positive replies', value: '-', note: '-', icon: Users },
    ]
  }
}
export const getLeads = async (): Promise<LeadRow[]> => {
  try {
    const raw = await apiFetch<any>('/leads/')
    const backendLeads: LeadRow[] = (raw.leads || []).map((lead: any) => {
      let windowVal: BuyingWindow = 'Researching'
      if (lead.analysis?.lead_score >= 85) windowVal = 'Act now'
      else if (lead.analysis?.lead_score >= 75) windowVal = 'This quarter'
      
      return {
        id: lead.id,
        name: lead.name,
        industry: lead.category || 'Operations',
        location: lead.address || 'Unknown',
        initials: lead.name.slice(0, 2).toUpperCase(),
        markTone: 'navy',
        problem: lead.analysis?.description || 'Needs operational optimization',
        signals: 4,
        sources: 2,
        window: windowVal,
        fitScore: lead.analysis?.lead_score || 70,
        owner: 'Priya Shah',
        ownerInitials: 'PS',
        lastSeen: '1d ago',
      }
    })
    return backendLeads
  } catch {
    return []
  }
}
export const getAccountDetail = (id: string) =>
  withFallback(`/leads/${id}/intelligence/`, accountDetails[id] ?? buildFallbackAccountDetail(id) ?? null)
export const getLeadSalesGuidance = (id: string) =>
  withFallback(`/leads/${id}/sales-guidance/`, { pitch: "Optimizing Last-Mile Routing..." })
export const postLeadFeedback = (id: string, body: any) =>
  withFallback(`/leads/${id}/feedback/`, { status: "feedback_saved" }, { method: 'POST', body })
export const postLeadCRMSync = (id: string, body: any) =>
  withFallback(`/leads/${id}/sync-crm/`, [{ external_id: "crm-comp-mock" }], { method: 'POST', body })

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */

export const getLists = () => withFallback('/lists/', [] as AccountList[])

/* ------------------------------------------------------------------ */
/* Campaigns                                                           */
/* ------------------------------------------------------------------ */

export const getCampaignMetrics = () => withFallback('/campaigns/enrollments/', [] as CampaignMetric[])
export const getCampaigns = () => withFallback('/campaigns/enrollments/', [] as Campaign[])
export const getPlaybooks = () => withFallback('/campaigns/enrollments/', [] as Playbook[])

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export const getAnalyticsMetrics = () => withFallback('/dashboard/overview/', analyticsMetrics as AnalyticsMetric[])
export const getFunnelStages = async (): Promise<FunnelStage[]> => {
  try {
    const raw = await apiFetch<any>('/dashboard/funnel/')
    const stageIdMap: Record<string, string> = {
      'Discovered': 'signals',
      'Qualified': 'qualified',
      'Contacted': 'contacted',
      'Replied': 'positive',
    }
    return (raw.stages || []).map((item: any) => ({
      id: stageIdMap[item.stage] || item.stage.toLowerCase(),
      label: item.stage,
      count: item.count,
      pct: `${item.conversion}%`,
      width: Math.min(100, Math.max(10, item.conversion)),
    }))
  } catch {
    return [
      { id: 'signals', label: 'Signals', count: 0, pct: '-', width: 10 },
      { id: 'qualified', label: 'Qualified', count: 0, pct: '-', width: 10 },
      { id: 'contacted', label: 'Contacted', count: 0, pct: '-', width: 10 },
      { id: 'positive', label: 'Positive reply', count: 0, pct: '-', width: 10 },
    ]
  }
}
export const getProblemPerformance = async (): Promise<ProblemPerformance[]> => {
  try {
    const raw = await apiFetch<any[]>('/dashboard/opportunities/')
    const tones = ['lime', 'blue', 'violet', 'amber']
    return raw.map((item, idx) => ({
      id: String(idx),
      problem: item.category || 'Operations',
      tone: tones[idx % tones.length] as any,
      accounts: item.count || 0,
      qualified: Math.ceil((item.count || 0) * 0.8),
      positiveReply: Math.ceil((item.count || 0) * 0.2),
      meetings: Math.ceil((item.count || 0) * 0.1),
      pipeline: `£${(item.count || 0) * 15}k`,
    }))
  } catch {
    return []
  }
}
export const getSourceRanking = async (): Promise<SourceRanking[]> => {
  try {
    const raw = await apiFetch<any[]>('/dashboard/opportunities/')
    return raw.map((item, idx) => ({
      id: String(idx),
      name: item.address || 'General geography',
      rate: `${item.average_score || 70}%`,
      bar: item.average_score || 70,
    }))
  } catch {
    return []
  }
}

/* Re-export the static insight payloads (no fetch needed, but kept in mockData for one source of truth). */
export { campaignInsight, funnelInsight, pipeline }
