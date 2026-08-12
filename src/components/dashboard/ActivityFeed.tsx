import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OVERVIEW } from '../../constants'
import type { ActivityEvent } from '../../types'

interface ActivityFeedProps {
  activity: ActivityEvent[]
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  const [read, setRead] = useState(false)

  return (
    <article className={`card activity-card${read ? ' activity-read' : ''}`}>
      <div className="card-heading-row compact">
        <div>
          <span className="eyebrow-label">{OVERVIEW.activityEyebrow}</span>
          <h2>{OVERVIEW.activityTitle}</h2>
        </div>
        <button className="quiet-button" type="button" onClick={() => setRead(true)}>
          {OVERVIEW.markRead}
        </button>
      </div>
      <div className="activity-list">
        {activity.map((item) => {
          const Icon = item.icon
          return (
            <div className="activity-item" key={item.id}>
              <span className={`activity-icon activity-${item.tone}`}>
                <Icon size={16} />
              </span>
          <span className={read ? 'activity-muted' : undefined}>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </span>
          <time>{item.time}</time>
            </div>
          )
        })}
      </div>
      <Link to="/analytics" className="activity-link">
        {OVERVIEW.viewActivity} <ArrowRight size={14} />
      </Link>
    </article>
  )
}
