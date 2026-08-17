export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'

export interface ProspectingCampaign {
  id: string
  name: string
  description: string | null
  product_description: string
  problem_statement: string
  geography: Record<string, unknown>
  status: CampaignStatus
  lead_count: number
  discovery_run_count: number
  created_at: string
  updated_at: string
}

export interface CampaignsResponse { campaigns: ProspectingCampaign[] }

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

export interface CampaignLeadsResponse {
  leads: ProspectingLead[]
  total_count: number
  page: number
  page_size: number
  total_pages: number
  categories: string[]
}

export interface CampaignLeadFilters {
  page?: number
  pageSize?: number
  scoreMin?: string | number
  location?: string
  category?: string
}

export type LeadIntelligence = Record<string, unknown>
