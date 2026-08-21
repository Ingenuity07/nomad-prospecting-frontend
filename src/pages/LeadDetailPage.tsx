import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, ExternalLink, Link2, Mail, Sparkles, Target,
  TrendingUp, Users, Wrench, Zap, type LucideIcon,
} from 'lucide-react'
import { getAccountDetail, postLeadCRMSync, postLeadFeedback } from '../api/dashboard'
import { useAsyncData } from '../hooks/useAsyncData'
import type { AccountDetail, EvidenceItem } from '../types'

const evidenceToneIcon: Record<EvidenceItem['tone'], LucideIcon> = { lime: Users, blue: Zap, amber: Wrench }
const feedbackOptions = [
  { value: 'GOOD_SIGNAL', label: 'Useful lead' },
  { value: 'WRONG_MATCH', label: 'Wrong match' },
  { value: 'BAD_SIGNAL', label: 'Bad evidence' },
]

function sourceName(url: string) {
  if (!url) return 'Source unavailable'
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

export function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>()
  const [searchParams] = useSearchParams()
  const backTo = searchParams.get('from') || '/prospecting/campaigns'
  const [syncing, setSyncing] = useState(false)
  const [synced, setSynced] = useState(false)
  const [feedbackSelected, setFeedbackSelected] = useState<string | null>(null)
  const fetchAccountDetail = useCallback(() => getAccountDetail(leadId || ''), [leadId])
  const { data: account, loading } = useAsyncData<AccountDetail | null>(fetchAccountDetail, null)

  const handleSyncCRM = () => {
    if (!leadId) return
    setSyncing(true)
    postLeadCRMSync(leadId, {})
      .then(() => setSynced(true))
      .finally(() => setSyncing(false))
  }

  const handleFeedback = (feedbackType: string) => {
    if (!leadId) return
    setFeedbackSelected(feedbackType)
    postLeadFeedback(leadId, { feedback_type: feedbackType, notes: 'Submitted via UI' })
  }

  if (loading) return <div className="page page-enter"><div className="card placeholder-empty lead-detail-state"><h2>Loading account…</h2></div></div>

  if (!account) {
    return <div className="page page-enter"><div className="card placeholder-empty lead-detail-state">
      <h2>Account unavailable</h2>
      <p>We couldn’t load this lead from the backend. Try again or return to the campaign.</p>
      <Link to={backTo} className="button button-primary">Back to campaign</Link>
    </div></div>
  }

  return <div className="page page-enter account-page simple-lead-page">
    <div className="breadcrumb"><Link to={backTo}><ArrowLeft size={12} /> Campaign leads</Link><span>{account.name}</span></div>

    <header className="account-header">
      <div className="account-identity">
        <span className={`company-mark mark-${account.markTone} mark-large`} aria-hidden="true">{account.initials}</span>
        <div>
          <span className="account-status"><i /> {account.status}</span>
          <h1>{account.name}</h1>
          <p>
            {account.domain && <a href={`https://${account.domain}`} target="_blank" rel="noreferrer">{account.domain} <ExternalLink size={10} /></a>}
            {account.industry !== 'Not available' && <span>{account.industry}</span>}
            {account.location !== 'Not available' && <span>{account.location}</span>}
          </p>
        </div>
      </div>
      <div className="page-actions">
        <button className="button button-secondary" type="button" onClick={handleSyncCRM} disabled={syncing || synced}>{syncing ? 'Syncing…' : synced ? 'Synced ✓' : 'Sync to CRM'}</button>
        <Link to="/campaigns" className="button button-primary"><Sparkles size={14} /> Build outreach</Link>
      </div>
    </header>

    <section className="card lead-overview" aria-labelledby="lead-overview-title">
      <div className="lead-score-primary">
        <span className={`score-badge score-large ${account.score !== null && account.score >= 70 ? 'score-high' : ''}`}>{account.score ?? '—'}</span>
        <div><small>Opportunity score</small><strong>{account.scoreLabel}</strong><p>{account.scoreNote}</p></div>
      </div>
      <div className="lead-hypothesis">
        <span className="eyebrow-label">Why this account may fit</span>
        <h2 id="lead-overview-title">{account.problem}</h2>
        <p>{account.thesis}</p>
      </div>
      <div className="lead-next-step">
        <span><TrendingUp size={16} /></span>
        <div><small>Best next step</small><strong>{account.nextStep}</strong></div>
      </div>
      <div className="lead-overview-footer">
        {account.factors.length > 0 && <details className="score-details">
          <summary>How the score was calculated</summary>
          <div className="score-factors">{account.factors.map((factor) => <div key={factor.id}>
            <span>{factor.label}</span><strong>{factor.value}</strong><i><b style={{ width: `${factor.value}%` }} /></i>
          </div>)}</div>
        </details>}
        <details className="lead-feedback">
          <summary>{feedbackSelected ? 'Feedback saved' : 'Rate this lead'}</summary>
          <div>{feedbackOptions.map((option) => <button key={option.value} type="button" className={feedbackSelected === option.value ? 'is-selected' : ''} onClick={() => handleFeedback(option.value)}>
            {feedbackSelected === option.value && <Check size={12} />}{option.label}
          </button>)}</div>
        </details>
      </div>
    </section>

    <div className="account-layout simple-account-layout">
      <main className="account-main-column">
        <section className="card evidence-card">
          <div className="card-heading-row">
            <div><span className="eyebrow-label">Evidence</span><h2>What we found</h2></div>
            <span className="confidence-chip">{account.evidenceTotal} {account.evidenceTotal === 1 ? 'record' : 'records'}</span>
          </div>
          {account.evidence.length === 0 ? <div className="lead-empty-state"><Target size={20} /><div><strong>No evidence captured yet</strong><p>Research this account before using it in outreach.</p></div></div> :
            <div className="evidence-timeline">{account.evidence.map((item) => {
              const Icon = evidenceToneIcon[item.tone]
              return <article key={item.id}>
                <span className={`timeline-icon ${item.tone}`}><Icon size={14} /></span>
                <div className="timeline-content">
                  <div><strong>{item.title}</strong><time>{item.time}</time></div>
                  <p>{item.detail}</p>
                  <div className="source-line">
                    {item.source ? <a href={item.source} target="_blank" rel="noreferrer">{sourceName(item.source)} <ExternalLink size={10} /></a> : <span>Source unavailable</span>}
                    <span className={`evidence-strength ${item.strength === 'medium' ? 'medium' : ''}`}>{item.strength === 'strong' ? 'Strong evidence' : 'Supporting evidence'}</span>
                  </div>
                </div>
              </article>
            })}</div>}
        </section>

        <section className="card contacts-card">
          <div className="card-heading-row"><div><span className="eyebrow-label">Contacts</span><h2>People to speak with</h2></div></div>
          {account.contacts.length === 0 ? <div className="lead-empty-state"><Users size={20} /><div><strong>No verified contacts yet</strong><p>Enrich this account before starting outreach.</p></div></div> :
            <div className="contact-table">{account.contacts.map((contact) => <div className="contact-row" key={contact.id}>
              <span className={`contact-avatar ${contact.avatarClass}`}>{contact.initials}</span>
              <p><strong>{contact.name}</strong><small>{contact.role}</small></p>
              <span className={`relevance-pill ${contact.relevanceClass}`}>{contact.relevance}</span>
              {contact.relevancePct > 0 ? <span className="contact-confidence"><i style={{ width: `${contact.relevancePct}%` }} /><small>{contact.relevancePct}% relevance</small></span> : <span />}
              <div>
                {contact.email && <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.name}`} title={contact.email}><Mail size={13} /></a>}
                {contact.linkedinUrl && <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" aria-label={`${contact.name} on LinkedIn`}><Link2 size={13} /></a>}
              </div>
            </div>)}</div>}
        </section>
      </main>

      <aside className="account-aside">
        <section className="card company-snapshot">
          <div className="card-heading-row compact"><h2>Company overview</h2></div>
          <dl>{account.snapshot.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
        </section>
        <section className="card buying-window-card">
          <div className="window-title">
            <span className="hot-pulse"><i /></span>
            <div><small>Buying readiness</small><strong>{account.window}</strong></div>
            {account.windowScore !== null && <span>{account.windowScore} / 100</span>}
          </div>
          <p>{account.windowNote}</p>
          {account.windowReasons.length > 0 && <ul>{account.windowReasons.map((reason) => <li key={reason}><Target size={11} /> {reason}</li>)}</ul>}
          <div className="window-footer">{account.windowUpdated}</div>
        </section>
        {account.talkingPoints.length > 0 && <section className="card talking-points-card">
          <span className="model-badge"><Sparkles size={11} /> Suggested talking points</span>
          <h2>Keep the first message relevant</h2>
          <ol>{account.talkingPoints.map((point, index) => <li key={`${index}-${point}`}><span>{index + 1}</span><p>{point}</p></li>)}</ol>
          <Link to="/campaigns">Draft a message <ArrowRight size={12} /></Link>
        </section>}
      </aside>
    </div>
  </div>
}
