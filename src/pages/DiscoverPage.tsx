import { useState, type FormEvent, type ReactElement } from 'react'
import {
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Layers,
  Lightbulb,
  MapPin,
  Plus,
  Radar,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react'
import { discoveryProblem } from '../api/mockData'
import type { EvidenceKind } from '../types'

const steps = [
  { label: 'Define the problem', detail: 'What operational pain do you solve?' },
  { label: 'Choose evidence', detail: 'What proves the problem exists?' },
  { label: 'Review matches', detail: 'See accounts and reasoning' },
]

export function DiscoverPage() {
  const [statement, setStatement] = useState(discoveryProblem.statement)
  const [selected, setSelected] = useState<EvidenceKind[]>(['hiring', 'technology', 'change'])
  const [problemChip, setProblemChip] = useState('Manual route planning')
  const [submitting, setSubmitting] = useState(false)

  const toggleEvidence = (id: EvidenceKind) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => setSubmitting(false), 1400)
  }

  return (
    <div className="page page-enter discover-page">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">Problem-first discovery</span>
          <h1>Find companies that need what you sell.</h1>
          <p>
            Describe the operational pain you solve. Nomad translates it into observable
            evidence, finds matching companies, and explains every recommendation.
          </p>
        </div>
        <div className="page-actions">
          <button className="button button-secondary" type="button">
            <Clock3 size={14} /> Run history
          </button>
        </div>
      </header>

      <div className="stepper card" aria-label="Discovery process">
        {steps.map((step, index) => (
          <Step key={step.label} index={index} length={steps.length} active={index === 0} step={step} />
        ))}
      </div>

      <form className="discover-layout" onSubmit={submit}>
        <div className="discover-main">
          <section className="card form-card">
            <div className="numbered-heading">
              <span>01</span>
              <div>
                <h2>Start with the pain, not the industry</h2>
                <p>Use the language your customer would use in an operations meeting.</p>
              </div>
            </div>
            <label className="field-label" htmlFor="problem-statement">
              Problem statement <span>Required</span>
            </label>
            <div className="problem-input-wrap">
              <textarea
                id="problem-statement"
                value={statement}
                onChange={(event) => setStatement(event.target.value)}
              />
              <span className="ai-label">
                <Sparkles size={10} /> AI refined
              </span>
            </div>
            <div className="suggestion-row">
              <span>Common problems</span>
              <div className="chip-row">
                {discoveryProblem.commonProblems.map((problem) => (
                  <button
                    key={problem}
                    type="button"
                    className={`select-chip ${problemChip === problem ? 'chip-selected' : ''}`}
                    onClick={() => {
                      setProblemChip(problem)
                      setStatement(
                        `Teams are losing time and margin to ${problem.toLowerCase()} as delivery volume grows.`,
                      )
                    }}
                  >
                    {problem}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="card form-card">
            <div className="numbered-heading">
              <span>02</span>
              <div>
                <h2>Choose the evidence Nomad should look for</h2>
                <p>Layer several signals to reduce false positives.</p>
              </div>
              <button className="hint-button" type="button" aria-label="Evidence help">
                <CircleHelp size={15} />
              </button>
            </div>
            <div className="evidence-grid">
              {discoveryProblem.evidence.map((option) => {
                const Icon = option.icon
                const active = selected.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`evidence-option ${active ? 'evidence-selected' : ''}`}
                    onClick={() => toggleEvidence(option.id)}
                    aria-pressed={active}
                  >
                    <span className="evidence-icon">
                      <Icon size={16} />
                    </span>
                    <span>
                      <strong>{option.title}</strong>
                      <small>{option.description}</small>
                    </span>
                    <i>{active && <Check size={12} strokeWidth={3} />}</i>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card form-card">
            <div className="numbered-heading">
              <span>03</span>
              <div>
                <h2>Define your market</h2>
                <p>Keep it broad enough for Nomad to find unexpected fits.</p>
              </div>
            </div>
            <div className="form-grid three">
              <label>
                <span className="field-label">Target market</span>
                <div className="input-with-icon">
                  <MapPin size={13} />
                  <select defaultValue={discoveryProblem.market.target}>
                    {discoveryProblem.market.firmographicOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} />
                </div>
              </label>
              <label>
                <span className="field-label">Locations</span>
                <div className="input-with-icon">
                  <MapPin size={13} />
                  <input defaultValue={discoveryProblem.market.locations} />
                </div>
              </label>
              <label>
                <span className="field-label">Company size</span>
                <div className="input-with-icon">
                  <UsersRound size={13} />
                  <select defaultValue={discoveryProblem.market.companySize}>
                    {discoveryProblem.market.sizeOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} />
                </div>
              </label>
            </div>
            <div className="advanced-row">
              <button type="button">
                <Plus size={12} /> Advanced firmographics
              </button>
              <span>Industries, revenue, ownership, and exclusions</span>
            </div>
          </section>

          <div className="discover-submit-row">
            <div>
              <span>
                Estimated reach: <strong>{discoveryProblem.estimatedReach}</strong>
              </span>
            </div>
            <button className="button button-primary discover-button" type="submit" disabled={submitting}>
              {submitting ? <Spinner /> : <Radar size={15} />}
              {submitting ? 'Finding matches…' : 'Discover matching accounts'}
            </button>
          </div>
        </div>

        <aside className="discover-aside">
          <section className="card model-card">
            <span className="model-badge">
              <Sparkles size={11} /> Live discovery model
            </span>
            <h3>What Nomad will look for</h3>
            <p>We turn your problem statement into a chain of observable evidence.</p>
            <div className="logic-chain">
              <div>
                <span>
                  <Target size={14} />
                </span>
                <p>
                  <strong>Operational problem</strong>
                  <small>{discoveryProblem.model.problem}</small>
                </p>
              </div>
              <i />
              <div>
                <span>
                  <Layers size={14} />
                </span>
                <p>
                  <strong>Evidence bundle</strong>
                  <small>{discoveryProblem.model.evidenceBundle}</small>
                </p>
              </div>
              <i />
              <div>
                <span>
                  <Check size={14} />
                </span>
                <p>
                  <strong>Qualified account</strong>
                  <small>{discoveryProblem.model.qualified}</small>
                </p>
              </div>
            </div>
            <div className="model-quality">
              <span>{discoveryProblem.model.precisionLabel}</span>
              <strong>{discoveryProblem.model.precision}</strong>
              <div>
                <i style={{ width: `${discoveryProblem.model.precisionBar}%` }} />
              </div>
              <small>{discoveryProblem.model.precisionNote}</small>
            </div>
          </section>
          <section className="aside-tip">
            <span>
              <Lightbulb size={15} />
            </span>
            <div>
              <strong>Nomad tip</strong>
              <p>{discoveryProblem.tip}</p>
              <button type="button">
                See examples <ChevronDown size={11} />
              </button>
            </div>
          </section>
        </aside>
      </form>
    </div>
  )
}

function Step({
  index,
  length,
  active,
  step,
}: {
  index: number
  length: number
  active: boolean
  step: { label: string; detail: string }
}): ReactElement {
  void length
  return (
    <>
      {index > 0 && <i />}
      <div className={active ? 'step-active' : ''}>
        <span>{index + 1}</span>
        <p>
          <strong>{step.label}</strong>
          <small>{step.detail}</small>
        </p>
      </div>
    </>
  )
}

function Spinner() {
  return (
    <span className="button-spinner" aria-hidden="true" style={{ width: 14, height: 14 }} />
  )
}
