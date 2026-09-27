import type { Movie } from './catalogue.ts'

/**
 * Outbound links for the result card.
 *
 * Tradeoff (docs/decisions/0003): hard-coded YouTube video ids break when
 * studios re-upload or regional channels take trailers down, and nobody
 * notices until a user clicks. A search for "<title> <year> official
 * trailer" almost always puts the right video first and never 404s.
 * Verified ids are still preferred when we have them.
 */

export function trailerUrl(movie: Pick<Movie, 'title' | 'year' | 'youtubeId'>): string {
  if (movie.youtubeId) return `https://www.youtube.com/watch?v=${movie.youtubeId}`
  const query = encodeURIComponent(`${movie.title} ${movie.year} official trailer`)
  return `https://www.youtube.com/results?search_query=${query}`
}

export function imdbUrl(movie: Pick<Movie, 'title' | 'year' | 'imdbId'>): string {
  if (movie.imdbId) return `https://www.imdb.com/title/${movie.imdbId}/`
  const query = encodeURIComponent(`${movie.title} ${movie.year}`)
  return `https://www.imdb.com/find/?q=${query}&s=tt`
}
