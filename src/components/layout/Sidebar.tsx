import {
  ChartColumn,
  ChevronDown,
  CircleHelp,
  Compass,
  Cpu,
  LayoutDashboard,
  ListFilter,
  MessageSquareText,
  Radar,
  Settings,
  Target,
  UsersRound,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { NAV_GROUPS, SIDEBAR_FOOTER_LINKS, WORKSPACE } from '../../constants'

const navIconMap: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  radar: Radar,
  zap: Zap,
  'users-round': UsersRound,
  'list-filter': ListFilter,
  'message-square-text': MessageSquareText,
  'chart-column': ChartColumn,
  settings: Settings,
  'circle-help': CircleHelp,
  cpu: Cpu,
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <Link to="/" className="brand" aria-label="Nomad home">
            <span className="brand-mark">
              <Compass size={19} strokeWidth={2.3} />
            </span>
            <span>nomad</span>
          </Link>
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <Link to="/settings" className="workspace-switcher" aria-label="Open workspace settings">
          <span className="workspace-avatar">{WORKSPACE.initials}</span>
          <span>
            <strong>{WORKSPACE.name}</strong>
            <small>{WORKSPACE.plan}</small>
          </span>
          <ChevronDown size={15} />
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {NAV_GROUPS.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = navIconMap[item.icon]
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={'end' in item ? item.end : false}
                    className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
                  >
                    <Icon size={17} strokeWidth={1.9} />
                    <span>{item.label}</span>
                    {'badge' in item && item.badge ? <small className="nav-ai">{item.badge}</small> : null}
                    {'count' in item && item.count ? <small className="nav-count">{item.count}</small> : null}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="trial-card">
            <span className="trial-icon">
              <Target size={16} />
            </span>
            <strong>{WORKSPACE.creditsLeft}</strong>
            <small>{WORKSPACE.renewsOn}</small>
            <div className="credit-bar">
              <span style={{ width: `${WORKSPACE.creditUsedPercent}%` }} />
            </div>
            <Link to="/settings">{WORKSPACE.managePlanLabel}</Link>
          </div>

          {SIDEBAR_FOOTER_LINKS.map((item) => {
            const Icon = navIconMap[item.icon]
            const isHash = item.to.startsWith('#')
            return isHash ? (
              <a key={item.to} className="nav-item" href={item.to}>
                <Icon size={17} strokeWidth={1.9} />
                <span>{item.label}</span>
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
              >
                <Icon size={17} strokeWidth={1.9} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <Link to="/settings" className="profile-row" aria-label="Open account settings">
            <span className="profile-avatar">{WORKSPACE.userInitials}</span>
            <span>
              <strong>{WORKSPACE.userName}</strong>
              <small>{WORKSPACE.userRole}</small>
            </span>
            <ChevronDown size={15} />
          </Link>
        </div>
      </aside>

      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation" />}
    </>
  )
}
