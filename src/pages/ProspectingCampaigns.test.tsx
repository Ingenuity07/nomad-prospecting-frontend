import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProspectingCampaignsPage } from './ProspectingCampaignsPage'
import { ProspectingCampaignLeadsPage } from './ProspectingCampaignLeadsPage'
import * as api from '../api/prospecting'

vi.mock('../api/prospecting')

const campaign = { id: 'campaign one', name: 'UK Fleets', description: 'Fleet operators', product_description: 'Routing', problem_statement: 'Manual planning', geography: { country: 'UK' }, status: 'ACTIVE' as const, lead_count: 42, discovery_run_count: 3, created_at: '2026-08-01T00:00:00Z', updated_at: '2026-08-02T00:00:00Z' }
const leadsResponse = { leads: [{ id: 'lead one', name: 'Acme Logistics', website: 'https://acme.test', phone: '123', address: 'Leeds', category: 'Logistics', rating: 8.7, contacts: [], analysis: {}, created_at: '2026-08-01' }], total_count: 1, page: 1, page_size: 20, total_pages: 2, categories: ['Logistics'] }

function Location() { return <output data-testid="location">{useLocation().pathname}{useLocation().search}</output> }
function renderCampaigns() { return render(<MemoryRouter initialEntries={['/leads']}><Routes><Route path="/leads" element={<ProspectingCampaignsPage />} /><Route path="/leads/campaigns/:campaignId" element={<Location />} /></Routes></MemoryRouter>) }
function renderLeads() { return render(<MemoryRouter initialEntries={['/leads/campaigns/campaign%20one']}><Routes><Route path="/leads/campaigns/:campaignId" element={<ProspectingCampaignLeadsPage />} /><Route path="/leads/campaigns/:campaignId/leads/:leadId" element={<ProspectingCampaignLeadsPage />} /></Routes></MemoryRouter>) }

describe('campaign prospecting flow', () => {
  afterEach(cleanup)
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(api.getCampaign).mockResolvedValue(campaign)
    vi.mocked(api.getCampaignLeads).mockResolvedValue(leadsResponse)
  })

  it('shows campaign loading and empty states', async () => {
    let resolve!: (value: { campaigns: [] }) => void
    vi.mocked(api.getCampaigns).mockReturnValue(new Promise((done) => { resolve = done }))
    renderCampaigns()
    expect(screen.getByText('Loading campaigns…')).toBeInTheDocument()
    resolve({ campaigns: [] })
    expect(await screen.findByText('No campaigns yet')).toBeInTheDocument()
  })

  it('shows a campaign error state', async () => {
    vi.mocked(api.getCampaigns).mockRejectedValue(new Error('offline'))
    renderCampaigns()
    expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load campaigns')
  })

  it('navigates to the selected campaign with an encoded id', async () => {
    vi.mocked(api.getCampaigns).mockResolvedValue({ campaigns: [campaign] })
    renderCampaigns()
    fireEvent.click(await screen.findByText('UK Fleets'))
    expect(screen.getByTestId('location')).toHaveTextContent('/leads/campaigns/campaign%20one')
  })

  it('shows lead loading, error, and empty states', async () => {
    let reject!: (error: Error) => void
    vi.mocked(api.getCampaignLeads).mockReturnValue(new Promise((_resolve, fail) => { reject = fail }))
    const view = renderLeads()
    expect(screen.getByRole('status', { name: 'Loading campaign leads…' })).toBeInTheDocument()
    reject(new Error('offline'))
    expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t load these leads')
    view.unmount()
    vi.mocked(api.getCampaignLeads).mockResolvedValue({ ...leadsResponse, leads: [], total_count: 0, total_pages: 0 })
    renderLeads()
    expect(await screen.findByText('No matching leads')).toBeInTheDocument()
  })

  it('changes pages without dropping campaign filters', async () => {
    renderLeads()
    fireEvent.click(await screen.findByRole('button', { name: 'Next' }))
    await waitFor(() => expect(api.getCampaignLeads).toHaveBeenLastCalledWith('campaign one', expect.objectContaining({ page: 2 }), expect.any(AbortSignal)))
  })

  it('opens a lead and loads its intelligence', async () => {
    vi.mocked(api.getLeadIntelligence).mockResolvedValue({ summary: 'Strong operational fit' })
    renderLeads()
    fireEvent.click(await screen.findByText('Acme Logistics'))
    expect(await screen.findByRole('dialog')).toHaveTextContent('Strong operational fit')
    expect(api.getLeadIntelligence).toHaveBeenCalledWith('lead one', expect.any(AbortSignal))
  })
})
