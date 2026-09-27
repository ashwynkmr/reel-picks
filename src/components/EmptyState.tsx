import type { PlatformId } from '../domain/catalogue.ts'
import { genreLabel, platformLabel, type EmptyStateFix, type GenreFilter } from '../domain/picker.ts'
import './EmptyState.css'

interface Props {
  platforms: PlatformId[]
  genre: GenreFilter
  fix: EmptyStateFix
  onAddPlatform: (id: PlatformId) => void
  onAnyGenre: () => void
}

/** How many "add a platform" shortcuts to offer. More than two becomes a list to read. */
const MAX_PLATFORM_SUGGESTIONS = 2

/**
 * Shown on the screen when the filters match nothing: an "Intermission"
 * title card that names the gap and offers the smallest fix (ADR 0007).
 */
export function EmptyState({ platforms, genre, fix, onAddPlatform, onAnyGenre }: Props) {
  const suggestions = fix.addPlatforms.slice(0, MAX_PLATFORM_SUGGESTIONS)
  const what = genre === 'classics' ? 'classics' : `${genreLabel(genre).toLowerCase()} films`
  const where = platforms.length === 1 ? `${platformLabel(platforms[0])} has` : 'None of your services have'
  const sentence = platforms.length === 1 ? `${where} no ${what}` : `${where} ${what}`

  return (
    <div className="intermission" role="status">
      <p className="intermission__kicker" aria-hidden="true">
        Intermission
      </p>
      <p className="intermission__title">No reels in the can.</p>
      <p className="intermission__body">{sentence} in our catalogue right now.</p>
      <div className="intermission__actions">
        {suggestions.map((id) => (
          <button key={id} type="button" className="btn btn--ghost" onClick={() => onAddPlatform(id)}>
            Add {platformLabel(id)}
          </button>
        ))}
        {fix.tryAnyGenre && (
          <button type="button" className="btn btn--ghost" onClick={onAnyGenre}>
            Try any genre
          </button>
        )}
      </div>
    </div>
  )
}
