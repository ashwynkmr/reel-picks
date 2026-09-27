import { GENRES, PLATFORMS, type GenreId, type Movie, type PlatformId } from './catalogue.ts'

/**
 * Pure picking logic, kept free of React so it can be unit-tested and
 * reused unchanged when the spin animation arrives in Phase 3.
 */

/** What the genre row can be set to: a real genre, the Classics shelf, or anything. */
export type GenreFilter = GenreId | 'classics' | 'any'

export const GENRE_FILTERS: { id: GenreFilter; label: string }[] = [
  { id: 'any', label: 'Any genre' },
  ...GENRES,
  { id: 'classics', label: 'Classics' },
]

/**
 * How many recent picks to hold back. Five is enough that "spin again"
 * feels fresh for a whole evening, while small enough that it never
 * starves a thin filter combination (see ADR 0006).
 */
export const RECENT_PICKS_TO_AVOID = 5

export function matchesGenre(movie: Movie, genre: GenreFilter): boolean {
  if (genre === 'any') return true
  // Classics is a flag, not a genre (ADR 0004).
  if (genre === 'classics') return movie.classic
  return movie.genres.includes(genre)
}

/** Films on ANY of the selected platforms that match the genre filter. */
export function filterMovies(movies: Movie[], platforms: PlatformId[], genre: GenreFilter): Movie[] {
  const selected = new Set(platforms)
  return movies.filter((m) => m.platforms.some((p) => selected.has(p)) && matchesGenre(m, genre))
}

/**
 * Picks one film at random, avoiding recent picks.
 *
 * True randomness repeats itself often enough that people read it as
 * "broken" (the same complaint that pushed music apps to make shuffle less
 * random). So we exclude the last few picks when we can, and, if the pool
 * is too small for that, at least never show the same film twice in a row.
 *
 * @param recentIds most recent pick last
 * @param random injectable for deterministic tests
 */
export function pickMovie(candidates: Movie[], recentIds: string[], random: () => number = Math.random): Movie | null {
  if (candidates.length === 0) return null

  const recentWindow = new Set(recentIds.slice(-RECENT_PICKS_TO_AVOID))
  let pool = candidates.filter((m) => !recentWindow.has(m.id))

  if (pool.length === 0) {
    const lastId = recentIds.at(-1)
    pool = candidates.length > 1 ? candidates.filter((m) => m.id !== lastId) : candidates
  }

  return pool[Math.floor(random() * pool.length)]
}

/** Appends a pick to the history, keeping it bounded. */
export function rememberPick(recentIds: string[], id: string): string[] {
  return [...recentIds, id].slice(-RECENT_PICKS_TO_AVOID)
}

export interface EmptyStateFix {
  /** Unselected platforms that do have films for this genre, most films first. */
  addPlatforms: PlatformId[]
  /** Whether switching to "Any genre" would produce results on the current platforms. */
  tryAnyGenre: boolean
}

/**
 * When a filter combination is empty, work out the smallest change that
 * fixes it, so the empty state can offer a one-tap fix instead of a dead
 * end (ADR 0007). Some gaps are structural: Netflix and Apple TV own
 * almost no classics, so the useful answer is "add HBO Max", not "sorry".
 */
export function suggestFix(movies: Movie[], platforms: PlatformId[], genre: GenreFilter): EmptyStateFix {
  const selected = new Set(platforms)
  const counts = PLATFORMS.filter((p) => !selected.has(p.id))
    .map((p) => ({ id: p.id, count: filterMovies(movies, [p.id], genre).length }))
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count)

  return {
    addPlatforms: counts.map((p) => p.id),
    tryAnyGenre: genre !== 'any' && filterMovies(movies, platforms, 'any').length > 0,
  }
}

export function platformLabel(id: PlatformId): string {
  return PLATFORMS.find((p) => p.id === id)?.label ?? id
}

export function genreLabel(id: GenreFilter): string {
  return GENRE_FILTERS.find((g) => g.id === id)?.label ?? id
}

/** How many frames spin past before the pick lands. Enough to feel like a spin at ~2.4 s. */
export const REEL_LENGTH = 16

/**
 * Builds the strip of frames the reel spins through: random films from the
 * current pool, ending on the pick. Frames next to each other are never the
 * same film (when the pool allows), so the blur reads as motion rather than
 * a stutter. The pick is always the last frame.
 */
export function buildReel(
  candidates: Movie[],
  pick: Movie,
  length: number = REEL_LENGTH,
  random: () => number = Math.random,
): Movie[] {
  const frames: Movie[] = []
  for (let i = 0; i < length - 1; i++) {
    const previous = frames.at(-1)
    const pool = candidates.length > 1 ? candidates.filter((m) => m.id !== previous?.id) : candidates
    frames.push(pool[Math.floor(random() * pool.length)])
  }
  // Don't let the frame right before the pick be the pick itself.
  if (frames.at(-1)?.id === pick.id && candidates.length > 1) {
    frames[frames.length - 1] = candidates.find((m) => m.id !== pick.id) ?? pick
  }
  frames.push(pick)
  return frames
}
