import { accountDetails, buildFallbackAccountDetail } from './mockData'
import type { AccountDetail } from '../types'

/** Synchronous lookup used by the detail route. Swap for an API call when a backend exists. */
export function getAccountById(id: string): AccountDetail | undefined {
  return accountDetails[id] ?? buildFallbackAccountDetail(id)
}
