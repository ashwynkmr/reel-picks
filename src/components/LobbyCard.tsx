import type { Movie } from '../domain/catalogue.ts'
import './LobbyCard.css'

/**
 * A generated poster for the result card. We don't ship studio artwork
 * (licensing), so each film gets a lobby card whose colours and texture
 * come from its main genre, with its title set in the marquee face.
 */
export function LobbyCard({ movie }: { movie: Movie }) {
  return (
    <div className="lobby-card" data-genre={movie.genres[0]} aria-hidden="true">
      <div className="lobby-card__art genre-art" data-genre={movie.genres[0]} />
      {movie.classic && <div className="lobby-card__ribbon">Classic</div>}
      <div className="lobby-card__title">{movie.title}</div>
      <div className="lobby-card__year">{movie.year}</div>
    </div>
  )
}
