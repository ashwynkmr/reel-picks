import { describe, expect, it } from 'vitest'
import catalogueJson from '../data/catalogue.json'
import type { Catalogue, Movie } from './catalogue.ts'
import { coverageMatrix, validateCatalogue } from './validateCatalogue.ts'

const validMovie: Movie = {
  id: 'the-matrix-1999',
  title: 'The Matrix',
  year: 1999,
  runtimeMinutes: 136,
  genres: ['scifi', 'action'],
  classic: true,
  platforms: ['max'],
  imdbRating: 8.7,
  synopsis: 'A hacker learns the world he lives in is a simulation and joins a rebellion.',
}

const catalogueOf = (...movies: Movie[]): Catalogue => ({ asOf: '2026-09-27', region: 'US', movies })

describe('validateCatalogue', () => {
  it('accepts a well-formed movie', () => {
    expect(validateCatalogue(catalogueOf(validMovie))).toEqual([])
  })

  it('accepts the shipped catalogue', () => {
    expect(validateCatalogue(catalogueJson as Catalogue)).toEqual([])
  })

  it('flags duplicate ids', () => {
    const problems = validateCatalogue(catalogueOf(validMovie, validMovie))
    expect(problems.some((p) => p.includes('duplicate id'))).toBe(true)
  })

  it('flags unknown platforms and genres', () => {
    const bad = { ...validMovie, platforms: ['peacock'], genres: ['western'] } as unknown as Movie
    const problems = validateCatalogue(catalogueOf(bad))
    expect(problems).toEqual(
      expect.arrayContaining([expect.stringContaining('unknown platform'), expect.stringContaining('unknown genre')]),
    )
  })

  it('flags too many genres', () => {
    const bad: Movie = { ...validMovie, genres: ['scifi', 'action', 'thriller'] }
    expect(validateCatalogue(catalogueOf(bad))).toEqual([expect.stringContaining('needs 1 or 2 genres')])
  })

  it('flags synopses over the length limit', () => {
    const bad: Movie = { ...validMovie, synopsis: 'x'.repeat(281) }
    expect(validateCatalogue(catalogueOf(bad))).toEqual([expect.stringContaining('max 280')])
  })

  it('flags malformed optional ids', () => {
    const bad: Movie = { ...validMovie, youtubeId: 'nope', imdbId: '12345' }
    expect(validateCatalogue(catalogueOf(bad))).toHaveLength(2)
  })
})

describe('coverageMatrix', () => {
  it('counts a film once per genre and once in classics', () => {
    const matrix = coverageMatrix(catalogueOf(validMovie))
    expect(matrix.max).toMatchObject({ scifi: 1, action: 1, classics: 1, drama: 0 })
    expect(matrix.netflix.scifi).toBe(0)
  })
})
