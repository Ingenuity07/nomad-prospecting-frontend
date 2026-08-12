export interface ChartPoint {
  x: number
  y: number
}

/**
 * Map a series of values into [0, width] × [pad, height - pad] coordinates,
 * normalized against the overall min/max so multiple series share one scale.
 */
export function toChartPoints(
  values: number[],
  width: number,
  height: number,
  pad: number,
  globalMin?: number,
  globalMax?: number,
): ChartPoint[] {
  const min = globalMin ?? Math.min(...values)
  const max = globalMax ?? Math.max(...values)
  const span = max - min || 1
  const yMax = height - pad
  const yMin = pad
  return values.map((value, index) => ({
    x: values.length === 1 ? 0 : (index / (values.length - 1)) * width,
    y: yMax - ((value - min) / span) * (yMax - yMin),
  }))
}

/** Catmull-Rom → cubic Bézier smoothing through every point. */
export function smoothPath(points: ChartPoint[]): string {
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

/** Closed path for a filled area under a line. */
export function areaPath(line: string, points: ChartPoint[], height: number): string {
  if (points.length === 0) return ''
  const last = points[points.length - 1]
  return `${line} L${last.x},${height} L0,${height} Z`
}
