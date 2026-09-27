import { describe, expect, it } from 'vitest'
import type { Movie } from './catalogue.ts'
import { buildReel, filterMovies, pickMovie, rememberPick, RECENT_PICKS_TO_AVOID, suggestFix } from './picker.ts'

const movie = (id: string, overrides: Partial<Movie> = {}): Movie => ({
  id,
  title: id,
  year: 2000,
  runtimeMinutes: 100,
  genres: ['drama'],
  classic: false,
  platforms: ['netflix'],
  imdbRating: 7,
  synopsis: 'A synopsis long enough to pass validation rules in the catalogue.',
  ...overrides,
})

const matrix = movie('matrix', { genres: ['scifi', 'action'], classic: true, platforms: ['max'] })
const extraction = movie('extraction', { genres: ['action'], platforms: ['netflix'] })
const alien = movie('alien', { genres: ['scifi', 'thriller'], classic: true, platforms: ['hulu', 'disney'] })
const barbie = movie('barbie', { genres: ['comedy'], platforms: ['max'] })
const all = [matrix, extraction, alien, barbie]

/** A fake Math.random that always returns the given value. */
const fixed = (value: number) => () => value

describe('filterMovies', () => {
  it('keeps films on any selected platform', () => {
    expect(filterMovies(all, ['netflix', 'hulu'], 'any')).toEqual([extraction, alien])
  })

  it('matches either of a film’s genres', () => {
    expect(filterMovies(all, ['max', 'netflix', 'hulu'], 'action')).toEqual([matrix, extraction])
  })

  it('treats classics as a flag, independent of genre', () => {
    expect(filterMovies(all, ['max', 'netflix', 'hulu'], 'classics')).toEqual([matrix, alien])
  })

  it('returns nothing when no platform is selected', () => {
    expect(filterMovies(all, [], 'any')).toEqual([])
  })
})

describe('pickMovie', () => {
  it('returns null for an empty pool', () => {
    expect(pickMovie([], [])).toBeNull()
  })

  it('uses the random source to choose', () => {
    expect(pickMovie(all, [], fixed(0))).toBe(matrix)
    expect(pickMovie(all, [], fixed(0.99))).toBe(barbie)
  })

  it('skips recently picked films while others remain', () => {
    expect(pickMovie(all, ['matrix', 'extraction'], fixed(0))).toBe(alien)
  })

  it('never repeats the last pick when every film is recent', () => {
    const pool = [matrix, extraction]
    for (const r of [0, 0.5, 0.99]) {
      expect(pickMovie(pool, ['extraction', 'matrix'], fixed(r))).toBe(extraction)
    }
  })

  it('allows a repeat when only one film matches', () => {
    expect(pickMovie([matrix], ['matrix'], fixed(0))).toBe(matrix)
  })

  it('only looks back a limited number of picks', () => {
    const older = Array.from({ length: RECENT_PICKS_TO_AVOID }, (_, i) => `other-${i}`)
    expect(pickMovie([matrix], ['matrix', ...older], fixed(0))).toBe(matrix)
  })
})

describe('rememberPick', () => {
  it('keeps a bounded history, newest last', () => {
    let history: string[] = []
    for (let i = 0; i < 8; i++) history = rememberPick(history, `m${i}`)
    expect(history).toEqual(['m3', 'm4', 'm5', 'm6', 'm7'])
  })
})

describe('suggestFix', () => {
  it('suggests platforms that have the genre, most films first', () => {
    const fix = suggestFix(all, ['netflix'], 'classics')
    expect(fix.addPlatforms).toEqual(['max', 'disney', 'hulu'])
  })

  it('suggests "any genre" when the current platforms have other films', () => {
    expect(suggestFix(all, ['netflix'], 'classics').tryAnyGenre).toBe(true)
    expect(suggestFix(all, ['appletv'], 'classics').tryAnyGenre).toBe(false)
  })
})

describe('buildReel', () => {
  it('ends on the pick and has the requested length', () => {
    const reel = buildReel(all, alien, 10, fixed(0))
    expect(reel).toHaveLength(10)
    expect(reel.at(-1)).toBe(alien)
  })

  it('never shows the same film in two neighbouring frames', () => {
    let n = 0
    const cycling = () => [0, 0.3, 0.6, 0.9][n++ % 4]
    const reel = buildReel(all, matrix, 30, cycling)
    for (let i = 1; i < reel.length; i++) expect(reel[i].id).not.toBe(reel[i - 1].id)
  })

  it('works with a single-film pool', () => {
    expect(buildReel([matrix], matrix, 4)).toEqual([matrix, matrix, matrix, matrix])
  })
})
