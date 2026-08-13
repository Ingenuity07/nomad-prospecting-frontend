import { useParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  Link2,
  Mail,
  MoreHorizontal,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAccountDetail, postLeadFeedback, postLeadCRMSync } from '../api/dashboard'
import { useAsyncData } from '../hooks/useAsyncData'
import type { EvidenceItem, AccountDetail } from '../types'

const evidenceToneIcon: Record<EvidenceItem['tone'], LucideIcon> = {
  lime: Users,
  blue: Zap,
  amber: Wrench,
}


export function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>()
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(false)
  const [feedbackSelected, setFeedbackSelected] = useState<string | null>(null)

  const { data: account, loading } = useAsyncData<AccountDetail | null>(
    () => getAccountDetail(leadId || ''),
    null
  )

  const handleSyncCRM = () => {
    if (!leadId) return
    setSyncing(true)
    postLeadCRMSync(leadId, { owner_email: "priya@nomad.ai" })
      .then(() => {
        setSynced(true)
        setSyncing(false)
      })
      .catch(() => {
        setSyncing(false)
      })
  }

  const handleFeedback = (feedbackType: string) => {
    if (!leadId) return
    setFeedbackSelected(feedbackType)
    postLeadFeedback(leadId, { feedback_type: feedbackType, notes: "Submitted via UI" })
  }

  if (loading) {
    return (
      <div className="page page-enter">
        <div className="card placeholder-empty" style={{ maxWidth: 520, margin: '60px auto' }}>
          <h2>Loading account...</h2>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="page page-enter">
        <div className="card placeholder-empty" style={{ maxWidth: 520, margin: '60px auto' }}>
          <h2>Account not found</h2>
          <p>We couldn’t find an account for “{leadId}”.</p>
          <Link to="/leads" className="button button-primary">
            Back to leads
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page page-enter account-page">
      <div className="breadcrumb">
        <Link to="/leads">
          <ArrowRight size={11} style={{ transform: 'rotate(180deg)' }} /> Qualified accounts
        </Link>
        <span>{account.name}</span>
      </div>

      <header className="account-header">
        <div className="account-identity">
          <span className={`company-mark mark-${account.markTone} mark-large`} aria-hidden="true">
            {account.initials}
          </span>
          <div>
            <span className="account-status">
              <i /> {account.status}
            </span>
            <h1>{account.name}</h1>
            <p>
              <a href={`https://${account.domain}`}>
                {account.domain} <ExternalLink size={10} />
              </a>
              <span>·</span>
              <span>{account.industry}</span>
              <span>·</span>
              <span>{account.location}</span>
            </p>
          </div>
        </div>
        <div className="page-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={handleSyncCRM}
            disabled={syncing || synced}
          >
            {syncing ? 'Syncing...' : synced ? 'Synced ✓' : 'Sync to CRM'}
          </button>
          <button className="button button-secondary" type="button">
            <Plus size={14} /> Add to list
          </button>
          <Link to="/campaigns" className="button button-primary">
            <Sparkles size={14} /> Build outreach
          </Link>
          <button className="icon-button" type="button" aria-label="More account actions">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      <section className="account-score-banner card">
        <div className="score-summary" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
          <span className="score-badge score-high score-large">{account.score}</span>
          <div style={{ flex: 1 }}>
            <span>Nomad opportunity score</span>
            <strong>{account.scoreLabel}</strong>
            <small>{account.scoreNote}</small>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', opacity: 0.6 }}>Audit Feedback:</span>
            {['GOOD_SIGNAL', 'WRONG_MATCH', 'BAD_SIGNAL'].map((type) => (
              <button
                key={type}
                type="button"
                className={`button button-secondary small-button ${feedbackSelected === type ? 'button-primary' : ''}`}
                style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', textTransform: 'capitalize' }}
                onClick={() => handleFeedback(type)}
              >
                {type.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="score-factors">
          {account.factors.map((factor) => (
            <div key={factor.id}>
              <span>{factor.label}</span>
              <strong>{factor.value}</strong>
              <i>
                <b style={{ width: `${factor.value}%` }} />
              </i>
            </div>
          ))}
        </div>
        <div className="next-best-action">
          <span>
            <TrendingUp size={14} />
          </span>
          <p>
            <small>Recommended next step</small>
            <strong>{account.nextStep}</strong>
          </p>
          <ChevronDown size={15} style={{ transform: 'rotate(-90deg)' }} />
        </div>
      </section>

      <div className="account-layout">
        <div className="account-main-column">
          <section className="card evidence-card">
            <div className="card-heading-row">
              <div>
                <span className="eyebrow-label">Problem evidence</span>
                <h2>Why Nomad thinks they need you</h2>
              </div>
              <span className="confidence-chip">
                <Check size={11} /> {account.confidence}
              </span>
            </div>
            <div className="problem-thesis">
              <span>
                <Target size={18} />
              </span>
              <div>
                <small>Detected operational problem</small>
                <h3>{account.problem}</h3>
                <p>{account.thesis}</p>
              </div>
            </div>
            <div className="evidence-timeline">
              {account.evidence.map((item) => {
                const Icon = evidenceToneIcon[item.tone]
                return (
                  <article key={item.id}>
                    <span className={`timeline-icon ${item.tone}`}>
                      <Icon size={14} />
                    </span>
                    <div className="timeline-content">
                      <div>
                        <strong>{item.title}</strong>
                        <time>{item.time}</time>
                      </div>
                      <p>{item.detail}</p>
                      <div className="source-line">
                        <span>{item.source}</span>
                        <span className={`evidence-strength ${item.strength === 'medium' ? 'medium' : ''}`}>
                          {item.strength === 'strong' ? 'Strong evidence' : 'Supporting evidence'}
                        </span>
                        <button type="button">
                          View source <ArrowUpRight size={10} />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <button className="show-evidence" type="button">
              Show all {account.evidenceTotal} evidence signals <ChevronDown size={13} />
            </button>
          </section>

          <section className="card contacts-card">
            <div className="card-heading-row">
              <div>
                <span className="eyebrow-label">People map</span>
                <h2>Likely buying group</h2>
              </div>
              <button className="button button-secondary small-button" type="button">
                <Plus size={12} /> Find more people
              </button>
            </div>
            <div className="contact-table">
              {account.contacts.map((contact) => (
                <div className="contact-row" key={contact.id}>
                  <span className={`contact-avatar ${contact.avatarClass}`}>{contact.initials}</span>
                  <p>
                    <strong>{contact.name}</strong>
                    <small>{contact.role}</small>
                  </p>
                  <span className={`relevance-pill ${contact.relevanceClass}`}>{contact.relevance}</span>
                  <span className="contact-confidence">
                    <i style={{ width: `${contact.relevancePct}%` }} />
                    <small>{contact.relevancePct}% relevance</small>
                  </span>
                  <div>
                    <button type="button" aria-label={`Email ${contact.name}`}>
                      <Mail size={13} />
                    </button>
                    <button type="button" aria-label={`${contact.name} on LinkedIn`}>
                      <Link2 size={13} />
                    </button>
                    <button type="button" aria-label={`More for ${contact.name}`}>
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="account-aside">
          <section className="card buying-window-card">
            <div className="window-title">
              <span className="hot-pulse">
                <i />
              </span>
              <div>
                <small>Buying window</small>
                <strong>{account.window}</strong>
              </div>
              <span>{account.windowScore} / 100</span>
            </div>
            <p>{account.windowNote}</p>
            <ul>
              {account.windowReasons.map((reason) => (
                <li key={reason}>
                  <Target size={11} /> {reason}
                </li>
              ))}
            </ul>
            <div className="window-footer">{account.windowUpdated}</div>
          </section>

          <section className="card company-snapshot">
            <div className="card-heading-row compact">
              <h2>Company snapshot</h2>
              <button type="button" aria-label="Snapshot options">
                <MoreHorizontal size={15} />
              </button>
            </div>
            <dl>
              {account.snapshot.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="card talking-points-card">
            <span className="model-badge">
              <Sparkles size={11} /> AI talking points
            </span>
            <h2>Make the first message relevant</h2>
            <ol>
              {account.talkingPoints.map((point, index) => (
                <li key={point}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{point}</p>
                </li>
              ))}
            </ol>
            <Link to="/campaigns">
              Draft problem-led message <ArrowRight size={12} />
            </Link>
          </section>

          <section className="card owner-card">
            <span className="profile-avatar">PS</span>
            <p>
              <small>Account owner</small>
              <strong>Priya Shah</strong>
            </p>
            <button type="button">Change</button>
          </section>
        </aside>
      </div>
    </div>
  )
}
