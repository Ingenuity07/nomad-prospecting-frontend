import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OVERVIEW } from '../../constants'
import type { PriorityAccount } from '../../types'

const windowClass: Record<PriorityAccount['window'], string> = {
  'Act now': 'window-hot',
  'This quarter': 'window-warm',
  'This month': 'window-hot',
  Researching: 'window-cool',
  Monitoring: 'window-neutral',
  'Next quarter': 'window-neutral',
}

interface PriorityAccountsProps {
  accounts: PriorityAccount[]
}

export function PriorityAccounts({ accounts }: PriorityAccountsProps) {
  return (
    <article className="card priority-card">
      <div className="card-heading-row">
        <div>
          <span className="eyebrow-label">{OVERVIEW.priorityEyebrow}</span>
          <h2>{OVERVIEW.priorityTitle}</h2>
        </div>
        <Link to="/leads" className="text-link">
          {OVERVIEW.allAccounts} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="table-wrap">
        <table className="data-table compact-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Problem detected</th>
              <th>Window</th>
              <th>Fit</th>
              <th aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <Link to={`/leads/${account.id}`} className="company-cell">
                    <span className={`company-mark mark-${account.markTone} mark-normal`} aria-hidden="true">
                      {account.initials}
                    </span>
                    <span>
                      <strong>{account.name}</strong>
                      <small>{account.location}</small>
                    </span>
                  </Link>
                </td>
                <td>
                  <span className="issue-cell">{account.problem}</span>
                </td>
                <td>
                  <span className={`window-badge ${windowClass[account.window]}`}>{account.window}</span>
                </td>
                <td>
                  <span className={`score-badge ${account.fitScore >= 85 ? 'score-high' : 'score-good'}`}>
                    {account.fitScore}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/leads/${account.id}`}
                    aria-label={`Open ${account.name}`}
                    className="icon-button mini"
                  >
                    <ArrowRight size={15} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
