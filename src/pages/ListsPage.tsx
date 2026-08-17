import { useState } from 'react'
import { ArrowRight, Check, FolderPlus, Layers, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLists } from '../api/dashboard'
import { useAsyncData } from '../hooks/useAsyncData'
import { PageLoader } from '../components/ui/PageLoader'
import type { AccountList } from '../types'

export function ListsPage() {
  const { data: listsList, loading } = useAsyncData(getLists, [])
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [kind, setKind] = useState<'smart' | 'static'>('smart')
  const [view, setView] = useState<'lists' | 'folders'>('lists')
  const [invited, setInvited] = useState(false)
  const [extraLists, setExtraLists] = useState<AccountList[]>([])

  const allLists = [...listsList, ...extraLists]

  const createList = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setExtraLists((current) => [
      ...current,
      {
        id: `new-${Date.now()}`,
        name: trimmed,
        description: kind === 'smart' ? 'Auto-updates from saved criteria' : 'Static account list',
        kind,
        iconTone: kind === 'smart' ? 'lime' : 'violet',
        accounts: 0,
        newThisWeek: 0,
        actNow: 0,
        owners: ['SS'],
        updated: 'Just now',
      },
    ])
    setName('')
    setCreating(false)
  }

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/invite/routeops`)
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setInvited(true)
    window.setTimeout(() => setInvited(false), 2000)
  }

  return (
    <div className="page page-enter lists-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Lists</span>
          <h1>Save groups of accounts your team can work from.</h1>
          <p>
            Keep accounts together by problem, buying window, or campaign. Smart lists update
            automatically as we find new evidence.
          </p>
        </div>
        <div className="page-actions">
          <button className="button button-primary" type="button" onClick={() => setCreating(true)}>
            <FolderPlus size={15} /> New list
          </button>
        </div>
      </header>

      {loading ? <PageLoader label="Loading saved lists…" /> : <>

      {creating && (
        <section className="card discovery-card" style={{ marginBottom: 22 }}>
          <h2>Create a new list</h2>
          <p>Give the list a name and choose how it stays up to date.</p>
          <div className="discovery-field">
            <label htmlFor="list-name">
              List name <span>(required)</span>
            </label>
            <input
              id="list-name"
              className="discovery-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Route planning · North England"
              autoFocus
            />
          </div>
          <div className="discovery-field">
            <span className="field-label">List type</span>
            <div className="discovery-examples">
              <button
                type="button"
                onClick={() => setKind('smart')}
                style={kind === 'smart' ? { borderColor: 'var(--lime-dark)', background: '#f7fce8', color: 'var(--ink)' } : undefined}
              >
                <Sparkles size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                Smart — updates automatically
              </button>
              <button
                type="button"
                onClick={() => setKind('static')}
                style={kind === 'static' ? { borderColor: 'var(--lime-dark)', background: '#f7fce8', color: 'var(--ink)' } : undefined}
              >
                <Users size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                Static — you pick the accounts
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="button button-primary" type="button" onClick={createList} disabled={!name.trim()}>
              <Check size={15} /> Create list
            </button>
            <button className="button button-secondary" type="button" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="featured-lists-grid">
        {allLists.slice(0, 3).map((list) => (
          <article className="card list-card" key={list.id}>
            <div className="list-card-head">
              <span className={`list-icon ${list.iconTone}`}>
                <Layers size={16} />
              </span>
              {list.kind === 'smart' && (
                <span className="smart-pill">
                  <Sparkles size={11} /> Smart list
                </span>
              )}
            </div>
            <h2>{list.name}</h2>
            <p>{list.description}</p>
            <div className="list-stats">
              <div>
                <strong>{list.accounts}</strong>
                <small>accounts</small>
              </div>
              <div>
                <strong>+{list.newThisWeek}</strong>
                <small>new this week</small>
              </div>
              <div>
                <strong>{list.actNow}</strong>
                <small>act now</small>
              </div>
            </div>
            <div className="list-card-foot">
              <span>Updated {list.updated}</span>
              <Link to="/leads">
                Open <ArrowRight size={12} />
              </Link>
            </div>
          </article>
        ))}

        <button className="new-list-card" type="button" onClick={() => setCreating(true)}>
          <span>
            <FolderPlus size={17} />
          </span>
          <strong>Create a new list</strong>
          <small>Give it a name and choose how it updates</small>
        </button>
      </section>

      <section className="card all-lists-card">
        <div className="card-heading-row">
          <div>
            <span className="eyebrow-label">All lists</span>
            <h2>Workspace collections</h2>
          </div>
          <div className="list-view-tabs">
            <button className={view === 'lists' ? 'active' : ''} type="button" onClick={() => setView('lists')}>
              <Layers size={13} /> Lists
            </button>
            <button className={view === 'folders' ? 'active' : ''} type="button" onClick={() => setView('folders')}>
              <FolderPlus size={13} /> Folders
            </button>
          </div>
        </div>

        {view === 'folders' ? (
          <div className="table-empty" style={{ padding: '40px 16px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>No folders yet</h3>
            <p style={{ margin: 0 }}>Folders help you group related lists. Create one from any list's menu.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table lists-table">
              <thead>
                <tr>
                  <th>List name</th>
                  <th>Type</th>
                  <th>Accounts</th>
                  <th>Owner</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>
                {allLists.map((list) => (
                  <tr key={list.id}>
                    <td>
                      <Link to="/leads" className="list-name-cell">
                        <span className={`mini-list-icon ${list.iconTone}`}>
                          <Layers size={14} />
                        </span>
                        <span>
                          <strong>{list.name}</strong>
                          <small>{list.kind === 'smart' ? 'Auto-updates from saved criteria' : 'Static account list'}</small>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <span className={list.kind === 'smart' ? 'smart-type' : 'static-type'}>
                        {list.kind === 'smart' ? <Sparkles size={10} /> : <Users size={10} />}
                        {list.kind === 'smart' ? 'Smart' : 'Static'}
                      </span>
                    </td>
                    <td>
                      <strong>{list.accounts}</strong>
                    </td>
                    <td>
                      <span className="list-owner">
                        <i>{list.owners[0]}</i>
                        {list.owners[0] === 'SS' ? 'Shivam Singh' : list.owners[0] === 'JM' ? 'Jon Miles' : 'Alex Kim'}
                      </span>
                    </td>
                    <td>
                      <span className="updated-cell">{list.updated}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allLists.length === 0 && (
              <div className="table-empty">
                <p>No lists yet. Create your first list to get started.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="lists-tip">
        <span>
          <Users size={16} />
        </span>
        <div>
          <strong>Work together without duplicating effort</strong>
          <p>Give each list an owner, share it with your team, and launch campaigns straight from any list.</p>
        </div>
        <button type="button" onClick={copyInvite}>
          {invited ? (
            <>
              <Check size={12} /> Invite link copied
            </>
          ) : (
            <>
              Invite teammate <ArrowRight size={12} />
            </>
          )}
        </button>
      </section>
      </>}
    </div>
  )
}
