import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import { MetricGrid } from '../components/dashboard/MetricGrid'
import { OpportunityMap } from '../components/dashboard/OpportunityMap'
import { PageHeader } from '../components/dashboard/PageHeader'
import { PriorityAccounts } from '../components/dashboard/PriorityAccounts'
import { SignalPulse } from '../components/dashboard/SignalPulse'
import { OVERVIEW } from '../constants'
import { useAsyncData } from '../hooks/useAsyncData'
import type { DashboardData } from '../types'

const emptyDashboard: DashboardData = {
  metrics: [],
  problems: [],
  pulse: { weeks: [], values: [], changePct: 0, total: 0, note: '' },
  priorityAccounts: [],
  activity: [],
}

export function OverviewPage() {
  const { data } = useAsyncData(getDashboard, emptyDashboard)

  return (
    <div className="page page-enter">
      <PageHeader
        eyebrow={OVERVIEW.eyebrow}
        title={OVERVIEW.title}
        description={OVERVIEW.description}
        actions={
          <Link to="/discover" className="button button-primary">
            <Sparkles size={16} /> {OVERVIEW.ctaLabel} <ArrowRight size={16} />
          </Link>
        }
      />

      <MetricGrid metrics={data.metrics} />

      <section className="dashboard-grid dashboard-grid-hero">
        <OpportunityMap problems={data.problems} />
        <SignalPulse data={data.pulse} />
      </section>

      <section className="dashboard-grid dashboard-grid-bottom" style={{ gridTemplateColumns: '1fr' }}>
        <PriorityAccounts accounts={data.priorityAccounts} />
      </section>
    </div>
  )
}
