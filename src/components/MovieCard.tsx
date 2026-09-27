import { useEffect, useRef } from 'react'
import type { Movie } from '../domain/catalogue.ts'
import { imdbUrl, trailerUrl } from '../domain/links.ts'
import { genreLabel, platformLabel } from '../domain/picker.ts'

interface Props {
  movie: Movie | null
  onSpinAgain: () => void
  onClose: () => void
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
 * The result, shown in a native modal <dialog>. Using the platform element
 * gives us focus trapping, Esc to close and a proper modal role for screen
 * readers without extra code. Phase 3 animates it open.
 */
export function MovieCard({ movie, onSpinAgain, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (movie && !dialog.open) {
      dialog.showModal()
      // Start on the primary action. React's autoFocus doesn't render the
      // HTML attribute, so the dialog would otherwise focus its first link.
      dialog.querySelector<HTMLElement>('.movie-card__trailer')?.focus()
    }
    if (!movie && dialog.open) dialog.close()
  }, [movie])

  return (
    <dialog ref={dialogRef} className="movie-card" aria-labelledby="movie-card-title" onClose={onClose}>
      {movie && (
        <article>
          <header className="movie-card__header">
            <p className="movie-card__eyebrow">Now showing</p>
            <h2 id="movie-card-title">{movie.title}</h2>
            <p className="movie-card__meta">
              {movie.year} · {formatRuntime(movie.runtimeMinutes)}
              {movie.classic && <span className="movie-card__badge">Classic</span>}
            </p>
          </header>

          <p className="movie-card__rating">
            <a href={imdbUrl(movie)} target="_blank" rel="noreferrer">
              <span aria-hidden="true">{stars(movie.imdbRating)} </span>
              <strong>{movie.imdbRating.toFixed(1)}</strong>/10 on IMDb
            </a>
          </p>

          <p className="movie-card__synopsis">{movie.synopsis}</p>

          <dl className="movie-card__details">
            <dt>Genre</dt>
            <dd>{movie.genres.map(genreLabel).join(', ')}</dd>
            <dt>Streaming on</dt>
            <dd>{movie.platforms.map(platformLabel).join(', ')}</dd>
          </dl>

          <div className="movie-card__actions">
            <a className="movie-card__trailer" href={trailerUrl(movie)} target="_blank" rel="noreferrer">
              Watch the trailer <span className="visually-hidden">(opens YouTube in a new tab)</span>
            </a>
            <button type="button" onClick={onSpinAgain}>
              Spin again
            </button>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              Change filters
            </button>
          </div>
        </article>
      )}
    </dialog>
  )
}
