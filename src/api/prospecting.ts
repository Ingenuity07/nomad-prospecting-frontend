import apiClient from './client';
import type { ProspectLeadsResponse } from '../types';

export const fetchLeadsDirectory = async (filters: {
  page: number;
  pageSize: number;
  scoreMin?: string;
  location?: string;
  category?: string;
}): Promise<ProspectLeadsResponse> => {
  const params = new URLSearchParams();
  params.append('page', filters.page.toString());
  params.append('page_size', filters.pageSize.toString());

  if (filters.scoreMin) params.append('score_min', filters.scoreMin);
  if (filters.location?.trim()) params.append('location', filters.location.trim());
  if (filters.category) params.append('category', filters.category);

  const response = await apiClient.get<ProspectLeadsResponse>(`/prospecting/leads/?${params.toString()}`);
  return response.data;
};

export const runDiscovery = async (keyword: string, location: string): Promise<void> => {
  await apiClient.post('/prospecting/discover/', { keyword, location });
};

export const resetCRMLeads = async (): Promise<void> => {
  await apiClient.post('/prospecting/reset/');
};
