import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Phone, RefreshCw, Search, SearchX, Star, X } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getDiscoveryRun, getDiscoveryRunLeads, getDiscoveryRunStatus, getLeadIntelligence } from '../api/prospecting'
import { PageLoader } from '../components/ui/PageLoader'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { DiscoveryRun, DiscoveryRunLeadsResponse, LeadIntelligence } from '../types/prospecting'

const PAGE_SIZE = 20
const POLL_INTERVAL = 3000
const readableKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
const displayValue = (value: unknown) => ['string', 'number', 'boolean'].includes(typeof value) ? String(value) : JSON.stringify(value, null, 2)
const dateLabel = (value: string | null) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'
const isActive = (status?: string) => status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'running'

export function DiscoveryRunLeadsPage() {
  const { runId = '', leadId } = useParams<{ runId: string; leadId?: string }>()
  const navigate = useNavigate(); const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1); const category = params.get('category') || ''; const urlLocation = params.get('location') || ''; const urlScore = params.get('score_min') || ''
  const [location, setLocation] = useState(urlLocation); const [score, setScore] = useState(urlScore)
  const debouncedLocation = useDebouncedValue(location); const debouncedScore = useDebouncedValue(score)
  const [run, setRun] = useState<DiscoveryRun | null>(null); const [data, setData] = useState<DiscoveryRunLeadsResponse | null>(null)
  const [runError, setRunError] = useState<string | null>(null); const [leadsError, setLeadsError] = useState<string | null>(null); const [loading, setLoading] = useState(true); const [attempt, setAttempt] = useState(0); const [refresh, setRefresh] = useState(0)
  const [intelligence, setIntelligence] = useState<LeadIntelligence | null>(null); const [detailLoading, setDetailLoading] = useState(false); const [detailError, setDetailError] = useState<string | null>(null)

  useEffect(() => { setLocation(urlLocation); setScore(urlScore) }, [runId, urlLocation, urlScore])
  useEffect(() => { if (debouncedLocation === urlLocation && debouncedScore === urlScore) return; setParams((current) => { const next = new URLSearchParams(current); if (debouncedLocation) next.set('location', debouncedLocation); else next.delete('location'); if (debouncedScore) next.set('score_min', debouncedScore); else next.delete('score_min'); next.set('page', '1'); return next }, { replace: true }) }, [debouncedLocation, debouncedScore, setParams, urlLocation, urlScore])

  useEffect(() => { const controller = new AbortController(); setRunError(null); getDiscoveryRun(runId, controller.signal).then(setRun).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) setRunError('Discovery run details could not be loaded.') }); return () => controller.abort() }, [attempt, refresh, runId])
  useEffect(() => { const controller = new AbortController(); setLoading(true); setLeadsError(null); getDiscoveryRunLeads(runId, { page, pageSize: PAGE_SIZE, category, location: urlLocation, scoreMin: urlScore }, controller.signal).then(setData).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) setLeadsError('Leads could not be loaded for this discovery run.') }).finally(() => { if (!controller.signal.aborted) setLoading(false) }); return () => controller.abort() }, [attempt, category, page, refresh, runId, urlLocation, urlScore])

  const completePoll = useCallback(() => setRefresh((value) => value + 1), [])
  useEffect(() => {
    if (!isActive(run?.status)) return
    const controller = new AbortController(); let timer: number | undefined
    const poll = async () => { try { const live = await getDiscoveryRunStatus(runId, controller.signal); if (controller.signal.aborted) return; setRun((current) => current ? { ...current, status: live.status } : current); if (isActive(live.status)) timer = window.setTimeout(poll, POLL_INTERVAL); else completePoll() } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) timer = window.setTimeout(poll, POLL_INTERVAL) } }
    timer = window.setTimeout(poll, POLL_INTERVAL)
    return () => { controller.abort(); if (timer) window.clearTimeout(timer) }
  }, [completePoll, run?.status, runId])

  useEffect(() => { setIntelligence(null); setDetailError(null); if (!leadId) return; const controller = new AbortController(); setDetailLoading(true); getLeadIntelligence(leadId, controller.signal).then(setIntelligence).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) setDetailError('Lead intelligence could not be loaded.') }).finally(() => { if (!controller.signal.aborted) setDetailLoading(false) }); return () => controller.abort() }, [leadId])

  const selectedLead = useMemo(() => data?.leads.find((lead) => lead.id === leadId), [data, leadId])
  const updateParam = (key: string, value: string) => setParams((current) => { const next = new URLSearchParams(current); if (value) next.set(key, value); else next.delete(key); next.set('page', '1'); return next })
  const changePage = (value: number) => setParams((current) => { const next = new URLSearchParams(current); next.set('page', String(value)); return next })
  const routeBase = `/prospecting/discovery-runs/${encodeURIComponent(runId)}`
  const openLead = (id: string) => navigate({ pathname: `${routeBase}/leads/${encodeURIComponent(id)}`, search: params.toString() }); const closeLead = () => navigate({ pathname: routeBase, search: params.toString() })

  return <div className="page page-enter prospecting-page">
    <Link className="prospecting-back" to="/prospecting/discovery-runs"><ArrowLeft size={14} /> All discovery runs</Link>
    <header className="page-header prospecting-leads-header"><div className="page-heading-copy"><span className="page-eyebrow">Discovery run {run && <span className={`prospecting-status status-${run.status.toLowerCase()}`}>{run.status}</span>}</span><h1>{run?.keyword || 'Discovery run'}</h1><p>{run ? `${run.location || 'Any location'} · Started ${dateLabel(run.started_at)} · Completed ${dateLabel(run.completed_at)}` : 'Loading run details…'}</p></div></header>
    {runError && <section className="card prospecting-inline-error" role="alert">{runError}<button className="button button-secondary" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Retry</button></section>}
    {run && <><section className="prospecting-metrics" aria-label="Run metrics"><article className="card"><span>Provider leads</span><strong>{run.total_leads_found.toLocaleString()}</strong></article><article className="card"><span>Connected leads</span><strong>{run.lead_count.toLocaleString()}</strong></article><article className="card"><span>New leads</span><strong>{run.new_lead_count.toLocaleString()}</strong></article><article className="card"><span>Duplicate leads</span><strong>{run.duplicate_lead_count.toLocaleString()}</strong></article></section>
      <section className="card prospecting-run-context"><div><small>Linked campaign</small><strong>{run.campaign?.name || 'No campaign linked'}</strong>{run.campaign && <span>{run.campaign.status}</span>}</div>{run.prospecting_request && <><div><small>Original objective</small><p>{run.prospecting_request.objective || '—'}</p></div><div><small>Target</small><p>{run.prospecting_request.target || '—'}</p></div><div><small>Qualification</small><p>{run.prospecting_request.qualification || '—'}</p></div></>}</section></>}
    <section className="card prospecting-directory"><div className="prospecting-filters"><label><Search size={14} /><input aria-label="Filter by location" placeholder="Location" value={location} onChange={(event) => setLocation(event.target.value)} /></label><label><Star size={14} /><input aria-label="Minimum score" type="number" min="0" step="0.1" placeholder="Minimum score" value={score} onChange={(event) => setScore(event.target.value)} /></label><select aria-label="Filter by category" value={category} onChange={(event) => updateParam('category', event.target.value)}><option value="">All categories</option>{data?.categories.map((item) => <option key={item}>{item}</option>)}</select></div>
      {loading ? <PageLoader label="Loading discovery run leads…" /> : leadsError ? <div className="prospecting-state" role="alert"><SearchX size={23} /><h2>We couldn’t load these leads</h2><p>{leadsError}</p><button className="button button-primary" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Try again</button></div> : !data?.leads.length ? <div className="prospecting-state"><SearchX size={23} /><h2>No matching leads</h2><p>Adjust the filters or wait for this run to return results.</p></div> : <><div className="table-wrap"><table className="data-table prospecting-leads-table"><thead><tr><th>Lead</th><th>Category</th><th>Location</th><th>Rating</th><th>Contact</th><th /></tr></thead><tbody>{data.leads.map((lead) => <tr key={lead.id} tabIndex={0} onClick={() => openLead(lead.id)} onKeyDown={(event) => { if (event.key === 'Enter') openLead(lead.id) }}><td><strong>{lead.name}</strong>{lead.website && <a href={lead.website} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{lead.website.replace(/^https?:\/\//, '')} <ExternalLink size={10} /></a>}</td><td>{lead.category || '—'}</td><td><span className="prospecting-cell-icon"><MapPin size={13} />{lead.address || '—'}</span></td><td><span className="prospecting-rating"><Star size={13} />{lead.rating ?? '—'}</span></td><td><span className="prospecting-cell-icon"><Phone size={13} />{lead.phone || '—'}</span></td><td><ArrowRight size={14} /></td></tr>)}</tbody></table></div><div className="prospecting-pagination"><span>Page {data.page} of {Math.max(data.total_pages, 1)}</span><div><button className="button button-secondary" disabled={page <= 1} onClick={() => changePage(page - 1)}>Previous</button><button className="button button-secondary" disabled={page >= data.total_pages} onClick={() => changePage(page + 1)}>Next</button></div></div></>}
    </section>
    {leadId && <div className="prospecting-drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLead() }}><aside className="prospecting-drawer" role="dialog" aria-modal="true"><div className="prospecting-drawer-head"><div><span className="page-eyebrow">Lead intelligence</span><h2>{selectedLead?.name || 'Lead details'}</h2></div><button onClick={closeLead} aria-label="Close lead details"><X size={18} /></button></div>{detailLoading ? <PageLoader label="Loading intelligence…" /> : detailError ? <div className="prospecting-state" role="alert"><SearchX size={22} /><h2>Intelligence unavailable</h2><p>{detailError}</p></div> : intelligence && Object.keys(intelligence).length ? <div className="prospecting-intelligence">{Object.entries(intelligence).map(([key, value]) => <section key={key}><h3>{readableKey(key)}</h3><pre>{displayValue(value)}</pre></section>)}</div> : <div className="prospecting-state"><SearchX size={22} /><h2>No intelligence yet</h2></div>}</aside></div>}
  </div>
}
