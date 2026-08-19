import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DiscoveryRunsPage } from './DiscoveryRunsPage'
import { DiscoveryRunLeadsPage } from './DiscoveryRunLeadsPage'
import * as api from '../api/prospecting'

vi.mock('../api/prospecting')

const run = { id: 'run one', keyword: 'fleet software', location: 'Leeds', status: 'completed', total_leads_found: 80, lead_count: 42, new_lead_count: 35, duplicate_lead_count: 7, campaign: { id: 'c1', name: 'UK Fleets', status: 'ACTIVE' }, prospecting_request: { id: 'p1', status: 'complete', objective: 'Find fleet operators', target: 'UK logistics', qualification: '20+ vehicles' }, specification_version: null, started_at: '2026-08-01T00:00:00Z', completed_at: '2026-08-01T01:00:00Z' }
const runsResponse = { discovery_runs: [run], total_count: 41, page: 1, page_size: 20, total_pages: 3 }
const leadsResponse = { leads: [{ id: 'lead one', name: 'Acme Logistics', website: 'https://acme.example', phone: '123', address: 'Leeds', category: 'Logistics', rating: 8.7, contacts: [], analysis: { lead_score: 86, lead_score_reason: 'Growing fleet with manual scheduling', needs_routing: true }, created_at: '2026-08-01' }], total_count: 1, page: 1, page_size: 20, total_pages: 2, categories: ['Logistics'] }

function Location() { const value = useLocation(); return <output data-testid="location">{value.pathname}{value.search}</output> }
function renderRuns(entry = '/prospecting/discovery-runs') { return render(<MemoryRouter initialEntries={[entry]}><Routes><Route path="/prospecting/discovery-runs" element={<DiscoveryRunsPage />} /><Route path="/prospecting/discovery-runs/:runId" element={<Location />} /></Routes></MemoryRouter>) }
function renderRun(entry = '/prospecting/discovery-runs/run%20one') { return render(<MemoryRouter initialEntries={[entry]}><Routes><Route path="/prospecting/discovery-runs/:runId" element={<DiscoveryRunLeadsPage />} /><Route path="/leads/:leadId" element={<Location />} /></Routes></MemoryRouter>) }

describe('discovery run prospecting flow', () => {
  afterEach(() => { cleanup(); vi.useRealTimers() })
  beforeEach(() => { vi.resetAllMocks(); vi.mocked(api.getDiscoveryRuns).mockResolvedValue(runsResponse); vi.mocked(api.getDiscoveryRun).mockResolvedValue(run); vi.mocked(api.getDiscoveryRunLeads).mockResolvedValue(leadsResponse) })

  it('loads campaigns and shows an empty history', async () => {
    let resolve!: (value: typeof runsResponse) => void
    vi.mocked(api.getDiscoveryRuns).mockReturnValue(new Promise((done) => { resolve = done }))
    const view = renderRuns(); expect(screen.getByText('Loading campaigns…')).toBeInTheDocument(); resolve({ ...runsResponse, discovery_runs: [], total_count: 0, total_pages: 0 }); expect(await screen.findByText('No campaigns yet')).toBeInTheDocument(); view.unmount()
  })

  it('filters by status and resets pagination', async () => {
    renderRuns('/prospecting/discovery-runs?page=3'); fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'running' } }); await waitFor(() => expect(api.getDiscoveryRuns).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, status: 'running' }), expect.any(AbortSignal)))
  })

  it('searches by keyword or location', async () => {
    renderRuns(); fireEvent.change(screen.getByLabelText('Search campaigns'), { target: { value: 'Leeds' } }); await waitFor(() => expect(api.getDiscoveryRuns).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'Leeds' }), expect.any(AbortSignal)), { timeout: 1000 })
  })

  it('uses server-side pagination', async () => {
    renderRuns(); fireEvent.click(await screen.findByRole('button', { name: 'Next' })); await waitFor(() => expect(api.getDiscoveryRuns).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }), expect.any(AbortSignal)))
  })

  it('opens the selected run', async () => {
    renderRuns(); fireEvent.click(await screen.findByText('UK Logistics')); expect(screen.getByTestId('location')).toHaveTextContent('/prospecting/discovery-runs/run%20one')
  })

  it('displays run metrics and request metadata', async () => {
    renderRun(); expect(await screen.findByLabelText('Run metrics')).toHaveTextContent('80'); expect(screen.getByLabelText('Run metrics')).toHaveTextContent('42'); expect(screen.getByText('Find fleet operators')).toBeInTheDocument(); expect(screen.getByRole('heading', { name: 'UK Logistics' })).toBeInTheDocument(); expect(screen.getByText('UK Fleets')).toBeInTheDocument(); expect(screen.getByRole('link', { name: /edit & rerun/i })).toHaveAttribute('href', expect.stringContaining('problem=Find+fleet+operators'))
  })

  it('fetches only run-specific leads and resets lead pagination on filters', async () => {
    renderRun('/prospecting/discovery-runs/run%20one?page=2'); await waitFor(() => expect(api.getDiscoveryRunLeads).toHaveBeenCalledWith('run one', expect.objectContaining({ page: 2 }), expect.any(AbortSignal))); fireEvent.change(await screen.findByLabelText('Filter by category'), { target: { value: 'Logistics' } }); await waitFor(() => expect(api.getDiscoveryRunLeads).toHaveBeenLastCalledWith('run one', expect.objectContaining({ page: 1, category: 'Logistics' }), expect.any(AbortSignal)))
  })

  it('polls an active run', async () => {
    vi.useFakeTimers(); vi.mocked(api.getDiscoveryRun).mockResolvedValue({ ...run, status: 'running' }); vi.mocked(api.getDiscoveryRunStatus).mockResolvedValue({ status: 'running' }); renderRun(); await act(async () => { await Promise.resolve(); await Promise.resolve() }); await act(async () => { await vi.advanceTimersByTimeAsync(3000) }); expect(api.getDiscoveryRunStatus).toHaveBeenCalledWith('run one', expect.any(AbortSignal))
  })

  it('stops polling and refreshes after completion', async () => {
    vi.useFakeTimers(); vi.mocked(api.getDiscoveryRun).mockResolvedValueOnce({ ...run, status: 'running' }).mockResolvedValue(run); vi.mocked(api.getDiscoveryRunStatus).mockResolvedValue({ status: 'completed' }); renderRun(); await act(async () => { await Promise.resolve(); await Promise.resolve() }); await act(async () => { await vi.advanceTimersByTimeAsync(3000); await Promise.resolve() }); expect(api.getDiscoveryRunStatus).toHaveBeenCalledTimes(1); expect(api.getDiscoveryRun).toHaveBeenCalledTimes(2); await act(async () => { await vi.advanceTimersByTimeAsync(6000) }); expect(api.getDiscoveryRunStatus).toHaveBeenCalledTimes(1)
  })

  it('opens the full lead intelligence page', async () => {
    renderRun(); fireEvent.click(await screen.findByText('Acme Logistics')); expect(screen.getByTestId('location')).toHaveTextContent('/leads/lead%20one?from=%2Fprospecting%2Fdiscovery-runs%2Frun%2520one')
  })

  it('shows useful qualification data in the lead list', async () => {
    renderRun(); expect(await screen.findByText('Growing fleet with manual scheduling')).toBeInTheDocument(); expect(screen.getByText('Routing need')).toBeInTheDocument(); expect(screen.getByText('86')).toBeInTheDocument(); expect(screen.getByText('Contact available')).toBeInTheDocument()
  })
})
