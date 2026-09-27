import { GENRES, PLATFORMS, SYNOPSIS_MAX_LENGTH, type Catalogue, type Movie } from './catalogue.ts'

/**
 * Checks the hand-curated catalogue for mistakes a reviewer would miss.
 *
 * The catalogue is edited by hand, so this runs in CI on every push
 * (`npm run validate:data`). It returns a list of human-readable problems
 * rather than throwing on the first one, so a contributor can fix
 * everything in a single pass.
 */

const platformIds = new Set<string>(PLATFORMS.map((p) => p.id))
const genreIds = new Set<string>(GENRES.map((g) => g.id))

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/
const IMDB_ID_PATTERN = /^tt\d{7,8}$/
const FIRST_FILM_YEAR = 1888

export function validateCatalogue(catalogue: Catalogue, today = new Date()): string[] {
  const problems: string[] = []
  const seenIds = new Set<string>()
  const maxYear = today.getFullYear() + 1

  if (Number.isNaN(Date.parse(catalogue.asOf))) {
    problems.push(`asOf "${catalogue.asOf}" is not a valid ISO date`)
  }

  catalogue.movies.forEach((movie: Movie, index) => {
    const where = `movies[${index}] (${movie.id || 'no id'})`

    if (!SLUG_PATTERN.test(movie.id)) problems.push(`${where}: id must be a kebab-case slug`)
    if (!movie.id.endsWith(`-${movie.year}`)) problems.push(`${where}: id should end with the year`)
    if (seenIds.has(movie.id)) problems.push(`${where}: duplicate id`)
    seenIds.add(movie.id)

    if (!movie.title.trim()) problems.push(`${where}: title is empty`)

    if (!Number.isInteger(movie.year) || movie.year < FIRST_FILM_YEAR || movie.year > maxYear) {
      problems.push(`${where}: year ${movie.year} is out of range`)
    }

    if (!Number.isInteger(movie.runtimeMinutes) || movie.runtimeMinutes < 40 || movie.runtimeMinutes > 300) {
      problems.push(`${where}: runtime ${movie.runtimeMinutes} min looks wrong`)
    }

    if (movie.genres.length < 1 || movie.genres.length > 2) {
      problems.push(`${where}: needs 1 or 2 genres, has ${movie.genres.length}`)
    }
    if (new Set(movie.genres).size !== movie.genres.length) problems.push(`${where}: repeated genre`)
    movie.genres.forEach((g) => {
      if (!genreIds.has(g)) problems.push(`${where}: unknown genre "${g}"`)
    })

    if (movie.platforms.length < 1) problems.push(`${where}: needs at least one platform`)
    if (new Set(movie.platforms).size !== movie.platforms.length) problems.push(`${where}: repeated platform`)
    movie.platforms.forEach((p) => {
      if (!platformIds.has(p)) problems.push(`${where}: unknown platform "${p}"`)
    })

    if (typeof movie.imdbRating !== 'number' || movie.imdbRating < 1 || movie.imdbRating > 10) {
      problems.push(`${where}: imdbRating ${movie.imdbRating} must be between 1 and 10`)
    }

    const synopsis = movie.synopsis.trim()
    if (synopsis.length < 40) problems.push(`${where}: synopsis is too short`)
    if (synopsis.length > SYNOPSIS_MAX_LENGTH) {
      problems.push(`${where}: synopsis is ${synopsis.length} chars (max ${SYNOPSIS_MAX_LENGTH})`)
    }

    if (movie.youtubeId !== undefined && !YOUTUBE_ID_PATTERN.test(movie.youtubeId)) {
      problems.push(`${where}: youtubeId "${movie.youtubeId}" is not an 11-character video id`)
    }
    if (movie.imdbId !== undefined && !IMDB_ID_PATTERN.test(movie.imdbId)) {
      problems.push(`${where}: imdbId "${movie.imdbId}" should look like tt1234567`)
    }
  })

  return problems
}

/**
 * Coverage report: how many films sit in each platform x genre cell.
 * Thin cells mean a user who picks that combination gets the same few
 * films every spin, so this is a product-quality signal, not just data hygiene.
 */
export function coverageMatrix(catalogue: Catalogue): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {}
  for (const platform of PLATFORMS) {
    matrix[platform.id] = { classics: 0 }
    for (const genre of GENRES) matrix[platform.id][genre.id] = 0
  }
  for (const movie of catalogue.movies) {
    for (const p of movie.platforms) {
      for (const g of movie.genres) matrix[p][g] += 1
      if (movie.classic) matrix[p].classics += 1
    }
  }
  return matrix
}
