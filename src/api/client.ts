import { API } from '../constants'

/**
 * Thin typed fetch wrapper for the backend API.
 *
 * - Base URL and timeout come from src/constants (env-overridable).
 * - Throws on network errors / non-2xx / timeout; callers decide how to
 *   handle failure (typically by falling back to mock data).
 */
export async function apiFetch<T>(path: string): Promise<T> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), API.timeoutMs)

  try {
    const response = await fetch(`${API.baseUrl}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  } finally {
    window.clearTimeout(timer)
  }
}
