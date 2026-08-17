import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, RefreshCw, SearchX, UsersRound, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCampaigns } from '../api/prospecting'
import { PageLoader } from '../components/ui/PageLoader'
import type { ProspectingCampaign } from '../types/prospecting'

function geographyLabel(geography: Record<string, unknown>) {
  const values = Object.values(geography).flatMap((value) => Array.isArray(value) ? value : [value])
  return values.filter((value): value is string | number => ['string', 'number'].includes(typeof value)).join(', ') || 'Not specified'
}

function dateLabel(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export function ProspectingCampaignsPage() {
  const [campaigns, setCampaigns] = useState<ProspectingCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getCampaigns(controller.signal)
      .then((response) => setCampaigns(response.campaigns))
      .catch((requestError: unknown) => {
        if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) setError('Campaigns could not be loaded. Check the service and try again.')
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])

  return (
    <div className="page page-enter prospecting-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Campaign prospecting</span>
          <h1>Choose a campaign.</h1>
          <p>Review the leads discovered for a specific product, problem, and market.</p>
        </div>
      </header>

      {loading ? <PageLoader label="Loading campaigns…" /> : error ? (
        <section className="card prospecting-state" role="alert">
          <SearchX size={24} /><h2>We couldn’t load campaigns</h2><p>{error}</p>
          <button className="button button-primary" type="button" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Try again</button>
        </section>
      ) : campaigns.length === 0 ? (
        <section className="card prospecting-state"><Workflow size={24} /><h2>No campaigns yet</h2><p>Create a campaign in the API to start collecting targeted leads.</p></section>
      ) : (
        <section className="prospecting-campaign-grid" aria-label="Campaigns">
          {campaigns.map((campaign) => (
            <Link className="card prospecting-campaign-card" to={`/leads/campaigns/${encodeURIComponent(campaign.id)}`} key={campaign.id}>
              <div className="prospecting-card-head"><span className={`prospecting-status status-${campaign.status.toLowerCase()}`}>{campaign.status}</span><ArrowRight size={16} /></div>
              <h2>{campaign.name}</h2>
              <p>{campaign.description || campaign.problem_statement}</p>
              <dl>
                <div><dt><UsersRound size={14} /> Leads</dt><dd>{campaign.lead_count.toLocaleString()}</dd></div>
                <div><dt><Workflow size={14} /> Discovery runs</dt><dd>{campaign.discovery_run_count.toLocaleString()}</dd></div>
                <div><dt><MapPin size={14} /> Geography</dt><dd>{geographyLabel(campaign.geography)}</dd></div>
                <div><dt><CalendarDays size={14} /> Created</dt><dd>{dateLabel(campaign.created_at)}</dd></div>
              </dl>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}
