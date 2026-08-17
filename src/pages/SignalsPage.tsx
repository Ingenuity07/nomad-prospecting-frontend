import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Eye, EyeOff, Gauge, Radar, Route, Search, Target, TimerReset, TrendingUp, UsersRound, Wrench, type LucideIcon } from 'lucide-react'
import { getSignalStats, getSignalCategories, getSignals } from '../api/dashboard'
import { useAsyncData } from '../hooks/useAsyncData'
import { PageLoader } from '../components/ui/PageLoader'
import type { Momentum, SignalStat } from '../types'

const statIcon: Record<SignalStat['tone'], typeof Radar> = {
  lime: Radar,
  blue: UsersRound,
  amber: TrendingUp,
  violet: Target,
}

const momentumClass: Record<Momentum, string> = {
  Rising: 'moment-rising',
  High: 'moment-high',
  New: 'moment-new',
  Stable: 'moment-stable',
}

export function SignalsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const { data: statsList, loading: statsLoading } = useAsyncData(getSignalStats, [])
  const { data: categoriesList, loading: categoriesLoading } = useAsyncData(getSignalCategories, [])
  const { data: signalsList, loading: signalsLoading } = useAsyncData(getSignals, [])

  const tabs = useMemo(() => {
    return [{ id: 'all', label: 'All signals' }, ...categoriesList]
  }, [categoriesList])

  const [watched, setWatched] = useState<Set<string>>(() => new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return signalsList.filter((signal) => {
      const categoryForSignal =
        categoriesList.find((cat) => cat.label === signal.category)?.id ?? 'all'
      const matchesQuery =
        !q || `${signal.title} ${signal.description} ${signal.category}`.toLowerCase().includes(q)
      const matchesCategory = category === 'all' || categoryForSignal === category
      return matchesQuery && matchesCategory
    })
  }, [query, category, signalsList, categoriesList])

  const toggleWatch = (id: string) => {
    setWatched((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="page page-enter signals-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Signal library</span>
          <h1>Operational problems worth prospecting.</h1>
          <p>
            Build a repeatable point of view around the pains you solve. Each signal combines
            observable evidence, market reach, and buying-window momentum.
          </p>
        </div>
      </header>

      {(statsLoading || categoriesLoading || signalsLoading) ? <PageLoader label="Loading signal intelligence…" /> : <>

      <section className="signal-summary-grid">
        {statsList.map((stat) => {
          const Icon = statIcon[stat.tone]
          return (
            <article className="card signal-stat" key={stat.id}>
              <span className={`stat-icon ${stat.tone}`}>
                <Icon size={17} />
              </span>
              <div>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
                <p>
                  {stat.highlight && <b>{stat.highlight}</b>} {stat.note}
                </p>
              </div>
            </article>
          )
        })}
      </section>

      <div className="library-toolbar">
        <label className="library-search">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search operational problems…"
            aria-label="Search operational problems"
          />
        </label>
        <div className="category-tabs" role="tablist" aria-label="Signal categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={category === tab.id}
              className={category === tab.id ? 'active' : ''}
              onClick={() => setCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className="signal-card-grid">
        {filtered.map((signal) => {
          const Icon = signalIcon(signal.title)
          const watching = watched.has(signal.id)
          return (
            <article className="card signal-library-card" key={signal.id}>
              <div className="signal-card-top">
                <span className={`signal-card-icon problem-icon-${signal.iconTone}`}>
                  <Icon size={17} />
                </span>
                <span className={`moment-pill ${momentumClass[signal.momentum]}`}>{signal.momentum}</span>
                <button
                  className={`watch-button ${watching ? 'watching' : ''}`}
                  onClick={() => toggleWatch(signal.id)}
                  aria-label={`${watching ? 'Stop watching' : 'Watch'} ${signal.title}`}
                >
                  {watching ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>
              <span className="signal-category">{signal.category}</span>
              <h2>{signal.title}</h2>
              <p>{signal.description}</p>
              <div className="evidence-preview">
                <span>{signal.evidenceTypes} evidence types</span>
                <span>Updated {signal.updatedAgo}</span>
              </div>
              <div className="signal-reach-row">
                <div>
                  <small>Market reach</small>
                  <strong>
                    {signal.accounts} <span>accounts</span>
                  </strong>
                </div>
                <div className="mini-bars" aria-hidden="true">
                  {signal.trend.map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="signal-card-footer">
                <span>
                  <i className={`health-dot ${signal.health === 'High precision' ? 'green' : 'amber'}`} />{' '}
                  {signal.health}
                </span>
                <Link to="/discover">
                  Use in discovery <ArrowRight size={11} />
                </Link>
              </div>
            </article>
          )
        })}
      </section>
      </>}

      {filtered.length === 0 && (
        <div className="card placeholder-empty">
          <h2>No signals match “{query}”</h2>
          <p>Try a different search or category.</p>
        </div>
      )}
    </div>
  )
}

const signalIconByTitle: Record<string, LucideIcon> = {
  'Manual route planning': Route,
  'Scheduling bottlenecks': TimerReset,
  'Unplanned fleet downtime': Wrench,
  'Poor delivery visibility': Radar,
  'Last-mile margin pressure': Gauge,
  'Manual proof-of-delivery': ClipboardCheck,
}

function signalIcon(title: string): LucideIcon {
  return signalIconByTitle[title] ?? Radar
}
