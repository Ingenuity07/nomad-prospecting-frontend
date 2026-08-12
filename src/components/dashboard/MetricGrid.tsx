import type { WorkspaceMetric } from '../../types'
import { MetricCard } from './MetricCard'

export function MetricGrid({ metrics }: { metrics: WorkspaceMetric[] }) {
  return (
    <section className="metric-grid" aria-label="Workspace metrics">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </section>
  )
}
