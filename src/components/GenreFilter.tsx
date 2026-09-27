import type { Movie, PlatformId } from '../domain/catalogue.ts'
import { filterMovies, GENRE_FILTERS, type GenreFilter as GenreFilterId } from '../domain/picker.ts'

interface Props {
  movies: Movie[]
  platforms: PlatformId[]
  selected: GenreFilterId
  onSelect: (id: GenreFilterId) => void
}

/**
 * Single-select mood picker. Each option shows how many films it would
 * draw from on the selected services, so users can see a thin or empty
 * shelf before they pull the lever rather than after.
 */
export function GenreFilter({ movies, platforms, selected, onSelect }: Props) {
  return (
    <fieldset className="filter">
      <legend className="filter__legend">What are you in the mood for?</legend>
      <div className="filter__options">
        {GENRE_FILTERS.map((genre) => {
          const count = filterMovies(movies, platforms, genre.id).length
          return (
            <label key={genre.id} className="filter__option">
              <input
                type="radio"
                name="genre"
                value={genre.id}
                checked={selected === genre.id}
                onChange={() => onSelect(genre.id)}
              />
              {genre.label} <span className="filter__count">({count})</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
