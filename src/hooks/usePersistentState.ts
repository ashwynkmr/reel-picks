import { useEffect, useState } from 'react'

/**
 * useState that survives reloads via localStorage.
 *
 * Stored data is untrusted: it may be from an older version of the app,
 * edited by hand, or unavailable entirely (private browsing, blocked
 * storage). `sanitize` turns whatever was stored into a valid value or
 * returns null to fall back to the default, and every storage call is
 * wrapped so the app works without persistence.
 */
export function usePersistentState<T>(key: string, fallback: T, sanitize: (stored: unknown) => T | null) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return fallback
      return sanitize(JSON.parse(raw)) ?? fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or blocked: keep working in memory only.
    }
  }, [key, value])

  return [value, setValue] as const
}
