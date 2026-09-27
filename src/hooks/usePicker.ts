import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PLATFORMS, type Movie, type PlatformId } from '../domain/catalogue.ts'
import { buildReel, filterMovies, pickMovie, rememberPick, suggestFix, type GenreFilter } from '../domain/picker.ts'
import { usePersistentState } from './usePersistentState.ts'

const ALL_PLATFORM_IDS = PLATFORMS.map((p) => p.id)
const PLATFORMS_STORAGE_KEY = 'reel-picks:platforms:v1'

/**
 * The reveal sequence after the lever is pulled:
 *   idle -> rolling (reel spins) -> slating (clapperboard snaps) -> showing (card)
 * The pick is decided the moment the lever is pulled; the phases are
 * presentation only, which keeps the picking logic simple and testable.
 */
export type Phase = 'idle' | 'rolling' | 'slating' | 'showing'

export interface RevealTiming {
  rollMs: number
  slateMs: number
}

/**
 * Timing budget (ADR 0010): long enough to build anticipation, short enough
 * that the whole pull-to-card moment stays around 3 seconds, well inside the
 * 10-second time-to-decision goal. Always skippable.
 */
export const DEFAULT_TIMING: RevealTiming = { rollMs: 2400, slateMs: 650 }

/** No animation: the card appears as soon as the lever is pulled. */
export const INSTANT: RevealTiming = { rollMs: 0, slateMs: 0 }

/** Keeps only known platform ids; an empty or invalid list falls back to all platforms. */
function sanitizePlatforms(stored: unknown): PlatformId[] | null {
  if (!Array.isArray(stored)) return null
  const known = ALL_PLATFORM_IDS.filter((id) => stored.includes(id))
  return known.length > 0 ? known : null
}

interface Options {
  random?: () => number
  timing?: RevealTiming
}

/**
 * All picker state in one place: filters, the current pick, the no-repeat
 * history and the reveal sequence. Components stay presentational and only
 * call the actions returned here.
 *
 * Platforms are remembered between visits (you rarely change your
 * subscriptions); genre is not (mood changes every night).
 */
export function usePicker(movies: Movie[], { random = Math.random, timing = DEFAULT_TIMING }: Options = {}) {
  const [platforms, setPlatforms] = usePersistentState<PlatformId[]>(
    PLATFORMS_STORAGE_KEY,
    ALL_PLATFORM_IDS,
    sanitizePlatforms,
  )
  const [genre, setGenre] = useState<GenreFilter>('any')
  const [pick, setPick] = useState<Movie | null>(null)
  const [reel, setReel] = useState<Movie[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [recentIds, setRecentIds] = useState<string[]>([])
  /** How many picks this session: the "take" number on the clapperboard. */
  const [take, setTake] = useState(0)

  const candidates = useMemo(() => filterMovies(movies, platforms, genre), [movies, platforms, genre])
  const fix = useMemo(
    () => (candidates.length === 0 ? suggestFix(movies, platforms, genre) : null),
    [candidates.length, movies, platforms, genre],
  )

  // Pending phase changes, so any interruption (skip, Esc, a filter change,
  // unmount) can cancel them and never leave a stale timer running.
  const timers = useRef<number[]>([])
  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  /** Empties the screen and cancels any reveal in progress. */
  const clearScreen = useCallback(() => {
    clearTimers()
    setPick(null)
    setPhase('idle')
  }, [clearTimers])

  // Changing the question clears the answer: a card picked under the old
  // filters would otherwise sit on screen while the lever shows new counts.

  /** Toggles a platform, but never lets the last one be switched off. */
  const togglePlatform = useCallback(
    (id: PlatformId) => {
      clearScreen()
      setPlatforms((current) => {
        if (!current.includes(id)) return ALL_PLATFORM_IDS.filter((p) => p === id || current.includes(p))
        return current.length > 1 ? current.filter((p) => p !== id) : current
      })
    },
    [clearScreen, setPlatforms],
  )

  const addPlatform = useCallback(
    (id: PlatformId) => {
      clearScreen()
      setPlatforms((current) => ALL_PLATFORM_IDS.filter((p) => p === id || current.includes(p)))
    },
    [clearScreen, setPlatforms],
  )

  const chooseGenre = useCallback(
    (id: GenreFilter) => {
      clearScreen()
      setGenre(id)
    },
    [clearScreen],
  )

  /** Pulls the lever: decides the pick now, then plays the reveal. */
  const spin = useCallback(() => {
    const next = pickMovie(candidates, recentIds, random)
    if (!next) return
    clearTimers()
    setPick(next)
    setReel(buildReel(candidates, next, undefined, random))
    setTake((t) => t + 1)
    setRecentIds((ids) => rememberPick(ids, next.id))

    const { rollMs, slateMs } = timing
    if (rollMs + slateMs === 0) {
      setPhase('showing')
      return
    }
    setPhase(rollMs > 0 ? 'rolling' : 'slating')
    timers.current.push(window.setTimeout(() => setPhase('slating'), rollMs))
    timers.current.push(window.setTimeout(() => setPhase('showing'), rollMs + slateMs))
  }, [candidates, recentIds, random, timing, clearTimers])

  /** Jumps straight to the result. Impatience is a valid choice. */
  const skip = useCallback(() => {
    clearTimers()
    setPhase((p) => (p === 'rolling' || p === 'slating' ? 'showing' : p))
  }, [clearTimers])

  return {
    platforms,
    genre,
    candidates,
    pick,
    reel,
    phase,
    take,
    fix,
    togglePlatform,
    addPlatform,
    setGenre: chooseGenre,
    spin,
    skip,
    closePick: clearScreen,
  }
}
