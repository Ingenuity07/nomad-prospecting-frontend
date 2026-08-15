import {
  ChevronDown,
  Compass,
  Cpu,
  LayoutDashboard,
  Radar,
  Target,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { NAV_ITEMS, WORKSPACE } from '../../constants'

const navIconMap: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  radar: Radar,
  'users-round': UsersRound,
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
          {NAV_ITEMS.map((item) => {
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
              </NavLink>
            )
          })}
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
