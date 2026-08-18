export type DiscoveryRunStatus = 'pending' | 'running' | 'completed' | 'failed' | string

export interface DiscoveryRun {
  id: string
  keyword: string
  location: string
  status: DiscoveryRunStatus
  total_leads_found: number
  lead_count: number
  new_lead_count: number
  duplicate_lead_count: number
  campaign: { id: string; name: string; status: string } | null
  prospecting_request: { id: string; status: string; objective: string | null; target: string | null; qualification: string | null } | null
  specification_version: { id: string; version: number; status: string } | null
  started_at: string
  completed_at: string | null
}

export interface DiscoveryRunsResponse {
  discovery_runs: DiscoveryRun[]
  total_count: number
  page: number
  page_size: number
  total_pages: number
}

export interface DiscoveryRunFilters { page?: number; pageSize?: number; status?: string; search?: string; campaignId?: string }

export interface ProspectingLead {
  id: string
  name: string
  website: string | null
  phone: string | null
  address: string | null
  category: string | null
  rating: number
  contacts: unknown[]
  analysis: Record<string, unknown>
  created_at: string
}

export interface DiscoveryRunLeadsResponse {
  leads: ProspectingLead[]
  total_count: number
  page: number
  page_size: number
  total_pages: number
  categories: string[]
}

export interface DiscoveryRunLeadFilters { page?: number; pageSize?: number; scoreMin?: string | number; location?: string; category?: string }
export interface DiscoveryRunLiveStatus { status: DiscoveryRunStatus; [key: string]: unknown }
export type LeadIntelligence = Record<string, unknown>
