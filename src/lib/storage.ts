import type { CachedResult } from '../types/worldcup'

export const CACHE_KEYS = {
  matches: 'wc2026_cache_matches',
  teams: 'wc2026_cache_teams',
  stadiums: 'wc2026_cache_stadiums',
  groups: 'wc2026_cache_groups',
  timestamp: 'wc2026_cache_timestamp',
  favorites: 'wc2026_favorites',
  reminders: 'wc2026_reminders'
} as const

function canUseStorage() {
  try {
    const key = '__wc2026_storage_test__'
    window.localStorage.setItem(key, key)
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !canUseStorage()) return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined' || !canUseStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota or privacy-mode failures should never break the UI.
  }
}

export function removeStorage(key: string) {
  if (typeof window === 'undefined' || !canUseStorage()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore unavailable storage.
  }
}

export function cachePayload<T>(key: string, data: T) {
  writeStorage(key, data)
  writeStorage(CACHE_KEYS.timestamp, Date.now())
}

export function readCachedPayload<T>(key: string, fallback: T): CachedResult<T> | null {
  const data = readStorage<T | null>(key, null)
  if (!data) return null

  return {
    data,
    status: 'cached',
    timestamp: readStorage<number | undefined>(CACHE_KEYS.timestamp, undefined)
  }
}

export function formatCacheTimestamp(timestamp?: number) {
  if (!timestamp) return 'earlier'

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short'
  }).format(new Date(timestamp))
}
