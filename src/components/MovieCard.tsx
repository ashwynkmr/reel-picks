import { useEffect, useRef } from 'react'
import type { Movie } from '../domain/catalogue.ts'
import { imdbUrl, trailerUrl } from '../domain/links.ts'
import { genreLabel, platformLabel } from '../domain/picker.ts'
import { LobbyCard } from './LobbyCard.tsx'
import './MovieCard.css'

interface Props {
  movie: Movie
  /** Which pick of the session this is, shown on the clapperboard. */
  take: number
  /** The mood that was chosen, shown as the "scene". */
  scene: string
  onSpinAgain: () => void
  onChangeFilters: () => void
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

/** Five-star meter from a rating out of 10, rounded to the nearest half star. */
function stars(rating: number): string {
  const halves = Math.round(rating)
  return '★'.repeat(Math.floor(halves / 2)) + (halves % 2 ? '½' : '') + '☆'.repeat(5 - Math.ceil(halves / 2))
}

/**
 * The result, projected onto the silver screen (ADR 0008). On every new
 * pick, focus moves to the title so screen readers announce the film and
 * keyboard users land right above the actions.
 */
export function MovieCard({ movie, take, scene, onSpinAgain, onChangeFilters }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [movie.id, take])

  return (
    <article className="movie-card" aria-labelledby="movie-card-title">
      <LobbyCard movie={movie} />

      <div className="movie-card__body">
        <div className="slate" aria-hidden="true">
          <div>
            <span>Prod.</span>Reel Picks
          </div>
          <div>
            <span>Scene</span>
            {scene}
          </div>
          <div>
            <span>Take</span>
            {take}
          </div>
        </div>

        <p className="movie-card__eyebrow">Now showing</p>
        <h2 id="movie-card-title" ref={titleRef} tabIndex={-1}>
          {movie.title}
        </h2>
        <p className="movie-card__meta">
          {movie.year} · {formatRuntime(movie.runtimeMinutes)}
          {movie.classic && <span className="movie-card__badge">Classic</span>}
        </p>

        <a className="movie-card__rating" href={imdbUrl(movie)} target="_blank" rel="noreferrer">
          <span className="movie-card__seal">
            {movie.imdbRating.toFixed(1)}
            <small>IMDb</small>
          </span>
          <span>
            <span className="movie-card__stars" aria-hidden="true">
              {stars(movie.imdbRating)}
            </span>
            <span className="movie-card__rating-src">
              <span className="visually-hidden">{movie.imdbRating.toFixed(1)} </span>out of 10 on IMDb
            </span>
          </span>
        </a>

        <p className="movie-card__synopsis">{movie.synopsis}</p>

        <ul className="movie-card__chips" aria-label="Genres and services">
          {movie.genres.map((g) => (
            <li key={g} className="chip">
              {genreLabel(g)}
            </li>
          ))}
          <li className="chip chip--platform">Streaming on {movie.platforms.map(platformLabel).join(', ')}</li>
        </ul>

        <div className="movie-card__actions">
          <a className="btn btn--ticket" href={trailerUrl(movie)} target="_blank" rel="noreferrer">
            ▶ Watch the trailer <span className="visually-hidden">(opens YouTube in a new tab)</span>
          </a>
          <button type="button" className="btn btn--ghost" onClick={onSpinAgain}>
            ↻ Spin again
          </button>
          <button type="button" className="btn btn--ghost" onClick={onChangeFilters}>
            Change filters
          </button>
        </div>
      </div>
    </article>
  )
}
