import { apiFetch } from './client'
import type { DiscoveryRun, DiscoveryRunFilters, DiscoveryRunLeadFilters, DiscoveryRunLeadsResponse, DiscoveryRunLiveStatus, DiscoveryRunsResponse, LeadIntelligence } from '../types/prospecting'

const segment = (value: string) => encodeURIComponent(value)

export function getDiscoveryRuns(filters: DiscoveryRunFilters = {}, signal?: AbortSignal) {
  const query = new URLSearchParams()
  query.set('page', String(filters.page ?? 1)); query.set('page_size', String(filters.pageSize ?? 20))
  if (filters.status?.trim()) query.set('status', filters.status.trim())
  if (filters.search?.trim()) query.set('search', filters.search.trim())
  if (filters.campaignId?.trim()) query.set('campaign_id', filters.campaignId.trim())
  return apiFetch<DiscoveryRunsResponse>(`/discovery-runs/?${query.toString()}`, { signal })
}

export function getDiscoveryRun(runId: string, signal?: AbortSignal) {
  return apiFetch<DiscoveryRun>(`/discovery-runs/${segment(runId)}/`, { signal })
}

export function getDiscoveryRunLeads(runId: string, filters: DiscoveryRunLeadFilters = {}, signal?: AbortSignal) {
  const query = new URLSearchParams()
  query.set('page', String(filters.page ?? 1)); query.set('page_size', String(filters.pageSize ?? 20))
  if (filters.scoreMin !== '' && filters.scoreMin !== undefined) query.set('score_min', String(filters.scoreMin))
  if (filters.location?.trim()) query.set('location', filters.location.trim())
  if (filters.category?.trim()) query.set('category', filters.category.trim())
  return apiFetch<DiscoveryRunLeadsResponse>(`/discovery-runs/${segment(runId)}/leads/?${query.toString()}`, { signal })
}

export function getDiscoveryRunStatus(runId: string, signal?: AbortSignal) {
  return apiFetch<DiscoveryRunLiveStatus>(`/discover/${segment(runId)}/status/`, { signal })
}

export function getLeadIntelligence(leadId: string, signal?: AbortSignal) {
  return apiFetch<LeadIntelligence>(`/leads/${segment(leadId)}/intelligence/`, { signal })
}
