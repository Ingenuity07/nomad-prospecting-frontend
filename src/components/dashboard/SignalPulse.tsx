import { useId } from 'react'
import { TrendingUp } from 'lucide-react'
import { OVERVIEW } from '../../constants'
import type { SignalPulse as SignalPulseData } from '../../types'

const VIEWBOX = { width: 420, height: 180 }
/** Vertical padding so the line stays inside the chart. */
const PAD = 28
const Y_MAX = VIEWBOX.height - PAD // y for the minimum value (bottom)
const Y_MIN = PAD // y for the maximum value (top)

interface Point {
  x: number
  y: number
}

function toPoints(values: number[]): Point[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values.map((value, index) => ({
    x: values.length === 1 ? 0 : (index / (values.length - 1)) * VIEWBOX.width,
    y: Y_MAX - ((value - min) / span) * (Y_MAX - Y_MIN),
  }))
}

/** Catmull-Rom → cubic Bézier smoothing through every point. */
function smoothPath(points: Point[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M${points[0].x},${points[0].y}`

  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}

function areaPath(line: string, points: Point[]): string {
  if (points.length === 0) return ''
  const last = points[points.length - 1]
  return `${line} L${last.x},${VIEWBOX.height} L0,${VIEWBOX.height} Z`
}

interface SignalPulseProps {
  data: SignalPulseData
}

export function SignalPulse({ data }: SignalPulseProps) {
  const gradientId = useId()
  const points = toPoints(data.values)
  const line = smoothPath(points)
  const lastPoint = points[points.length - 1]

  return (
    <article className="card signal-pulse-card">
      <div className="card-heading-row compact">
        <div>
          <span className="eyebrow-label">{OVERVIEW.pulseEyebrow}</span>
          <h2>{OVERVIEW.pulseTitle}</h2>
        </div>
        <span className="trend-chip">
          <TrendingUp size={13} /> {data.changePct}%
        </span>
      </div>
      <p className="muted-copy">{data.note}</p>
      <div
        className="line-chart"
        role="img"
        aria-label={`Rising discovery signals from ${data.values[0]} to ${data.total} over ${data.weeks.length} weeks`}
      >
        <div className="chart-grid-lines">
          <i />
          <i />
          <i />
        </div>
        <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b9f34a" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#b9f34a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="chart-area" d={areaPath(line, points)} style={{ fill: `url(#${gradientId})` }} />
          <path className="chart-line" d={line} />
          {lastPoint && <circle className="chart-dot" cx={lastPoint.x} cy={lastPoint.y} r={5} />}
        </svg>
      </div>
      <div className="chart-labels">
        {data.weeks.map((week) => (
          <span key={week}>{week}</span>
        ))}
      </div>
      <div className="chart-footer">
        <div>
          <span className="legend-dot" /> {OVERVIEW.pulseThisWeek}
        </div>
        <strong>{data.total} new signals</strong>
      </div>
    </article>
  )
}
