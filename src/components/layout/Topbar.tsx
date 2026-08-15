import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, MailCheck, Menu, Plus, Radar, Search, TimerReset } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { NAV_ITEMS, SEARCH_PLACEHOLDER } from '../../constants'
import { mockDashboard } from '../../api/mockData'
import { navIcon } from './navIcons'

interface TopbarProps {
  onOpenMenu: () => void
}

interface CommandEntry {
  to: string
  label: string
  detail: string
  icon: typeof Radar
}

const commandItems: CommandEntry[] = NAV_ITEMS.map((item) => ({
  to: item.to,
  label: item.label,
  detail: item.detail,
  icon: navIcon(item.icon),
}))

const notificationToneIcons = {
  lime: Radar,
  blue: MailCheck,
  amber: TimerReset,
} as const

export function Topbar({ onOpenMenu }: TopbarProps) {
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commandItems
    return commandItems.filter((item) =>
      `${item.label} ${item.detail}`.toLowerCase().includes(q),
    )
  }, [query])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => {
          if (!open) setQuery('')
          return !open
        })
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (paletteOpen) {
      setActiveIndex(0)
      window.setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [paletteOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const go = (to: string) => {
    setPaletteOpen(false)
    setQuery('')
    navigate(to)
  }

  const onPaletteKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault()
      go(results[activeIndex].to)
    }
  }

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onOpenMenu} aria-label="Open navigation">
        <Menu size={20} />
      </button>

      <button
        className="global-search"
        onClick={() => setPaletteOpen(true)}
        aria-label="Search accounts, signals, or lists"
      >
        <Search size={17} />
        <span>{SEARCH_PLACEHOLDER}</span>
        <kbd>⌘ K</kbd>
      </button>

      <div className="topbar-actions">
        <div className="popover-wrap">
          <button
            className="icon-button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <i />
          </button>
          {notificationsOpen && (
            <div className="popover-panel">
              <div className="popover-title">
                <strong>Notifications</strong>
                <button type="button" onClick={() => setNotificationsOpen(false)}>
                  Mark all read
                </button>
              </div>
              <div className="notification-popover">
                {mockDashboard.activity.map((notification) => {
                  const Icon = notificationToneIcons[notification.tone]
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false)
                        navigate('/analytics')
                      }}
                    >
                      <span className={`activity-icon activity-${notification.tone}`}>
                        <Icon size={15} />
                      </span>
                      <span>
                        <strong>{notification.title}</strong>
                        <small>{notification.detail}</small>
                      </span>
                      <time>{notification.time}</time>
                    </button>
                  )
                })}
              </div>
              <a href="/analytics" onClick={() => setNotificationsOpen(false)}>
                View all notifications
              </a>
            </div>
          )}
        </div>

        <a href="/discover" className="button button-dark topbar-cta">
          <Plus size={16} /> New discovery
        </a>
      </div>

      {paletteOpen && (
        <div
          className="command-backdrop"
          onClick={() => setPaletteOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div className="command-panel" onClick={(event) => event.stopPropagation()}>
            <div className="command-input">
              <Search size={17} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onPaletteKeyDown}
                placeholder="Search accounts, signals, or lists…"
                aria-label="Search"
              />
              <kbd>esc</kbd>
            </div>
            <div className="command-body">
              <span className="command-label">{query ? 'Matches' : 'Quick navigation'}</span>
              {results.length === 0 && (
                <p className="command-label" style={{ paddingTop: 8 }}>
                  No matches for “{query}”
                </p>
              )}
              {results.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.to}
                    type="button"
                    className={`command-item ${index === activeIndex ? 'command-active' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(item.to)}
                  >
                    <span>
                      <Icon size={16} />
                    </span>
                    <p>
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </p>
                    {index === activeIndex && <span className="command-enter">↵</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
