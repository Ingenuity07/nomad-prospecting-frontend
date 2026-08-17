import { apiFetch } from './client'
import type {
  CampaignLeadFilters,
  CampaignLeadsResponse,
  CampaignsResponse,
  LeadIntelligence,
  ProspectingCampaign,
} from '../types/prospecting'

const segment = (value: string) => encodeURIComponent(value)

export function getCampaigns(signal?: AbortSignal) {
  return apiFetch<CampaignsResponse>('/campaigns/', { signal })
}

export function getCampaign(campaignId: string, signal?: AbortSignal) {
  return apiFetch<ProspectingCampaign>(`/campaigns/${segment(campaignId)}/`, { signal })
}

export function getCampaignLeads(campaignId: string, filters: CampaignLeadFilters = {}, signal?: AbortSignal) {
  const query = new URLSearchParams()
  query.set('page', String(filters.page ?? 1))
  query.set('page_size', String(filters.pageSize ?? 20))
  if (filters.scoreMin !== '' && filters.scoreMin !== undefined) query.set('score_min', String(filters.scoreMin))
  if (filters.location?.trim()) query.set('location', filters.location.trim())
  if (filters.category?.trim()) query.set('category', filters.category.trim())
  return apiFetch<CampaignLeadsResponse>(`/campaigns/${segment(campaignId)}/leads/?${query.toString()}`, { signal })
}

export function getLeadIntelligence(leadId: string, signal?: AbortSignal) {
  return apiFetch<LeadIntelligence>(`/leads/${segment(leadId)}/intelligence/`, { signal })
}
