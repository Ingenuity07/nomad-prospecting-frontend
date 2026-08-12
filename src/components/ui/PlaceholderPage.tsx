import { Construction } from 'lucide-react'
import { PageHeader } from '../dashboard/PageHeader'

interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  section: string
}

export function PlaceholderPage({ eyebrow, title, description, section }: PlaceholderPageProps) {
  return (
    <div className="page page-enter placeholder-page">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="card placeholder-empty">
        <span className="empty-icon">
          <Construction size={22} />
        </span>
        <h2>{section} is on its way</h2>
        <p>
          This section shares the Nomad shell and design system but hasn’t been built out yet.
          Point it at a backend or add the reference design to replicate it.
        </p>
      </div>
    </div>
  )
}
