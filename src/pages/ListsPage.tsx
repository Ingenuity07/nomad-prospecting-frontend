import { ArrowRight, FolderPlus, Layers, MoreHorizontal, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { accountLists } from '../api/mockData'
import type { AccountList } from '../types'

const listIcon: Record<AccountList['iconTone'], typeof Layers> = {
  lime: Layers,
  blue: Layers,
  amber: Layers,
  violet: Layers,
  teal: Layers,
}

export function ListsPage() {
  return (
    <div className="page page-enter lists-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Account lists</span>
          <h1>Turn discoveries into focused motions.</h1>
          <p>
            Organize qualified accounts by operational problem, buying window, or team
            workflow. Smart lists update as Nomad finds new evidence.
          </p>
        </div>
        <div className="page-actions">
          <button className="button button-primary" type="button">
            <FolderPlus size={15} /> New list
          </button>
        </div>
      </header>

      <section className="featured-lists-grid">
        {accountLists.slice(0, 3).map((list) => {
          const Icon = listIcon[list.iconTone]
          return (
            <article className="card list-card" key={list.id}>
              <div className="list-card-head">
                <span className={`list-icon ${list.iconTone}`}>
                  <Icon size={16} />
                </span>
                {list.kind === 'smart' && (
                  <span className="smart-pill">
                    <Sparkles size={9} /> Smart list
                  </span>
                )}
                <button type="button" aria-label={`Options for ${list.name}`}>
                  <MoreHorizontal size={15} />
                </button>
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
                <span className="avatar-stack">
                  {list.owners.map((owner, index) => (
                    <i key={owner} style={{ zIndex: list.owners.length - index }}>
                      {owner}
                    </i>
                  ))}
                </span>
                <span>Updated {list.updated}</span>
                <Link to="/leads">
                  Open <ArrowRight size={11} />
                </Link>
              </div>
            </article>
          )
        })}

        <button className="new-list-card" type="button">
          <span>
            <FolderPlus size={17} />
          </span>
          <strong>Create a new list</strong>
          <small>Start from a problem signal or filters</small>
        </button>
      </section>

      <section className="card all-lists-card">
        <div className="card-heading-row">
          <div>
            <span className="eyebrow-label">All lists</span>
            <h2>Workspace collections</h2>
          </div>
          <div className="list-view-tabs">
            <button className="active" type="button">
              <Layers size={12} /> Lists
            </button>
            <button type="button">
              <FolderPlus size={12} /> Folders
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table lists-table">
            <thead>
              <tr>
                <th>List name</th>
                <th>Type</th>
                <th>Accounts</th>
                <th>Owner</th>
                <th>Last updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {accountLists.map((list) => {
                const Icon = listIcon[list.iconTone]
                return (
                  <tr key={list.id}>
                    <td>
                      <Link to="/leads" className="list-name-cell">
                        <span className={`mini-list-icon ${list.iconTone}`}>
                          <Icon size={14} />
                        </span>
                        <span>
                          <strong>{list.name}</strong>
                          <small>
                            {list.kind === 'smart' ? 'Auto-updates from saved criteria' : 'Static account list'}
                          </small>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <span className={list.kind === 'smart' ? 'smart-type' : 'static-type'}>
                        {list.kind === 'smart' ? <Sparkles size={9} /> : <Users size={9} />}
                        {list.kind === 'smart' ? 'Smart' : 'Static'}
                      </span>
                    </td>
                    <td>
                      <strong>{list.accounts}</strong>
                    </td>
                    <td>
                      <span className="list-owner">
                        <i>{list.owners[0]}</i>
                        {list.owners[0] === 'PS' ? 'Priya Shah' : list.owners[0] === 'JM' ? 'Jon Miles' : 'Alex Kim'}
                      </span>
                    </td>
                    <td>
                      <span className="updated-cell">{list.updated}</span>
                    </td>
                    <td>
                      <button className="quiet-icon" type="button" aria-label={`Options for ${list.name}`}>
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lists-tip">
        <span>
          <Users size={16} />
        </span>
        <div>
          <strong>Collaborate without duplicating work</strong>
          <p>Assign an owner, share context, and launch problem-led campaigns directly from any list.</p>
        </div>
        <button type="button">
          Invite teammate <ArrowRight size={12} />
        </button>
      </section>
    </div>
  )
}
