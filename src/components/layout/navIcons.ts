import {
  ChartColumn,
  CircleHelp,
  LayoutDashboard,
  ListFilter,
  MessageSquareText,
  Radar,
  Settings,
  UsersRound,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/** Maps the icon string names used in src/constants to lucide components. */
export const navIcons: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  radar: Radar,
  zap: Zap,
  'users-round': UsersRound,
  'list-filter': ListFilter,
  'message-square-text': MessageSquareText,
  'chart-column': ChartColumn,
  settings: Settings,
  'circle-help': CircleHelp,
}

export function navIcon(name: string): LucideIcon {
  return navIcons[name] ?? Radar
}
