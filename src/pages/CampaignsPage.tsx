import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  Clock3,
  Handshake,
  MailCheck,
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
import { Link } from 'react-router-dom'
import { campaignInsight } from '../api/mockData'
import { getCampaignMetrics, getCampaigns, getPlaybooks } from '../api/dashboard'
import { useAsyncData } from '../hooks/useAsyncData'
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

  const { data: metricsList } = useAsyncData(getCampaignMetrics, [])
  const { data: campaignsList } = useAsyncData(getCampaigns, [])
  const { data: playbooksList } = useAsyncData(getPlaybooks, [])

  const [paused, setPaused] = useState<Set<string>>(() => new Set())

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
          <Link to="/campaigns/new" className="button button-primary">
            <Plus size={15} /> New campaign
          </Link>
        </div>
      </header>

      <div className="page-tabs">
        <button type="button" className={tab === 'campaigns' ? 'active' : ''} onClick={() => setTab('campaigns')}>
          Campaigns <span>{campaignsList.length}</span>
        </button>
        <button type="button" className={tab === 'sequences' ? 'active' : ''} onClick={() => setTab('sequences')}>
          Sequences
        </button>
        <button type="button" className={tab === 'playbooks' ? 'active' : ''} onClick={() => setTab('playbooks')}>
          Problem playbooks
        </button>
      </div>

      <section className="campaign-metric-grid">
        {metricsList.map((metric) => {
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
          </div>
          <div className="campaign-list">
            {campaignsList.map((campaign) => {
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
                </div>
              )
            })}
          </div>
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
          <Link to="/analytics" className="campaign-insight-link">
            <BarChart3 size={13} /> View message analysis <ArrowRight size={12} />
          </Link>
        </aside>
      </section>

      <section className="card recommended-playbooks">
        <div className="card-heading-row">
          <div>
            <span className="eyebrow-label">Recommended for your signals</span>
            <h2>Problem playbooks</h2>
          </div>
          <Link to="/campaigns/new" className="text-link">
            New campaign <ArrowRight size={13} />
          </Link>
        </div>
        <div className="playbook-grid">
          {playbooksList.map((playbook) => {
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
                <Link to="/campaigns/new">
                  Use playbook <ArrowRight size={11} />
                </Link>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
