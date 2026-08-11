import { useState, useEffect } from 'react';
import type { LeadCompany } from '../types';
import { fetchLeadsDirectory, runDiscovery, resetCRMLeads } from '../api/prospecting';

export const useProspecting = () => {
  // Input search parameters
  const [prospectKeyword, setProspectKeyword] = useState('');
  const [prospectLocation, setProspectLocation] = useState('');
  
  // App-level status states
  const [prospectLeads, setProspectLeads] = useState<LeadCompany[]>([]);
  const [isProspecting, setIsProspecting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadCompany | null>(null);

  // Filter criteria states
  const [prospectFilterScore, setProspectFilterScore] = useState('');
  const [prospectFilterLocation, setProspectFilterLocation] = useState('');
  const [debouncedFilterLocation, setDebouncedFilterLocation] = useState('');
  const [prospectFilterCategory, setProspectFilterCategory] = useState('');
  
  // Pagination details
  const [prospectPage, setProspectPage] = useState(1);
  const [prospectTotalPages, setProspectTotalPages] = useState(1);
  const [prospectTotalCount, setProspectTotalCount] = useState(0);
  const [prospectCategoriesList, setProspectCategoriesList] = useState<string[]>([]);

  // Debounce Location input changes by 400ms to avoid overlapping API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterLocation(prospectFilterLocation);
    }, 400);
    return () => clearTimeout(handler);
  }, [prospectFilterLocation]);

  const loadLeads = async (pageOverride?: number) => {
    const targetPage = pageOverride !== undefined ? pageOverride : prospectPage;
    try {
      const data = await fetchLeadsDirectory({
        page: targetPage,
        pageSize: 10,
        scoreMin: prospectFilterScore || undefined,
        location: debouncedFilterLocation || undefined,
        category: prospectFilterCategory || undefined,
      });

      setProspectLeads(data.leads || []);
      setProspectTotalPages(data.total_pages || 1);
      setProspectTotalCount(data.total_count || 0);
      setProspectCategoriesList(data.categories || []);

      if (pageOverride !== undefined) {
        setProspectPage(pageOverride);
      }
    } catch (err) {
      console.error("Failed to load prospect leads in hook:", err);
    }
  };

  const triggerDiscovery = async () => {
    if (!prospectKeyword.trim() || !prospectLocation.trim()) {
      alert("Please enter both a sector/keyword and target location.");
      return;
    }
    setIsProspecting(true);
    try {
      await runDiscovery(prospectKeyword, prospectLocation);
      await loadLeads(1);
    } catch (err) {
      console.error("Discovery run failed:", err);
      alert("Failed to run discovery. Ensure backend is active.");
    } finally {
      setIsProspecting(false);
    }
  };

  const clearLeads = async () => {
    if (window.confirm("Are you sure you want to clear all lead history from the CRM?")) {
      try {
        await resetCRMLeads();
        setSelectedLead(null);
        await loadLeads(1);
      } catch (err) {
        console.error("Failed to reset leads:", err);
      }
    }
  };

  // Run fetch on load and when filters change
  useEffect(() => {
    loadLeads(1);
  }, [prospectFilterScore, debouncedFilterLocation, prospectFilterCategory]);

  return {
    prospectKeyword,
    setProspectKeyword,
    prospectLocation,
    setProspectLocation,
    prospectLeads,
    isProspecting,
    selectedLead,
    setSelectedLead,
    prospectFilterScore,
    setProspectFilterScore,
    prospectFilterLocation,
    setProspectFilterLocation,
    prospectFilterCategory,
    setProspectFilterCategory,
    prospectPage,
    prospectTotalPages,
    prospectTotalCount,
    prospectCategoriesList,
    triggerDiscovery,
    clearLeads,
    changePage: loadLeads,
  };
};
