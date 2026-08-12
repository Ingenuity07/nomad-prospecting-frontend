import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="page page-enter placeholder-page">
      <div className="card placeholder-empty" style={{ maxWidth: 520, margin: '60px auto' }}>
        <h2>Page not found</h2>
        <p>The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/" className="button button-primary">
          Back to overview <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
