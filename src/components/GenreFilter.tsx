import type { Movie, PlatformId } from '../domain/catalogue.ts'
import { filterMovies, GENRE_FILTERS, type GenreFilter as GenreFilterId } from '../domain/picker.ts'
import './GenreFilter.css'

interface Props {
  movies: Movie[]
  platforms: PlatformId[]
  selected: GenreFilterId
  onSelect: (id: GenreFilterId) => void
}

/** Cans per shelf: Any + 3 genres on top, the rest (ending with Classics) below. */
const TOP_SHELF_SIZE = 4

/**
 * The film vault: one film can per mood. Each can is a real radio button
 * (visually hidden). The count under each can shows how many films it
 * would draw from on the selected services, so an empty shelf is visible
 * before the lever is pulled (ADR 0007).
 */
export function GenreFilter({ movies, platforms, selected, onSelect }: Props) {
  const shelves = [GENRE_FILTERS.slice(0, TOP_SHELF_SIZE), GENRE_FILTERS.slice(TOP_SHELF_SIZE)]

  return (
    <section className="kiosk vault" aria-labelledby="vault-title">
      <h2 id="vault-title" className="sign">
        Film vault
      </h2>
      <fieldset className="vault__fieldset">
        <legend className="sign__sub">Pick a can for your mood</legend>
        {shelves.map((shelf, i) => (
          <div key={i} className="vault__shelf">
            {shelf.map((genre) => {
              const count = filterMovies(movies, platforms, genre.id).length
              const checked = selected === genre.id
              return (
                <label key={genre.id} className={`can ${checked ? 'is-on' : ''} ${count === 0 ? 'is-empty' : ''}`}>
                  <input
                    type="radio"
                    name="genre"
                    value={genre.id}
                    className="visually-hidden"
                    checked={checked}
                    onChange={() => onSelect(genre.id)}
                  />
                  <span className="can__tin" aria-hidden="true">
                    <span className="can__label">{genre.id === 'any' ? 'Any' : genre.label}</span>
                  </span>
                  <span className="visually-hidden">{genre.label},</span>{' '}
                  <span className="can__count">
                    {count} {count === 1 ? 'reel' : 'reels'}
                  </span>
                </label>
              )
            })}
          </div>
        ))}
      </fieldset>
    </section>
  )
}
