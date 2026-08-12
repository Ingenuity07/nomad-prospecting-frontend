import { API } from '../constants'
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
} from '../types'
import { apiFetch } from './client'
import {
  accountDetails,
  accountLists,
  analyticsMetrics,
  buildFallbackAccountDetail,
  campaignInsight,
  campaignMetrics,
  campaigns,
  discoveryProblem,
  funnelInsight,
  funnelStages,
  leadKpis,
  leads,
  mockDashboard,
  pipeline,
  playbooks,
  problemPerformance,
  signalCategories,
  signalStats,
  signals,
  sourceRanking,
} from './mockData'

type Loader<T> = () => Promise<T>

/** Try the backend; on any failure fall back to the bundled mock data. */
async function withFallback<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    return await apiFetch<T>(endpoint)
  } catch {
    return fallback
  }
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

export const getDashboard: Loader<DashboardData> = () => withFallback(API.endpoints.dashboard, mockDashboard)
export const getMetrics: Loader<WorkspaceMetric[]> = () => withFallback(API.endpoints.metrics, mockDashboard.metrics)
export const getProblems: Loader<ProblemCluster[]> = () => withFallback(API.endpoints.problems, mockDashboard.problems)
export const getSignalPulse: Loader<SignalPulse> = () => withFallback(API.endpoints.signalPulse, mockDashboard.pulse)
export const getPriorityAccounts: Loader<PriorityAccount[]> = () => withFallback(API.endpoints.priorityAccounts, mockDashboard.priorityAccounts)
export const getActivity: Loader<DashboardData['activity']> = () => withFallback(API.endpoints.activity, mockDashboard.activity)

/* ------------------------------------------------------------------ */
/* Discover                                                            */
/* ------------------------------------------------------------------ */

export const getDiscoveryProblem = () => withFallback('/discover/problem', discoveryProblem)
export const getEvidenceOptions = () => withFallback('/discover/evidence', discoveryProblem.evidence as EvidenceOption[])

/* ------------------------------------------------------------------ */
/* Signals                                                             */
/* ------------------------------------------------------------------ */

export const getSignalStats = () => withFallback('/signals/stats', signalStats as SignalStat[])
export const getSignalCategories = () => withFallback('/signals/categories', signalCategories as SignalCategory[])
export const getSignals = () => withFallback('/signals', signals as ProblemSignal[])

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export const getLeadKpis = () => withFallback('/leads/kpis', leadKpis as LeadKpi[])
export const getLeads = () => withFallback('/leads', leads as LeadRow[])
export const getAccountDetail = (id: string) =>
  withFallback(`/leads/${id}`, accountDetails[id] ?? buildFallbackAccountDetail(id) ?? null)

/* ------------------------------------------------------------------ */
/* Lists                                                               */
/* ------------------------------------------------------------------ */

export const getLists = () => withFallback('/lists', accountLists as AccountList[])

/* ------------------------------------------------------------------ */
/* Campaigns                                                           */
/* ------------------------------------------------------------------ */

export const getCampaignMetrics = () => withFallback('/campaigns/metrics', campaignMetrics as CampaignMetric[])
export const getCampaigns = () => withFallback('/campaigns', campaigns as Campaign[])
export const getPlaybooks = () => withFallback('/campaigns/playbooks', playbooks as Playbook[])

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export const getAnalyticsMetrics = () => withFallback('/analytics/metrics', analyticsMetrics as AnalyticsMetric[])
export const getFunnelStages = () => withFallback('/analytics/funnel', funnelStages as FunnelStage[])
export const getProblemPerformance = () => withFallback('/analytics/performance', problemPerformance as ProblemPerformance[])
export const getSourceRanking = () => withFallback('/analytics/sources', sourceRanking as SourceRanking[])

/* Re-export the static insight payloads (no fetch needed, but kept in mockData for one source of truth). */
export { campaignInsight, funnelInsight, pipeline }
