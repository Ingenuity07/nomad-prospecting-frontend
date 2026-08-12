import type { WorkspaceMetric } from '../../types'

export function MetricCard({ metric }: { metric: WorkspaceMetric }) {
  const Icon = metric.icon
  return (
    <article className="metric-card card">
      <div className="metric-top">
        <span className="metric-icon">
          <Icon size={19} />
        </span>
        <span className={`metric-change metric-${metric.direction}`}>↗ {metric.change}</span>
      </div>
      <span className="metric-label">{metric.label}</span>
      <strong className="metric-value">{metric.value}</strong>
      <small>{metric.note}</small>
    </article>
  )
}
