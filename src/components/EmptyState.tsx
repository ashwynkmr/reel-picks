import type { PlatformId } from '../domain/catalogue.ts'
import { genreLabel, platformLabel, type EmptyStateFix, type GenreFilter } from '../domain/picker.ts'

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
 * Shown instead of a result when the filters match nothing. Rather than a
 * dead end, it offers the smallest change that fixes it (ADR 0007).
 */
export function EmptyState({ platforms, genre, fix, onAddPlatform, onAnyGenre }: Props) {
  const suggestions = fix.addPlatforms.slice(0, MAX_PLATFORM_SUGGESTIONS)
  const what = genre === 'classics' ? 'classics' : `${genreLabel(genre).toLowerCase()} films`
  const where = platforms.length === 1 ? `${platformLabel(platforms[0])} has` : 'None of your services have'
  const sentence = platforms.length === 1 ? `${where} no ${what}` : `${where} ${what}`

  return (
    <div className="empty-state" role="status">
      <p className="empty-state__title">No reels in the can.</p>
      <p>{sentence} in our catalogue right now.</p>
      <div className="empty-state__actions">
        {suggestions.map((id) => (
          <button key={id} type="button" onClick={() => onAddPlatform(id)}>
            Add {platformLabel(id)}
          </button>
        ))}
        {fix.tryAnyGenre && (
          <button type="button" onClick={onAnyGenre}>
            Try any genre
          </button>
        )}
      </div>
    </div>
  )
}
