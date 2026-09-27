/**
 * Domain model for the Reel Picks catalogue.
 *
 * The lists below are the single source of truth for which platforms and
 * genres exist. Both the UI filters and the catalogue validator read from
 * here, so adding a platform is a one-line change plus data.
 *
 * Note: this file must stay free of enums/namespaces (erasable TypeScript
 * only) because the validation script runs it directly with Node's
 * built-in type stripping, without a build step.
 */

export const PLATFORMS = [
  { id: 'netflix', label: 'Netflix' },
  { id: 'prime', label: 'Prime Video' },
  { id: 'max', label: 'HBO Max' },
  { id: 'disney', label: 'Disney+' },
  { id: 'hulu', label: 'Hulu' },
  { id: 'appletv', label: 'Apple TV' },
] as const

export const GENRES = [
  { id: 'action', label: 'Action' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'drama', label: 'Drama' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'scifi', label: 'Sci-Fi' },
] as const

export type PlatformId = (typeof PLATFORMS)[number]['id']
export type GenreId = (typeof GENRES)[number]['id']

/**
 * "Classics" is deliberately NOT a genre. A classic is a quality/era signal
 * (IMDb Top 250 calibre) that sits on top of a normal genre, so a film like
 * The Matrix shows up under both Sci-Fi and Classics. Modelling it as a
 * boolean keeps genre filtering honest. See docs/decisions/0004.
 */
export interface Movie {
  /** Stable slug: kebab-case title + release year, e.g. "the-matrix-1999". */
  id: string
  title: string
  year: number
  runtimeMinutes: number
  /** One or two genres, most dominant first. */
  genres: GenreId[]
  classic: boolean
  /** US platforms where the title streams with a subscription (not rent/buy). */
  platforms: PlatformId[]
  /** IMDb user rating out of 10, captured at the catalogue's `asOf` date. */
  imdbRating: number
  /** Spoiler-free, 280 characters max. */
  synopsis: string
  /**
   * Optional verified YouTube video id. When absent the UI links to a
   * YouTube search for the official trailer instead (see docs/decisions/0003).
   */
  youtubeId?: string
  /** Optional IMDb title id (tt1234567). When absent the UI links to IMDb search. */
  imdbId?: string
}

export interface Catalogue {
  /** ISO date the availability and ratings snapshot was taken. */
  asOf: string
  region: 'US'
  movies: Movie[]
}

export const SYNOPSIS_MAX_LENGTH = 280
