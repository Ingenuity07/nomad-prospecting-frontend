export interface LeadContact {
  email: string;
  linkedin: string;
}

export interface WebsiteAnalysis {
  lead_score: number;
  fleet_size_estimate: string;
  has_delivery: boolean;
  has_scheduling: boolean;
  needs_routing: boolean;
  description: string;
  lead_score_reason: string;
}

export interface LeadCompany {
  id: string;
  name: string;
  website: string;
  category: string;
  address: string;
  analysis?: WebsiteAnalysis;
  contacts?: LeadContact[];
}

export interface ProspectLeadsResponse {
  leads: LeadCompany[];
  total_pages: number;
  total_count: number;
  categories: string[];
}
