import { useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Columns3,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Target,
  Users,
  UsersRound,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { leadKpis, leads } from '../api/mockData'
import type { BuyingWindow, LeadKpi } from '../types'

const kpiIcon: Record<LeadKpi['id'], LucideIcon> = {
  total: UsersRound,
  'high-fit': Target,
  'act-now': Zap,
  unassigned: Users,
}

const windowClass: Record<BuyingWindow, string> = {
  'Act now': 'window-hot',
  'This quarter': 'window-warm',
  'This month': 'window-hot',
  Researching: 'window-cool',
  Monitoring: 'window-neutral',
  'Next quarter': 'window-neutral',
}

const problemOptions = [
  'Manual route planning',
  'Scheduling bottlenecks',
  'Poor delivery visibility',
  'Last-mile margin pressure',
  'Unplanned fleet downtime',
]

export function LeadsPage() {
  const [query, setQuery] = useState('')
  const [problem, setProblem] = useState('All problems')
  const [minScore, setMinScore] = useState('All scores')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesQuery =
        !q || `${lead.name} ${lead.industry} ${lead.location}`.toLowerCase().includes(q)
      const matchesProblem = problem === 'All problems' || lead.problem === problem
      const matchesScore = minScore === 'All scores' || lead.fitScore >= Number(minScore)
      return matchesQuery && matchesProblem && matchesScore
    })
  }, [query, problem, minScore])

  const allChecked = filtered.length > 0 && filtered.every((lead) => selected.has(lead.id))

  const toggleRow = (id: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((current) => {
      const next = new Set(current)
      if (allChecked) filtered.forEach((lead) => next.delete(lead.id))
      else filtered.forEach((lead) => next.add(lead.id))
      return next
    })
  }

  return (
    <div className="page page-enter leads-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Qualified accounts</span>
          <h1>Leads with a reason to buy.</h1>
          <p>
            Every account is ranked by problem fit, observable evidence, and buying-window
            timing — so your team knows who to contact and why.
          </p>
        </div>
        <div className="page-actions">
          <button className="button button-secondary" type="button">
            <Download size={14} /> Export
          </button>
          <button className="button button-primary" type="button">
            <Plus size={15} /> Add account
          </button>
        </div>
      </header>

      <section className="lead-kpi-strip card">
        {leadKpis.map((kpi, index) => {
          const Icon = kpiIcon[kpi.id]
          return (
            <ReactFragment key={kpi.id} index={index}>
              <div>
                {index === 0 && (
                  <span className="kpi-symbol">
                    <Icon size={16} />
                  </span>
                )}
                <p>
                  <small>{kpi.label}</small>
                  <strong>{kpi.value}</strong>
                  {kpi.note && (
                    <span className={kpi.tone === 'hot' ? 'hot-text' : kpi.tone === 'up' ? 'tiny-trend' : ''}>
                      {kpi.note}
                    </span>
                  )}
                </p>
              </div>
            </ReactFragment>
          )
        })}
      </section>

      <section className="lead-directory card">
        <div className="lead-toolbar">
          <label className="lead-search">
            <Search size={14} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search account, industry, or location…"
              aria-label="Search accounts"
            />
          </label>
          <label className="toolbar-select">
            <select value={problem} onChange={(event) => setProblem(event.target.value)} aria-label="Filter by problem">
              {['All problems', ...problemOptions].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown size={12} />
          </label>
          <label className="toolbar-select">
            <select value={minScore} onChange={(event) => setMinScore(event.target.value)} aria-label="Filter by score">
              <option>All scores</option>
              <option value="85">85+ fit</option>
              <option value="80">80+ fit</option>
              <option value="75">75+ fit</option>
            </select>
            <ChevronDown size={12} />
          </label>
          <button className="filter-button" type="button">
            <SlidersHorizontal size={13} /> More filters <span>3</span>
          </button>
          <button className="columns-button" type="button" aria-label="Choose columns">
            <Columns3 size={15} />
          </button>
        </div>

        <div className="active-filters">
          <span>Active filters</span>
          <button type="button">
            UK <X size={10} />
          </button>
          <button type="button">
            51–1,000 employees <X size={10} />
          </button>
          <button type="button">
            Evidence in last 90 days <X size={10} />
          </button>
          <button type="button" className="clear-filters">
            Clear all
          </button>
          <small>
            {filtered.length} of {leads.length} accounts
          </small>
        </div>

        <div className="table-wrap lead-table-wrap">
          <table className="data-table lead-table">
            <thead>
              <tr>
                <th className="check-cell">
                  <button className={`table-check ${allChecked ? 'checked' : ''}`} onClick={toggleAll} aria-label="Select all">
                    {allChecked && <Check size={11} strokeWidth={3} />}
                  </button>
                </th>
                <th>Account</th>
                <th>Operational problem</th>
                <th>Evidence</th>
                <th>Buying window</th>
                <th>Fit score</th>
                <th>Owner</th>
                <th>Last signal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const checked = selected.has(lead.id)
                return (
                  <tr key={lead.id}>
                    <td className="check-cell">
                      <button
                        className={`table-check ${checked ? 'checked' : ''}`}
                        onClick={() => toggleRow(lead.id)}
                        aria-label={`Select ${lead.name}`}
                      >
                        {checked && <Check size={11} strokeWidth={3} />}
                      </button>
                    </td>
                    <td>
                      <Link to={`/leads/${lead.id}`} className="company-cell lead-company">
                        <span className={`company-mark mark-${lead.markTone} mark-normal`} aria-hidden="true">
                          {lead.initials}
                        </span>
                        <span>
                          <strong>{lead.name}</strong>
                          <small>
                            {lead.industry} · {lead.location}
                          </small>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <span className="problem-tag">{lead.problem}</span>
                    </td>
                    <td>
                      <span className="signal-count">
                        <i>{lead.signals}</i>
                        <span>
                          <strong>{lead.signals} signals</strong>
                          <small>{lead.sources} sources</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className={`window-badge ${windowClass[lead.window]}`}>{lead.window}</span>
                    </td>
                    <td>
                      <span className={`score-badge ${lead.fitScore >= 85 ? 'score-high' : 'score-good'}`}>
                        {lead.fitScore}
                      </span>
                    </td>
                    <td>
                      <span className={`owner-pill ${lead.unassigned ? 'unassigned' : ''}`}>
                        <i>{lead.ownerInitials}</i>
                        {lead.owner}
                      </span>
                    </td>
                    <td>
                      <span className="last-seen">{lead.lastSeen}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/leads/${lead.id}`} className="icon-button mini" aria-label={`Open ${lead.name}`}>
                          <ArrowRight size={14} />
                        </Link>
                        <button type="button" aria-label="More actions">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="table-empty">
              <p>No accounts match your filters.</p>
            </div>
          )}
        </div>

        <div className="table-footer">
          <span>
            Showing 1–{filtered.length} of {leads.length}
          </span>
          <div>
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </button>
            {[1, 2, 3].map((number) => (
              <button
                key={number}
                type="button"
                className={page === number ? 'current' : ''}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
            <span>…</span>
            <button type="button" onClick={() => setPage(84)}>
              84
            </button>
            <button type="button" onClick={() => setPage((p) => Math.min(84, p + 1))}>
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ReactFragment({ index, children }: { index: number; children: ReactNode }) {
  return (
    <>
      {index > 0 && <i />}
      {children}
    </>
  )
}
