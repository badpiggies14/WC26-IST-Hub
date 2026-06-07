import type { ApiMode, CachedResult } from '../types/worldcup'
import { cachePayload, readCachedPayload } from '../lib/storage'

export const API_BASE_URL =
  (import.meta.env.VITE_WC_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || 'https://worldcup26.ir'

const API_TOKEN = import.meta.env.VITE_WC_API_TOKEN as string | undefined
const DEFAULT_TIMEOUT_MS = 10000

export class ApiClientError extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

type ApiFetchOptions = RequestInit & {
  timeoutMs?: number
  retries?: number
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function shouldRetry(method: string, error: ApiClientError, attempt: number, maxRetries: number) {
  if (attempt >= maxRetries) return false
  if (method !== 'GET') return false
  if (!error.status) return error.code !== 'ABORTED'
  return error.status === 429 || error.status >= 500
}

function createSignal(timeoutMs: number, outerSignal?: AbortSignal) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort('timeout'), timeoutMs)

  if (outerSignal) {
    if (outerSignal.aborted) controller.abort(outerSignal.reason)
    else outerSignal.addEventListener('abort', () => controller.abort(outerSignal.reason), { once: true })
  }

  return { signal: controller.signal, clear: () => window.clearTimeout(timeout) }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const method = String(options.method || 'GET').toUpperCase()
  const retries = options.retries ?? (method === 'GET' ? 2 : 0)
  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')
  if (API_TOKEN) headers.set('Authorization', `Bearer ${API_TOKEN}`)

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const { signal, clear } = createSignal(options.timeoutMs || DEFAULT_TIMEOUT_MS, options.signal || undefined)

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        method,
        headers,
        signal
      })

      clear()

      if (!response.ok) {
        throw new ApiClientError(
          response.status === 401
            ? 'API authorization required.'
            : response.status === 429
              ? 'API rate limit reached. Please retry shortly.'
              : `API request failed with ${response.status}.`,
          response.status
        )
      }

      return (await response.json()) as T
    } catch (error) {
      clear()
      const apiError =
        error instanceof ApiClientError
          ? error
          : new ApiClientError(
              error instanceof DOMException && error.name === 'AbortError'
                ? 'API request timed out or was cancelled.'
                : error instanceof Error
                  ? error.message
                  : 'Unknown API error.',
              undefined,
              error instanceof DOMException && error.name === 'AbortError' ? 'ABORTED' : 'NETWORK'
            )

      if (shouldRetry(method, apiError, attempt, retries)) {
        await sleep(400 * 2 ** attempt)
        continue
      }

      throw apiError
    }
  }

  throw new ApiClientError('API request failed.')
}

export async function getWithCache<T>(
  path: string,
  cacheKey: string,
  fallback: T,
  options: ApiFetchOptions = {}
): Promise<CachedResult<T>> {
  try {
    const data = await apiFetch<T>(path, options)
    cachePayload(cacheKey, data)
    return { data, status: 'live', timestamp: Date.now() }
  } catch (error) {
    const apiError = error instanceof ApiClientError ? error : new ApiClientError('API request failed.')
    const cached = readCachedPayload<T>(cacheKey, fallback)
    const status: ApiMode =
      apiError.status === 401 ? 'auth' : cached ? 'cached' : apiError.code === 'NETWORK' ? 'offline' : 'error'

    if (cached) {
      return {
        ...cached,
        status,
        error: apiError.message
      }
    }

    return {
      data: fallback,
      status,
      error: apiError.message
    }
  }
}
