import { describe, expect, it } from 'vitest'
import { imdbUrl, trailerUrl } from './links.ts'

describe('trailerUrl', () => {
  it('uses a verified YouTube id when present', () => {
    expect(trailerUrl({ title: 'Alien', year: 1979, youtubeId: 'abcdefghijk' })).toBe(
      'https://www.youtube.com/watch?v=abcdefghijk',
    )
  })

  it('falls back to a YouTube search for the official trailer', () => {
    expect(trailerUrl({ title: "Don't Look Up", year: 2021 })).toBe(
      "https://www.youtube.com/results?search_query=Don't%20Look%20Up%202021%20official%20trailer",
    )
  })
})

describe('imdbUrl', () => {
  it('links straight to the title page when the id is known', () => {
    expect(imdbUrl({ title: 'Alien', year: 1979, imdbId: 'tt0078748' })).toBe('https://www.imdb.com/title/tt0078748/')
  })

  it('falls back to an IMDb title search', () => {
    expect(imdbUrl({ title: 'Up', year: 2009 })).toBe('https://www.imdb.com/find/?q=Up%202009&s=tt')
  })
})
