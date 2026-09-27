import { useCallback, useMemo, useState } from 'react'
import { PLATFORMS, type Movie, type PlatformId } from '../domain/catalogue.ts'
import { filterMovies, pickMovie, rememberPick, suggestFix, type GenreFilter } from '../domain/picker.ts'
import { usePersistentState } from './usePersistentState.ts'

const ALL_PLATFORM_IDS = PLATFORMS.map((p) => p.id)
const PLATFORMS_STORAGE_KEY = 'reel-picks:platforms:v1'

/** Keeps only known platform ids; an empty or invalid list falls back to all platforms. */
function sanitizePlatforms(stored: unknown): PlatformId[] | null {
  if (!Array.isArray(stored)) return null
  const known = ALL_PLATFORM_IDS.filter((id) => stored.includes(id))
  return known.length > 0 ? known : null
}

/**
 * All picker state in one place: filters, the current pick and the
 * no-repeat history. Components stay presentational and only call the
 * actions returned here.
 *
 * Platforms are remembered between visits (you rarely change your
 * subscriptions); genre is not (mood changes every night).
 */
export function usePicker(movies: Movie[], random: () => number = Math.random) {
  const [platforms, setPlatforms] = usePersistentState<PlatformId[]>(
    PLATFORMS_STORAGE_KEY,
    ALL_PLATFORM_IDS,
    sanitizePlatforms,
  )
  const [genre, setGenre] = useState<GenreFilter>('any')
  const [pick, setPick] = useState<Movie | null>(null)
  const [recentIds, setRecentIds] = useState<string[]>([])
  /** How many picks this session: the "take" number on the clapperboard. */
  const [take, setTake] = useState(0)

  const candidates = useMemo(() => filterMovies(movies, platforms, genre), [movies, platforms, genre])
  const fix = useMemo(
    () => (candidates.length === 0 ? suggestFix(movies, platforms, genre) : null),
    [candidates.length, movies, platforms, genre],
  )

  // Changing the question clears the answer: a card picked under the old
  // filters would otherwise sit on screen while the lever shows new counts.

  /** Toggles a platform, but never lets the last one be switched off. */
  const togglePlatform = useCallback(
    (id: PlatformId) => {
      setPick(null)
      setPlatforms((current) => {
        if (!current.includes(id)) return ALL_PLATFORM_IDS.filter((p) => p === id || current.includes(p))
        return current.length > 1 ? current.filter((p) => p !== id) : current
      })
    },
    [setPlatforms],
  )

  const addPlatform = useCallback(
    (id: PlatformId) => {
      setPick(null)
      setPlatforms((current) => ALL_PLATFORM_IDS.filter((p) => p === id || current.includes(p)))
    },
    [setPlatforms],
  )

  const chooseGenre = useCallback((id: GenreFilter) => {
    setPick(null)
    setGenre(id)
  }, [])

  const spin = useCallback(() => {
    const next = pickMovie(candidates, recentIds, random)
    if (!next) return
    setPick(next)
    setTake((t) => t + 1)
    setRecentIds((ids) => rememberPick(ids, next.id))
  }, [candidates, recentIds, random])

  const closePick = useCallback(() => setPick(null), [])

  return {
    platforms,
    genre,
    candidates,
    pick,
    take,
    fix,
    togglePlatform,
    addPlatform,
    setGenre: chooseGenre,
    spin,
    closePick,
  }
}
