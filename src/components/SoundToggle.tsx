import './SoundToggle.css'

interface Props {
  on: boolean
  onToggle: () => void
}

/** A brass plate in the corner that turns the projector sounds on or off. Remembered between visits. */
export function SoundToggle({ on, onToggle }: Props) {
  return (
    <button type="button" className="sound-toggle" aria-pressed={on} onClick={onToggle}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {on ? (
          <path
            d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
      <span>Sound {on ? 'on' : 'off'}</span>
    </button>
  )
}
