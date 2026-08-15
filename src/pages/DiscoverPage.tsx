import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Check, MapPin, Radar, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { postDiscover } from '../api/dashboard'
import { DISCOVER } from '../constants'
import type { DiscoveryRun, DiscoveryStartResponse, DiscoveryStageId } from '../types'

/**
 * Mock completion numbers shown when the backend is unreachable.
 * A real backend streams these via the `prospecting.run.completed`
 * WebSocket event (broadcast_completion in prospecting/tasks.py).
 */
const MOCK_SUMMARY = { discovered: 12, new: 9, duplicates: 3 }

const STAGE_ORDER: DiscoveryStageId[] = DISCOVER.runStages.map((step) => step.stage)

export function DiscoverPage() {
  const [sell, setSell] = useState('')
  const [problem, setProblem] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [run, setRun] = useState<DiscoveryRun | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  const startRun = (keyword: string, place: string, response: DiscoveryStartResponse) => {
    setRun({ runId: response.run_id, keyword, location: place, status: 'running', progress: 0, stage: 'queued' })

    DISCOVER.runStages.forEach((step, index) => {
      const delay = 600 + index * 700
      timers.current.push(
        window.setTimeout(() => {
          setRun((current) => {
            if (!current) return current
            if (index === DISCOVER.runStages.length - 1) {
              return { ...current, status: 'completed', progress: step.progress, stage: step.stage }
            }
            return { ...current, progress: step.progress, stage: step.stage }
          })
        }, delay),
      )
    })
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const keyword = problem.trim()
    const place = location.trim()
    const sellText = sell.trim()

    if (!keyword) {
      setError(DISCOVER.problemRequired)
      return
    }
    if (!place) {
      setError(DISCOVER.locationRequired)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      // The backend optimises long descriptions into clean search keywords, so
      // the optional "what do you sell" answer can safely enrich the keyword.
      const query = sellText ? `${keyword} — ${sellText}` : keyword
      const response = await postDiscover({ keyword: query, location: place })
      startRun(keyword, place, response)
    } catch {
      setError(DISCOVER.failedDetail)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setRun(null)
  }

  return (
    <div className="page page-enter">
      <header className="page-header">
        <div className="page-heading-copy">
          <span className="page-eyebrow">{DISCOVER.eyebrow}</span>
          <h1>{DISCOVER.title}</h1>
          <p>{DISCOVER.description}</p>
        </div>
      </header>

      {run ? (
        <RunPanel run={run} onReset={reset} />
      ) : (
        <form className="discovery-layout" onSubmit={submit} noValidate>
          <section className="card discovery-card">
            <h2>Start a discovery</h2>
            <p>{DISCOVER.intro}</p>

            {error && <div className="discovery-error">{error}</div>}

            <div className="discovery-field">
              <label htmlFor="discovery-sell">
                {DISCOVER.sellLabel} <span>{DISCOVER.sellOptional}</span>
              </label>
              <input
                id="discovery-sell"
                className="discovery-input"
                value={sell}
                onChange={(event) => setSell(event.target.value)}
                placeholder={DISCOVER.sellPlaceholder}
              />
              <span className="discovery-hint">{DISCOVER.sellHint}</span>
              <div className="discovery-examples">
                {DISCOVER.sellExamples.map((example) => (
                  <button key={example} type="button" onClick={() => setSell(example)}>
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="discovery-field">
              <label htmlFor="discovery-problem">
                {DISCOVER.problemLabel} <span>(required)</span>
              </label>
              <textarea
                id="discovery-problem"
                className="discovery-input"
                value={problem}
                onChange={(event) => setProblem(event.target.value)}
                placeholder={DISCOVER.problemPlaceholder}
              />
              <span className="discovery-hint">A short sentence in plain words works best.</span>
              <div className="discovery-examples">
                {DISCOVER.problemExamples.map((example) => (
                  <button key={example} type="button" onClick={() => setProblem(example)}>
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="discovery-field">
              <label htmlFor="discovery-location">
                {DISCOVER.locationLabel} <span>(required)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin
                  size={16}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-2)' }}
                />
                <input
                  id="discovery-location"
                  className="discovery-input"
                  style={{ paddingLeft: 40 }}
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder={DISCOVER.locationPlaceholder}
                />
              </div>
              <div className="discovery-examples">
                {DISCOVER.locationExamples.map((example) => (
                  <button key={example} type="button" onClick={() => setLocation(example)}>
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button className="button button-primary discovery-submit" type="submit" disabled={submitting}>
              {submitting ? <span className="button-spinner" aria-hidden="true" /> : <Radar size={16} />}
              {submitting ? DISCOVER.submittingLabel : DISCOVER.submitLabel}
            </button>
          </section>

          <aside className="card discovery-steps">
            <h3>
              <Sparkles size={15} style={{ verticalAlign: -2, marginRight: 6, color: 'var(--lime-dark)' }} />
              {DISCOVER.howTitle}
            </h3>
            <ol>
              {DISCOVER.howSteps.map((step) => (
                <li key={step.title}>
                  <div>
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </form>
      )}
    </div>
  )
}

function RunPanel({ run, onReset }: { run: DiscoveryRun; onReset: () => void }) {
  const completed = run.status === 'completed'
  const failed = run.status === 'failed'
  const currentStageIndex = Math.max(0, STAGE_ORDER.indexOf(run.stage))
  const currentStep = DISCOVER.runStages[currentStageIndex]

  return (
    <section className="card discovery-run">
      <div className="discovery-run-head">
        <strong>{completed ? DISCOVER.completeTitle : failed ? DISCOVER.failedTitle : DISCOVER.runStarted}</strong>
        <span className="discovery-run-id">run #{run.runId.slice(0, 8)}</span>
      </div>

      <p className="discovery-run-context">
        {DISCOVER.runFor} <strong>“{run.keyword}”</strong> near <strong>“{run.location}”</strong>.
      </p>

      {!completed && !failed && (
        <>
          <div className="discovery-progress">
            <span style={{ width: `${run.progress}%` }} />
          </div>
          <div className="discovery-progress-label">
            <span>
              {DISCOVER.runStagePrefix} {Math.min(currentStageIndex + 1, STAGE_ORDER.length)} of {STAGE_ORDER.length} —{' '}
              {currentStep.message}
            </span>
            <span>{run.progress}%</span>
          </div>
        </>
      )}

      <ul className="discovery-stages">
        {DISCOVER.runStages.map((step, index) => {
          const state = index < currentStageIndex || completed ? 'done' : index === currentStageIndex && !completed ? 'active' : ''
          return (
            <li key={step.stage} className={state}>
              <i>{state === 'done' && <Check size={12} strokeWidth={3} />}</i>
              {step.message}
            </li>
          )
        })}
      </ul>

      {completed && (
        <>
          <div className="discovery-summary">
            <div>
              <strong>{MOCK_SUMMARY.discovered}</strong>
              <small>{DISCOVER.foundLabel}</small>
            </div>
            <div>
              <strong>{MOCK_SUMMARY.new}</strong>
              <small>{DISCOVER.newLabel}</small>
            </div>
            <div>
              <strong>{MOCK_SUMMARY.duplicates}</strong>
              <small>{DISCOVER.duplicateLabel}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/leads" className="button button-primary">
              {DISCOVER.viewLeads} <ArrowRight size={15} />
            </Link>
            <button className="button button-secondary" type="button" onClick={onReset}>
              {DISCOVER.startAnother}
            </button>
          </div>
        </>
      )}

      {failed && (
        <button className="button button-secondary" type="button" onClick={onReset}>
          {DISCOVER.tryAgain}
        </button>
      )}
    </section>
  )
}
