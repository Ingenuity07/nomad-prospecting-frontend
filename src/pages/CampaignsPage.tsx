import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Clock3,
  Handshake,
  MailCheck,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Radar,
  Route,
  Send,
  Sparkles,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { campaignInsight, campaignMetrics, campaigns, playbooks } from '../api/mockData'
import type { Campaign, CampaignMetric, Playbook } from '../types'

const metricIcon: Record<CampaignMetric['id'], LucideIcon> = {
  contacted: Send,
  'reply-rate': MailCheck,
  meetings: Handshake,
  'time-to-reply': Clock3,
}

const campaignIcon: Record<Campaign['iconTone'], LucideIcon> = {
  lime: Route,
  blue: Radar,
  amber: Wrench,
}

const playbookIcon: Record<Playbook['iconTone'], LucideIcon> = {
  lime: Route,
  blue: Radar,
  amber: Wrench,
}

export function CampaignsPage() {
  const [tab, setTab] = useState('campaigns')
  const [paused, setPaused] = useState<Set<string>>(
    () => new Set(campaigns.filter((campaign) => campaign.status === 'Paused').map((campaign) => campaign.id)),
  )

  const togglePause = (id: string) => {
    setPaused((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="page page-enter campaigns-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Problem-led activation</span>
          <h1>Outreach that starts with evidence.</h1>
          <p>
            Turn a qualified operational problem into a relevant campaign. Nomad carries the
            account evidence and buying context into every message.
          </p>
        </div>
        <div className="page-actions">
          <button className="button button-primary" type="button">
            <Plus size={15} /> New campaign
          </button>
        </div>
      </header>

      <div className="page-tabs">
        <button type="button" className={tab === 'campaigns' ? 'active' : ''} onClick={() => setTab('campaigns')}>
          Campaigns <span>{campaigns.length}</span>
        </button>
        <button type="button" className={tab === 'sequences' ? 'active' : ''} onClick={() => setTab('sequences')}>
          Sequences
        </button>
        <button type="button" className={tab === 'playbooks' ? 'active' : ''} onClick={() => setTab('playbooks')}>
          Problem playbooks
        </button>
      </div>

      <section className="campaign-metric-grid">
        {campaignMetrics.map((metric) => {
          const Icon = metricIcon[metric.id]
          return (
            <article className="card campaign-metric" key={metric.id}>
              <span>
                <Icon size={16} />
              </span>
              <div>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
                <p>{metric.note}</p>
              </div>
              <b className={metric.flat ? 'flat' : ''}>{metric.change}</b>
            </article>
          )
        })}
      </section>

      <section className="campaign-layout">
        <article className="card campaigns-table-card">
          <div className="card-heading-row">
            <div>
              <span className="eyebrow-label">Active motions</span>
              <h2>Your campaigns</h2>
            </div>
            <button className="toolbar-select bare" type="button">
              All statuses <ChevronDown size={12} />
            </button>
          </div>
          <div className="campaign-list">
            {campaigns.map((campaign) => {
              const Icon = campaignIcon[campaign.iconTone]
              const isPaused = paused.has(campaign.id)
              const progress = Math.round((campaign.sent / campaign.total) * 100)
              return (
                <div className="campaign-row" key={campaign.id}>
                  <span className={`campaign-symbol ${campaign.iconTone}`}>
                    <Icon size={14} />
                  </span>
                  <p>
                    <strong>{campaign.name}</strong>
                    <small>
                      {campaign.problem} · Updated {campaign.updated}
                    </small>
                  </p>
                  <span className={`campaign-status ${isPaused ? 'paused' : 'live'}`}>
                    <i /> {isPaused ? 'Paused' : 'Live'}
                  </span>
                  <div className="campaign-progress">
                    <span>
                      <b style={{ width: `${progress}%` }} />
                    </span>
                    <small>
                      {campaign.sent}/{campaign.total} sent
                    </small>
                  </div>
                  <div className="campaign-result">
                    <small>Positive replies</small>
                    <strong>{campaign.positiveReplies}%</strong>
                  </div>
                  <div className="campaign-result">
                    <small>Meetings</small>
                    <strong>{campaign.meetings}</strong>
                  </div>
                  <span className="campaign-owner">{campaign.owner}</span>
                  <button
                    className="campaign-control"
                    type="button"
                    onClick={() => togglePause(campaign.id)}
                    aria-label={isPaused ? 'Resume campaign' : 'Pause campaign'}
                  >
                    {isPaused ? <Play size={12} /> : <Pause size={12} />}
                  </button>
                  <button className="quiet-icon" type="button" aria-label={`Options for ${campaign.name}`}>
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              )
            })}
          </div>
          <button className="campaign-all-link" type="button">
            View completed campaigns <ArrowRight size={12} />
          </button>
        </article>

        <aside className="card campaign-insight-card">
          <span className="model-badge">
            <Sparkles size={11} /> Nomad insight
          </span>
          <h2>{campaignInsight.title}</h2>
          <p>
            {campaignInsight.body} <strong>{campaignInsight.multiplier}</strong>.
          </p>
          <div className="reply-compare">
            <div>
              <span>{campaignInsight.evidenceLed.label}</span>
              <strong>{campaignInsight.evidenceLed.value}</strong>
              <i>
                <b style={{ width: `${campaignInsight.evidenceLed.bar}%` }} />
              </i>
            </div>
            <div>
              <span>{campaignInsight.generic.label}</span>
              <strong>{campaignInsight.generic.value}</strong>
              <i>
                <b style={{ width: `${campaignInsight.generic.bar}%` }} />
              </i>
            </div>
          </div>
          <button type="button">
            <BarChart3 size={13} /> View message analysis
          </button>
        </aside>
      </section>

      <section className="card recommended-playbooks">
        <div className="card-heading-row">
          <div>
            <span className="eyebrow-label">Recommended for your signals</span>
            <h2>Problem playbooks</h2>
          </div>
          <button className="text-link" type="button">
            Browse all <ArrowRight size={13} />
          </button>
        </div>
        <div className="playbook-grid">
          {playbooks.map((playbook) => {
            const Icon = playbookIcon[playbook.iconTone]
            return (
              <article className="playbook-card" key={playbook.id}>
                <span className={`playbook-icon ${playbook.iconTone}`}>
                  <Icon size={14} />
                </span>
                <span className="template-badge">Template</span>
                <h3>{playbook.title}</h3>
                <p>{playbook.problem}</p>
                <div>
                  <span>{playbook.steps} steps</span>
                  <span>{playbook.avgReply} avg. reply</span>
                </div>
                <button type="button">
                  Use playbook <ArrowRight size={11} />
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
