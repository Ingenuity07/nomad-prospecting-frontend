import { useState } from 'react'
import {
  BellRing,
  Building2,
  ChevronDown,
  CircleHelp,
  MailCheck,
  Plug,
  Radar,
  Save,
  UsersRound,
} from 'lucide-react'

const navItems = [
  { id: 'workspace', label: 'Workspace', detail: 'Name, defaults, and notifications', icon: Building2 },
  { id: 'scoring', label: 'Scoring model', detail: 'Fit and evidence weights', icon: Radar },
  { id: 'integrations', label: 'Integrations', detail: 'CRM and data connections', icon: Plug },
  { id: 'team', label: 'Team', detail: 'Members, roles, and access', icon: UsersRound },
]

const notificationRows = [
  {
    id: 'digest',
    title: 'Weekly opportunity digest',
    detail: 'Top new accounts, rising problems, and buying-window changes.',
    icon: BellRing,
    on: true,
  },
  {
    id: 'replies',
    title: 'Positive reply alerts',
    detail: 'Notify me when a problem-led campaign receives a positive reply.',
    icon: MailCheck,
    on: true,
  },
  {
    id: 'signals',
    title: 'Every new signal match',
    detail: 'Real-time notification for all saved problem signals.',
    icon: Radar,
    on: false,
  },
]

export function SettingsPage() {
  const [activeNav, setActiveNav] = useState('workspace')
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notificationRows.map((row) => [row.id, row.on])),
  )
  const [saved, setSaved] = useState(false)

  const toggle = (id: string) => {
    setToggles((current) => ({ ...current, [id]: !current[id] }))
  }

  const save = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="page page-enter settings-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Workspace settings</span>
          <h1>Shape Nomad around your sales motion.</h1>
          <p>
            Configure how your team discovers, scores, routes, and acts on
            operational-problem opportunities.
          </p>
        </div>
      </header>

      <div className="settings-layout">
        <aside className="settings-nav card">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                className={activeNav === item.id ? 'active' : ''}
                onClick={() => setActiveNav(item.id)}
              >
                <span>
                  <Icon size={14} />
                </span>
                <p>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </p>
                <ChevronDown size={13} />
              </button>
            )
          })}
          <div className="settings-help">
            <CircleHelp size={15} />
            <p>
              <strong>Need help?</strong>
              <small>See setup guides or chat with us.</small>
            </p>
          </div>
        </aside>

        <div className="settings-content">
          <section className="card settings-section">
            <div className="settings-section-head">
              <div>
                <h2>Workspace details</h2>
                <p>Used across exports, invites, and shared views.</p>
              </div>
            </div>
            <div className="settings-form-grid">
              <label>
                <span className="field-label">Workspace name</span>
                <input defaultValue="RouteOps" />
              </label>
              <label>
                <span className="field-label">Company website</span>
                <input defaultValue="routeops.io" />
              </label>
              <label>
                <span className="field-label">Default market</span>
                <select defaultValue="United Kingdom">
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Europe</option>
                </select>
              </label>
              <label>
                <span className="field-label">Timezone</span>
                <select defaultValue="Europe/London">
                  <option>Europe/London</option>
                  <option>Asia/Kolkata</option>
                  <option>America/New_York</option>
                </select>
              </label>
            </div>
          </section>

          <section className="card settings-section">
            <div className="settings-section-head">
              <div>
                <h2>Notifications</h2>
                <p>Choose which changes should reach you outside Nomad.</p>
              </div>
            </div>
            <div className="setting-rows">
              {notificationRows.map((row) => {
                const Icon = row.icon
                const on = toggles[row.id]
                return (
                  <div key={row.id}>
                    <span className="setting-row-icon">
                      <Icon size={14} />
                    </span>
                    <p>
                      <strong>{row.title}</strong>
                      <small>{row.detail}</small>
                    </p>
                    <button
                      className={`switch ${on ? 'on' : ''}`}
                      type="button"
                      onClick={() => toggle(row.id)}
                      aria-label={`Toggle ${row.title}`}
                      aria-pressed={on}
                    >
                      <i />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="settings-save-bar">
            <span>
              <Save size={12} />
              {saved ? 'Changes saved' : 'Changes apply to your whole workspace'}
            </span>
            <button className="button button-dark" type="button" onClick={save}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
