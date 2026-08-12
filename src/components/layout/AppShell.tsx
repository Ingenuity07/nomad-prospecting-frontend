import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="app-frame">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-frame">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="content-shell">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
