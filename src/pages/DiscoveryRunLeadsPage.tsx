import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Pencil, Phone, RefreshCw, Search, SearchX, Star } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getDiscoveryRun, getDiscoveryRunLeads, getDiscoveryRunStatus } from '../api/prospecting'
import { PageLoader } from '../components/ui/PageLoader'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import type { DiscoveryRun, DiscoveryRunLeadsResponse } from '../types/prospecting'
import { conciseCampaignName } from '../utils/prospecting'

const PAGE_SIZE = 20
const POLL_INTERVAL = 3000
const dateLabel = (value: string | null) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'
const isActive = (status?: string) => status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'running'
const leadScore = (lead: DiscoveryRunLeadsResponse['leads'][number]) => Number(lead.analysis?.lead_score) || null
const leadSummary = (lead: DiscoveryRunLeadsResponse['leads'][number]) => String(lead.analysis?.lead_score_reason || lead.analysis?.description || '')
const leadSignals = (lead: DiscoveryRunLeadsResponse['leads'][number]) => [
  lead.analysis?.needs_routing && 'Routing need',
  lead.analysis?.has_scheduling && 'Scheduling',
  lead.analysis?.has_delivery && 'Delivery',
  lead.analysis?.fleet_size_estimate && `Fleet ${lead.analysis.fleet_size_estimate}`,
].filter(Boolean) as string[]

export function DiscoveryRunLeadsPage() {
  const { runId = '' } = useParams<{ runId: string }>()
  const navigate = useNavigate(); const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1); const category = params.get('category') || ''; const urlLocation = params.get('location') || ''; const urlScore = params.get('score_min') || ''
  const [location, setLocation] = useState(urlLocation); const [score, setScore] = useState(urlScore)
  const debouncedLocation = useDebouncedValue(location); const debouncedScore = useDebouncedValue(score)
  const [run, setRun] = useState<DiscoveryRun | null>(null); const [data, setData] = useState<DiscoveryRunLeadsResponse | null>(null)
  const [runError, setRunError] = useState<string | null>(null); const [leadsError, setLeadsError] = useState<string | null>(null); const [loading, setLoading] = useState(true); const [attempt, setAttempt] = useState(0); const [refresh, setRefresh] = useState(0)

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

  const updateParam = (key: string, value: string) => setParams((current) => { const next = new URLSearchParams(current); if (value) next.set(key, value); else next.delete(key); next.set('page', '1'); return next })
  const changePage = (value: number) => setParams((current) => { const next = new URLSearchParams(current); next.set('page', String(value)); return next })
  const routeBase = `/prospecting/discovery-runs/${encodeURIComponent(runId)}`
  const openLead = (id: string) => navigate(`/leads/${encodeURIComponent(id)}?from=${encodeURIComponent(routeBase)}`)
  const rerunParams = new URLSearchParams({ rerun: runId, sell: run?.prospecting_request?.target || '', problem: run?.prospecting_request?.objective || run?.keyword || '', location: run?.location || '' })

  return <div className="page page-enter prospecting-page">
    <Link className="prospecting-back" to="/prospecting/campaigns"><ArrowLeft size={14} /> All campaigns</Link>
    <header className="page-header prospecting-leads-header"><div className="page-heading-copy"><span className="page-eyebrow">Campaign {run && <span className={`prospecting-status status-${run.status.toLowerCase()}`}>{run.status}</span>}</span><h1>{conciseCampaignName(run)}</h1><p>{run ? `${run.location || 'Any location'} · Started ${dateLabel(run.started_at)} · Completed ${dateLabel(run.completed_at)}` : 'Loading campaign details…'}</p></div>{run && <Link className="button button-primary" to={`/discover?${rerunParams.toString()}`}><Pencil size={14} /> Edit &amp; rerun</Link>}</header>
    {runError && <section className="card prospecting-inline-error" role="alert">{runError}<button className="button button-secondary" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Retry</button></section>}
    {run && <><section className="prospecting-metrics" aria-label="Run metrics"><article className="card"><span>Provider leads</span><strong>{run.total_leads_found.toLocaleString()}</strong></article><article className="card"><span>Connected leads</span><strong>{run.lead_count.toLocaleString()}</strong></article><article className="card"><span>New leads</span><strong>{run.new_lead_count.toLocaleString()}</strong></article><article className="card"><span>Duplicate leads</span><strong>{run.duplicate_lead_count.toLocaleString()}</strong></article></section>
      <section className="card prospecting-run-context"><div><small>Linked campaign</small><strong>{run.campaign?.name || 'No campaign linked'}</strong>{run.campaign && <span>{run.campaign.status}</span>}</div>{run.prospecting_request && <><div><small>Original objective</small><p>{run.prospecting_request.objective || '—'}</p></div><div><small>Target</small><p>{run.prospecting_request.target || '—'}</p></div><div><small>Qualification</small><p>{run.prospecting_request.qualification || '—'}</p></div></>}</section></>}
    <section className="card prospecting-directory"><div className="prospecting-filters"><label><Search size={14} /><input aria-label="Filter by location" placeholder="Location" value={location} onChange={(event) => setLocation(event.target.value)} /></label><label><Star size={14} /><input aria-label="Minimum score" type="number" min="0" step="0.1" placeholder="Minimum score" value={score} onChange={(event) => setScore(event.target.value)} /></label><select aria-label="Filter by category" value={category} onChange={(event) => updateParam('category', event.target.value)}><option value="">All categories</option>{data?.categories.map((item) => <option key={item}>{item}</option>)}</select></div>
      {loading ? <PageLoader label="Loading campaign leads…" /> : leadsError ? <div className="prospecting-state" role="alert"><SearchX size={23} /><h2>We couldn’t load these leads</h2><p>{leadsError}</p><button className="button button-primary" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Try again</button></div> : !data?.leads.length ? <div className="prospecting-state"><SearchX size={23} /><h2>No matching leads</h2><p>Adjust the filters or wait for this campaign to return results.</p></div> : <><div className="table-wrap"><table className="data-table prospecting-leads-table prospecting-rich-leads"><thead><tr><th>Lead</th><th>Why it fits</th><th>Signals</th><th>Fit score</th><th>Contact</th><th /></tr></thead><tbody>{data.leads.map((lead) => { const scoreValue = leadScore(lead); const summary = leadSummary(lead); const signals = leadSignals(lead); return <tr key={lead.id} tabIndex={0} onClick={() => openLead(lead.id)} onKeyDown={(event) => { if (event.key === 'Enter') openLead(lead.id) }}><td><div className="prospecting-lead-name"><span>{lead.name.slice(0, 2).toUpperCase()}</span><div><strong>{lead.name}</strong><small><MapPin size={11} />{lead.address || 'Location unavailable'} · {lead.category || 'Uncategorized'}</small>{lead.website && <a href={lead.website} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{lead.website.replace(/^https?:\/\/(?:www\.)?/, '').split('/')[0]} <ExternalLink size={10} /></a>}</div></div></td><td><p className={summary ? 'prospecting-fit-copy' : 'prospecting-fit-copy is-pending'}>{summary || 'Detailed research is not available yet. Open the profile to review and enrich this lead.'}</p></td><td>{signals.length ? <div className="prospecting-signal-list">{signals.slice(0, 3).map((signal) => <span key={signal}>{signal}</span>)}</div> : <span className="prospecting-research-state">Research pending</span>}</td><td>{scoreValue !== null ? <span className={`prospecting-fit-score ${scoreValue >= 70 ? 'is-high' : ''}`}><strong>{scoreValue}</strong><small>/100</small></span> : <span className="prospecting-unscored">Not scored</span>}</td><td>{lead.phone || lead.contacts.length ? <div className="prospecting-contact-ready"><Phone size={13} /><span><strong>{lead.phone || `${lead.contacts.length} contact${lead.contacts.length === 1 ? '' : 's'}`}</strong><small>Contact available</small></span></div> : <div className="prospecting-contact-ready is-empty"><Phone size={13} /><span><strong>Not found</strong><small>Needs enrichment</small></span></div>}</td><td><span className="prospecting-profile-action">View profile <ArrowRight size={13} /></span></td></tr> })}</tbody></table></div><div className="prospecting-pagination"><span>Page {data.page} of {Math.max(data.total_pages, 1)}</span><div><button className="button button-secondary" disabled={page <= 1} onClick={() => changePage(page - 1)}>Previous</button><button className="button button-secondary" disabled={page >= data.total_pages} onClick={() => changePage(page + 1)}>Next</button></div></div></>}
    </section>
  </div>
}
