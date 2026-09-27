import { PLATFORMS, type PlatformId } from '../domain/catalogue.ts'

interface Props {
  selected: PlatformId[]
  onToggle: (id: PlatformId) => void
}

/** Multi-select of streaming services. The last selected one can't be switched off. */
export function PlatformFilter({ selected, onToggle }: Props) {
  const onlyOneLeft = selected.length === 1

  return (
    <fieldset className="filter">
      <legend className="filter__legend">What do you subscribe to?</legend>
      <div className="filter__options">
        {PLATFORMS.map((platform) => {
          const checked = selected.includes(platform.id)
          const locked = checked && onlyOneLeft
          return (
            <label key={platform.id} className="filter__option" title={locked ? 'Keep at least one' : undefined}>
              <input type="checkbox" checked={checked} disabled={locked} onChange={() => onToggle(platform.id)} />
              {platform.label}
            </label>
          )
        })}
      </div>
      {onlyOneLeft && <p className="filter__hint">Keep at least one service switched on.</p>}
    </fieldset>
  )
}
