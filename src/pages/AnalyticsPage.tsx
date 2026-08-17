import { useId, useState, type ReactNode } from 'react'
import { Download, Lightbulb, MailCheck, Radar, Target, TrendingUp, type LucideIcon } from 'lucide-react'
import {
  funnelInsight,
  pipeline,
} from '../api/mockData'
import { getAnalyticsMetrics, getFunnelStages, getProblemPerformance, getSourceRanking } from '../api/dashboard'
import { useAsyncData } from '../hooks/useAsyncData'
import { PageLoader } from '../components/ui/PageLoader'
import { areaPath, smoothPath, toChartPoints } from '../utils/chart'
import type { AnalyticsMetric, ProblemPerformance } from '../types'

const metricIcon: Record<AnalyticsMetric['id'], LucideIcon> = {
  pipeline: TrendingUp,
  signals: Radar,
  qualified: Target,
  replies: MailCheck,
}

const performanceTone: Record<ProblemPerformance['tone'], string> = {
  lime: 'lime',
  blue: 'blue',
  violet: 'violet',
  amber: 'amber',
}

const W = 500
const H = 210
const PAD = 12

const RANGES = ['Last 30 days', 'Last 60 days', 'Last 90 days']

function downloadReport(rows: ProblemPerformance[]) {
  const header = ['Problem', 'Accounts', 'Qualified', 'Positive replies', 'Meetings', 'Pipeline']
  const body = rows.map((row) => [
    row.problem,
    row.accounts,
    row.qualified,
    row.positiveReply,
    row.meetings,
    row.pipeline,
  ])
  const csv = [header, ...body]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'nomad-pipeline-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function AnalyticsPage() {
  const gradientId = useId()
  const [range, setRange] = useState(0)

  const { data: analyticsMetricsList, loading: metricsLoading } = useAsyncData(getAnalyticsMetrics, [])
  const { data: funnelStagesList, loading: funnelLoading } = useAsyncData(getFunnelStages, [])
  const { data: problemPerformanceList, loading: performanceLoading } = useAsyncData(getProblemPerformance, [])
  const { data: sourceRankingList, loading: rankingLoading } = useAsyncData(getSourceRanking, [])

  const allValues = [...pipeline.actual, ...pipeline.previous]
  const actual = toChartPoints(pipeline.actual, W, H, PAD, Math.min(...allValues), Math.max(...allValues))
  const previous = toChartPoints(pipeline.previous, W, H, PAD, Math.min(...allValues), Math.max(...allValues))
  const actualLine = smoothPath(actual)
  const previousLine = smoothPath(previous)

  return (
    <div className="page page-enter analytics-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Performance intelligence</span>
          <h1>See which problems create pipeline.</h1>
          <p>
            Measure the full path from operational signal to qualified conversation — then
            double down on the wedges that resonate.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => downloadReport(problemPerformanceList)}
            disabled={problemPerformanceList.length === 0}
          >
            <Download size={14} /> Export
          </button>
          <button className="button button-secondary" type="button" onClick={() => setRange((r) => (r + 1) % RANGES.length)}>
            <span aria-hidden="true">📅</span> {RANGES[range]}
          </button>
        </div>
      </header>

      {(metricsLoading || funnelLoading || performanceLoading || rankingLoading) ? <PageLoader label="Loading performance analytics…" /> : <>

      <section className="analytics-metrics">
        {analyticsMetricsList.map((metric) => {
          const Icon = metricIcon[metric.id]
          return (
            <article className={`card analytics-metric ${metric.featured ? 'featured' : ''}`} key={metric.id}>
              <div>
                <span>
                  <Icon size={16} />
                </span>
                <small>{metric.label}</small>
              </div>
              <strong>{metric.value}</strong>
              <p>
                {metric.change && <b>{metric.change}</b>} {metric.note}
              </p>
              {metric.spark && (
                <div className="metric-spark" aria-hidden="true">
                  {metric.spark.map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </section>

      <section className="analytics-primary-grid">
        <article className="card pipeline-chart-card">
          <div className="card-heading-row">
            <div>
              <span className="eyebrow-label">Pipeline created</span>
              <h2>Problem-led opportunity trend</h2>
            </div>
            <div className="chart-legend">
              <span>
                <i className="actual" /> This period
              </span>
              <span>
                <i className="previous" /> Previous
              </span>
            </div>
          </div>
          <div className="big-chart" role="img" aria-label={pipeline.aria}>
            <div className="y-labels">
              {pipeline.yLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="big-chart-canvas">
              <div className="big-grid">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b9f34a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#b9f34a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath(actualLine, actual, H)} fill={`url(#${gradientId})`} />
                <path
                  d={actualLine}
                  fill="none"
                  stroke="#87b323"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={previousLine}
                  fill="none"
                  stroke="#b8c0bb"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="chart-tooltip">
                <small>{pipeline.tooltip.week}</small>
                <strong>{pipeline.tooltip.value}</strong>
                <span>{pipeline.tooltip.change}</span>
              </div>
              <div className="x-labels">
                {pipeline.weeks.map((week) => (
                  <span key={week}>{week}</span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <aside className="card funnel-card">
          <div className="card-heading-row">
            <div>
              <span className="eyebrow-label">Conversion</span>
              <h2>Signal to meeting</h2>
            </div>
            <span className="trend-chip">
              <TrendingUp size={12} /> 9.4%
            </span>
          </div>
          <div className="funnel-stages">
            {funnelStagesList.map((stage, index) => (
              <FunnelItem key={stage.id} index={index} width={stage.width}>
                <span>{stage.label}</span>
                <strong>{stage.count.toLocaleString()}</strong>
                <small>{stage.pct}</small>
              </FunnelItem>
            ))}
          </div>
          <div className="funnel-insight">
            <Lightbulb size={14} />
            <p>
              <strong>{funnelInsight.title}</strong>
              <small>{funnelInsight.body}</small>
            </p>
          </div>
        </aside>
      </section>

      <section className="analytics-bottom-grid">
        <article className="card problem-performance-card">
          <div className="card-heading-row">
            <div>
              <span className="eyebrow-label">Wedge performance</span>
              <h2>Pipeline by operational problem</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table performance-table">
              <thead>
                <tr>
                  <th>Problem signal</th>
                  <th>Accounts</th>
                  <th>Qualified</th>
                  <th>Positive reply</th>
                  <th>Meetings</th>
                  <th>Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {problemPerformanceList.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={`performance-problem ${performanceTone[row.tone]}`}>
                        {row.problem}
                      </span>
                    </td>
                    <td>{row.accounts}</td>
                    <td>{row.qualified}</td>
                    <td>
                      <span className="reply-rate">
                        <i>
                          <b style={{ width: `${row.positiveReply * 4}%` }} />
                        </i>
                        {row.positiveReply}%
                      </span>
                    </td>
                    <td>{row.meetings}</td>
                    <td>
                      <strong>{row.pipeline}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="card source-quality-card">
          <div className="card-heading-row">
            <div>
              <span className="eyebrow-label">Evidence quality</span>
              <h2>Best converting sources</h2>
            </div>
          </div>
          <div className="source-ranking">
            {sourceRankingList.map((source, index) => (
              <div key={source.id}>
                <span>{index + 1}</span>
                <p>
                  <strong>{source.name}</strong>
                  <i>
                    <b style={{ width: `${source.bar}%` }} />
                  </i>
                </p>
                <small>{source.rate}</small>
              </div>
            ))}
          </div>
          <p className="source-note">Reply rate when the source appears in the opening message.</p>
        </aside>
      </section>
      </>}
    </div>
  )
}

function FunnelItem({
  index,
  width,
  children,
}: {
  index: number
  width: number
  children: ReactNode
}) {
  return (
    <>
      {index > 0 && <i />}
      <div style={{ width: `${width}%` }}>{children}</div>
    </>
  )
}
