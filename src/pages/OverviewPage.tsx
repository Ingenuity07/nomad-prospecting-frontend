import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/dashboard'
import { MetricGrid } from '../components/dashboard/MetricGrid'
import { PageHeader } from '../components/dashboard/PageHeader'
import { SignalPulse } from '../components/dashboard/SignalPulse'
import { PageLoader } from '../components/ui/PageLoader'
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
  const { data, loading } = useAsyncData(getDashboard, emptyDashboard)

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

      {loading ? <PageLoader label="Loading your workspace overview…" /> : <>
        <MetricGrid metrics={data.metrics} />
        <SignalPulse data={data.pulse} />
      </>}
    </div>
  )
}
