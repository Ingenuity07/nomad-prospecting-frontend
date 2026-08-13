import { useState, useEffect, Fragment } from 'react'
import { Cpu, DollarSign, Clock, Hash, Search, Activity, ChevronRight, ChevronDown } from 'lucide-react'
import { API } from '../constants'

interface OverviewData {
  total_calls: number
  total_input_tokens: number
  total_output_tokens: number
  total_cost: number
  avg_latency_ms: number
}

interface ModelBreakdown {
  model_name: string
  calls: number
  input_tokens: number
  output_tokens: number
  cost: number
  latency: number
}

interface DailyTrend {
  date: string
  calls: number
  cost: number
  input_tokens: number
  output_tokens: number
}

interface RecentRun {
  id: string
  purpose: string
  prompt_preview: string
  response_preview: string
  model_name: string
  input_tokens: number
  output_tokens: number
  cost_usd: number
  latency_ms: number
  created_at: string
}

interface AnalyticsPayload {
  overview: OverviewData
  model_breakdown: ModelBreakdown[]
  daily_trends: DailyTrend[]
  recent_runs: RecentRun[]
}

export function LLMAnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null)

  useEffect(() => {
    const url = `${API.baseUrl.replace('/v3/prospecting', '')}/analytics/`
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch analytics data')
        return res.json()
      })
      .then((json: AnalyticsPayload) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="page page-enter">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="spinner" />
          <p style={{ marginLeft: 12 }}>Loading analytics insights...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="page page-enter">
        <div className="card" style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center', padding: 24 }}>
          <h2>Failed to load LLM router analytics</h2>
          <p style={{ color: 'var(--red)', marginTop: 8 }}>{error || 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  const { overview, model_breakdown, daily_trends, recent_runs } = data

  const filteredRuns = recent_runs.filter(
    (run) =>
      run.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.prompt_preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const maxCost = Math.max(...daily_trends.map((t) => t.cost), 0.01)
  const W = 600
  const H = 150

  return (
    <div className="page page-enter llm-analytics-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Router intelligence</span>
          <h1>LLM cost & token analyzer</h1>
          <p>
            Monitor real-time token counts, request latencies, and calculated API transaction costs
            across fallback providers in your workspace.
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="analytics-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <article className="card analytics-metric">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ display: 'inline-flex', padding: 6, borderRadius: 6, background: 'var(--green-light)', color: 'var(--green)' }}>
              <DollarSign size={16} />
            </span>
            <small style={{ color: 'var(--grey-text)', fontWeight: 500 }}>Total Cost (USD)</small>
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0' }}>${overview.total_cost.toFixed(4)}</strong>
          <p style={{ fontSize: 11, color: 'var(--grey-text)' }}>Calculated from direct provider token pricing</p>
        </article>

        <article className="card analytics-metric">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ display: 'inline-flex', padding: 6, borderRadius: 6, background: 'var(--blue-light)', color: 'var(--blue)' }}>
              <Hash size={16} />
            </span>
            <small style={{ color: 'var(--grey-text)', fontWeight: 500 }}>Total API Calls</small>
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0' }}>{overview.total_calls}</strong>
          <p style={{ fontSize: 11, color: 'var(--grey-text)' }}>Requests processed by intelligent router</p>
        </article>

        <article className="card analytics-metric">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ display: 'inline-flex', padding: 6, borderRadius: 6, background: 'var(--violet-light)', color: 'var(--violet)' }}>
              <Cpu size={16} />
            </span>
            <small style={{ color: 'var(--grey-text)', fontWeight: 500 }}>Tokens Transacted</small>
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0' }}>
            {((overview.total_input_tokens + overview.total_output_tokens) / 1000).toFixed(1)}k
          </strong>
          <p style={{ fontSize: 11, color: 'var(--grey-text)' }}>
            {overview.total_input_tokens.toLocaleString()} in / {overview.total_output_tokens.toLocaleString()} out
          </p>
        </article>

        <article className="card analytics-metric">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ display: 'inline-flex', padding: 6, borderRadius: 6, background: 'var(--amber-light)', color: 'var(--amber)' }}>
              <Clock size={16} />
            </span>
            <small style={{ color: 'var(--grey-text)', fontWeight: 500 }}>Avg Latency</small>
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0' }}>{(overview.avg_latency_ms / 1000).toFixed(2)}s</strong>
          <p style={{ fontSize: 11, color: 'var(--grey-text)' }}>Average network transaction & response time</p>
        </article>
      </section>

      {/* Main Grid: Breakdown & Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginTop: 24 }}>
        
        {/* Model Breakdown */}
        <section className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem' }}>
            <Activity size={18} style={{ color: 'var(--green)' }} />
            Provider Model Performance
          </h3>
          <div className="table-responsive">
            <table className="leads-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Model</th>
                  <th style={{ textAlign: 'center', paddingBottom: 8 }}>Calls</th>
                  <th style={{ textAlign: 'center', paddingBottom: 8 }}>Tokens</th>
                  <th style={{ textAlign: 'center', paddingBottom: 8 }}>Avg Latency</th>
                  <th style={{ textAlign: 'right', paddingBottom: 8 }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {model_breakdown.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--grey-text)' }}>
                      No active model logs recorded in database.
                    </td>
                  </tr>
                ) : (
                  model_breakdown.map((m) => (
                    <tr key={m.model_name}>
                      <td style={{ fontWeight: 600, padding: '10px 0' }}>{m.model_name}</td>
                      <td style={{ textAlign: 'center', padding: '10px 0' }}>{m.calls}</td>
                      <td style={{ textAlign: 'center', padding: '10px 0' }}>
                        {((m.input_tokens + m.output_tokens) / 1000).toFixed(1)}k
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 0' }}>{(m.latency / 1000).toFixed(2)}s</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--green)', padding: '10px 0' }}>
                        ${m.cost.toFixed(4)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cost Trend Chart */}
        <section className="card" style={{ padding: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Daily Cost & Volume Trends</h3>
          {daily_trends.length === 0 ? (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--grey-text)' }}>
              Awaiting daily cost history...
            </div>
          ) : (
            <div>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', width: '100%' }}>
                {daily_trends.map((t, idx) => {
                  const x = (idx / Math.max(1, daily_trends.length - 1)) * W
                  const y = H - (t.cost / maxCost) * (H - 20)
                  return (
                    <g key={t.date}>
                      {/* Bar indicator */}
                      <rect
                        x={x - 8}
                        y={y}
                        width={16}
                        height={H - y}
                        fill="rgba(120, 240, 160, 0.12)"
                        rx={3}
                      />
                      {/* Cost Dot */}
                      <circle cx={x} cy={y} r={4} fill="var(--green)" />
                      {/* Date label at bottom */}
                      {idx % 3 === 0 && (
                        <text
                          x={x}
                          y={H + 18}
                          textAnchor="middle"
                          fill="var(--grey-text)"
                          fontSize={10}
                        >
                          {t.date.split('-').slice(1).join('/')}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, fontSize: 11, color: 'var(--grey-text)' }}>
                <span>Bar: Daily Cost Share</span>
                <span>Max Cost: ${maxCost.toFixed(4)}</span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Recent Execution Logs */}
      <section className="card" style={{ marginTop: 24, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent LLM Transactions</h3>
          <div className="lead-search" style={{ margin: 0, width: 280 }}>
            <Search size={15} />
            <input
              type="text"
              placeholder="Filter by model or prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="leads-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }} />
                <th style={{ textAlign: 'left' }}>Date</th>
                <th style={{ textAlign: 'left' }}>Model</th>
                <th style={{ textAlign: 'left' }}>Purpose</th>
                <th style={{ textAlign: 'center' }}>Tokens (In/Out)</th>
                <th style={{ textAlign: 'center' }}>Latency</th>
                <th style={{ textAlign: 'right' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--grey-text)' }}>
                    No prompt executions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => {
                  const isExpanded = expandedRunId === run.id
                  return (
                    <Fragment key={run.id}>
                      <tr
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                      >
                        <td style={{ padding: '12px 8px' }}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </td>
                        <td style={{ padding: '12px 8px' }}>{new Date(run.created_at).toLocaleString()}</td>
                        <td style={{ fontWeight: 600, padding: '12px 8px' }}>{run.model_name}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className="badge badge-grey">{run.purpose}</span>
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          {run.input_tokens} / {run.output_tokens}
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>{(run.latency_ms / 1000).toFixed(2)}s</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--green)', padding: '12px 8px' }}>
                          ${run.cost_usd.toFixed(5)}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ padding: '16px 24px', background: 'var(--bg-inset)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                              <div>
                                <h5 style={{ marginBottom: 6, fontSize: 11, textTransform: 'uppercase', color: 'var(--grey-text)' }}>
                                  Prompt Payload
                                </h5>
                                <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 180, overflowY: 'auto', background: 'var(--bg)', padding: 12, borderRadius: 6, fontSize: 12 }}>
                                  {run.prompt_preview}
                                </pre>
                              </div>
                              <div>
                                <h5 style={{ marginBottom: 6, fontSize: 11, textTransform: 'uppercase', color: 'var(--grey-text)' }}>
                                  LLM Output Response
                                </h5>
                                <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 180, overflowY: 'auto', background: 'var(--bg)', padding: 12, borderRadius: 6, fontSize: 12 }}>
                                  {run.response_preview}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
