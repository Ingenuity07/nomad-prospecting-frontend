import type { DiscoveryRun } from '../types/prospecting'

const titleCase = (value: string) => value.replace(/\b\w/g, (letter) => letter.toUpperCase())

export function conciseCampaignName(run: DiscoveryRun | null) {
  if (!run) return 'Campaign'
  const target = run.prospecting_request?.target?.trim() || ''
  const storedName = run.campaign?.name?.trim() || ''
  const source = target || storedName || run.keyword || 'Campaign'

  if (/apollo/i.test(source)) return /sales/i.test(source) ? 'Apollo Sales Prospects' : 'Apollo Prospects'
  if (/route (?:planning|optimization|optimisation)/i.test(source)) return 'Route Planning Prospects'

  const cleaned = source
    .replace(/^(?:i|we)\s+(?:want|need)\s+(?:to\s+)?(?:find|get|build)?\s*/i, '')
    .replace(/^(?:find|get|show|discover|search for)\s+/i, '')
    .split(/\s+(?:who|that|which|because|where)\s+/i)[0]
    .replace(/\s+/g, ' ')
    .trim()
  const words = cleaned.split(' ').filter(Boolean)
  return titleCase((words.length > 5 ? words.slice(0, 5).join(' ') : cleaned) || 'Campaign')
}

