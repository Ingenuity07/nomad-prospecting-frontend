import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CampaignBuilderPage } from './pages/CampaignBuilderPage'
import { CampaignsPage } from './pages/CampaignsPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { LeadDetailPage } from './pages/LeadDetailPage'
import { LeadsPage } from './pages/LeadsPage'
import { ListsPage } from './pages/ListsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OverviewPage } from './pages/OverviewPage'
import { SettingsPage } from './pages/SettingsPage'
import { SignalsPage } from './pages/SignalsPage'
import { LLMAnalyticsPage } from './pages/LLMAnalyticsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="signals" element={<SignalsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/:leadId" element={<LeadDetailPage />} />
          <Route path="lists" element={<ListsPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="campaigns/new" element={<CampaignBuilderPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="llm-analytics" element={<LLMAnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
