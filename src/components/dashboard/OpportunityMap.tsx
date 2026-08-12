import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OVERVIEW } from '../../constants'
import type { ProblemCluster } from '../../types'

const momentumClass: Record<ProblemCluster['momentum'], string> = {
  Rising: 'moment-rising',
  High: 'moment-high',
  New: 'moment-new',
  Stable: 'moment-stable',
}

interface OpportunityMapProps {
  problems: ProblemCluster[]
}

export function OpportunityMap({ problems }: OpportunityMapProps) {
  return (
    <article className="card opportunity-card">
      <div className="card-heading-row">
        <div>
          <span className="eyebrow-label">{OVERVIEW.opportunityEyebrow}</span>
          <h2>{OVERVIEW.opportunityTitle}</h2>
        </div>
        <Link to="/signals" className="text-link">
          {OVERVIEW.viewAllSignals} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="problem-list">
        {problems.map((problem) => {
          const Icon = problem.icon
          return (
            <Link key={problem.id} to="/signals" className="problem-row">
              <span className={`problem-icon problem-icon-${problem.iconTone}`}>
                <Icon size={18} />
              </span>
              <span className="problem-main">
                <strong>{problem.title}</strong>
                <small>
                  {problem.category} · {problem.liveSignals} live signals
                </small>
              </span>
              <span className="problem-count">
                <strong>{problem.accounts}</strong>
                <small>accounts</small>
              </span>
              <span className={`moment-pill ${momentumClass[problem.momentum]}`}>{problem.momentum}</span>
              <ArrowRight size={16} className="row-arrow" />
            </Link>
          )
        })}
      </div>
    </article>
  )
}
