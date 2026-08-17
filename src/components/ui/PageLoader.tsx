import { LoaderCircle } from 'lucide-react'

export function PageLoader({ label = 'Loading your data…' }: { label?: string }) {
  return (
    <section className="page-loader" role="status" aria-live="polite" aria-label={label}>
      <div className="page-loader-copy">
        <span className="page-loader-icon"><LoaderCircle size={18} /></span>
        <div>
          <strong>{label}</strong>
          <small>Please wait while we get everything ready.</small>
        </div>
      </div>
      <div className="page-loader-skeleton" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
    </section>
  )
}
