import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, RefreshCw, Search, SearchX, UsersRound, Workflow } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getDiscoveryRuns } from '../api/prospecting'
import { PageLoader } from '../components/ui/PageLoader'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { DiscoveryRunsResponse } from '../types/prospecting'

const PAGE_SIZE = 20
const dateLabel = (value: string | null) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : null

export function DiscoveryRunsPage() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const status = params.get('status') || ''
  const urlSearch = params.get('search') || ''
  const [search, setSearch] = useState(urlSearch)
  const debouncedSearch = useDebouncedValue(search)
  const [data, setData] = useState<DiscoveryRunsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => setSearch(urlSearch), [urlSearch])
  useEffect(() => {
    if (debouncedSearch === urlSearch) return
    setParams((current) => { const next = new URLSearchParams(current); if (debouncedSearch) next.set('search', debouncedSearch); else next.delete('search'); next.set('page', '1'); return next }, { replace: true })
  }, [debouncedSearch, setParams, urlSearch])
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError(null)
    getDiscoveryRuns({ page, pageSize: PAGE_SIZE, status, search: urlSearch }, controller.signal)
      .then(setData)
      .catch((requestError: unknown) => { if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) setError('Discovery runs could not be loaded. Check the service and try again.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt, page, status, urlSearch])

  const setFilter = (key: string, value: string) => setParams((current) => { const next = new URLSearchParams(current); if (value) next.set(key, value); else next.delete(key); next.set('page', '1'); return next })
  const setPage = (value: number) => setParams((current) => { const next = new URLSearchParams(current); next.set('page', String(value)); return next })

  return <div className="page page-enter prospecting-page">
    <header className="page-header"><div className="page-heading-copy"><span className="page-eyebrow">Prospecting history</span><h1>Discovery runs.</h1><p>Choose a search to review its results and lead intelligence.</p></div></header>
    <section className="card prospecting-directory">
      <div className="prospecting-run-filters">
        <label><Search size={14} /><input aria-label="Search discovery runs" placeholder="Search keyword or location" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <select aria-label="Filter by status" value={status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All statuses</option><option value="pending">Pending</option><option value="running">Running</option><option value="completed">Completed</option><option value="failed">Failed</option></select>
      </div>
      {loading ? <PageLoader label="Loading discovery runs…" /> : error ? <div className="prospecting-state" role="alert"><SearchX size={23} /><h2>We couldn’t load discovery runs</h2><p>{error}</p><button className="button button-primary" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Try again</button></div> : !data?.discovery_runs.length ? <div className="prospecting-state"><Workflow size={24} /><h2>No discovery runs yet</h2><p>New prospecting searches will appear here.</p></div> : <>
        <div className="prospecting-run-list" aria-label="Discovery runs">{data.discovery_runs.map((run) => <Link className="prospecting-run-row" to={`/prospecting/discovery-runs/${encodeURIComponent(run.id)}`} key={run.id}>
          <div className="prospecting-run-main">
            <div className="prospecting-run-heading"><span className={`prospecting-status status-${run.status.toLowerCase()}`}>{run.status}</span><h2>{run.keyword || 'Untitled search'}</h2></div>
            <div className="prospecting-run-meta"><span><MapPin size={13} /> {run.location || 'Any location'}</span>{run.campaign?.name && run.campaign.name !== run.keyword ? <span><Workflow size={13} /> {run.campaign.name}</span> : null}</div>
          </div>
          <div className="prospecting-run-leads"><small>Leads collected</small><strong><UsersRound size={14} /> {run.lead_count.toLocaleString()}</strong>{run.total_leads_found > run.lead_count ? <span>{run.total_leads_found.toLocaleString()} found</span> : null}</div>
          <div className="prospecting-run-timeline"><small>{run.completed_at ? 'Completed' : 'Started'}</small><strong><CalendarDays size={13} /> {dateLabel(run.completed_at || run.started_at) || 'Date unavailable'}</strong></div>
          <span className="prospecting-run-open" aria-hidden="true"><ArrowRight size={17} /></span>
        </Link>)}</div>
        <div className="prospecting-pagination"><span>Page {data.page} of {Math.max(data.total_pages, 1)} · {data.total_count.toLocaleString()} runs</span><div><button className="button button-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="button button-secondary" disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>Next</button></div></div>
      </>}
    </section>
  </div>
}
