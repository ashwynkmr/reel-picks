import './Projector.css'

interface Props {
  /** No films match: the lever is jammed. */
  disabled: boolean
  /** A spin is playing: the lever is held down and the reels race. Pressing it again skips. */
  rolling: boolean
  onPull: () => void
  describedBy?: string
}

/**
 * The projector, whose red-knobbed lever is the main call to action.
 * The whole illustration is one <button>, so it's a large, obvious target
 * on touch screens and works with Enter/Space like any button.
 */
export function Projector({ disabled, rolling, onPull, describedBy }: Props) {
  return (
    <button
      type="button"
      className={`projector ${rolling ? 'is-rolling' : ''}`}
      onClick={onPull}
      disabled={disabled}
      aria-label={rolling ? 'Skip to the result' : 'Pull the lever'}
      aria-describedby={describedBy}
    >
      <svg viewBox="0 0 300 220" width="300" aria-hidden="true">
        {/* reels on their arms */}
        <path d="M110 120 L85 70 M190 120 L215 70" stroke="var(--brown)" strokeWidth="7" strokeLinecap="round" />
        <g className="projector__reel">
          <circle cx="85" cy="62" r="50" fill="#3d3631" stroke="var(--tin)" strokeWidth="5" />
          <circle cx="85" cy="62" r="40" fill="none" stroke="#5a524b" strokeWidth="2" />
          <circle cx="85" cy="33" r="11" fill="var(--booth-deep)" />
          <circle cx="110" cy="76" r="11" fill="var(--booth-deep)" />
          <circle cx="60" cy="76" r="11" fill="var(--booth-deep)" />
          <circle cx="85" cy="62" r="8" fill="var(--mustard)" />
        </g>
        <g className="projector__reel projector__reel--fast">
          <circle cx="215" cy="62" r="50" fill="#3d3631" stroke="var(--tin)" strokeWidth="5" />
          <circle cx="215" cy="62" r="40" fill="none" stroke="#5a524b" strokeWidth="2" />
          <circle cx="215" cy="33" r="11" fill="var(--booth-deep)" />
          <circle cx="240" cy="76" r="11" fill="var(--booth-deep)" />
          <circle cx="190" cy="76" r="11" fill="var(--booth-deep)" />
          <circle cx="215" cy="62" r="8" fill="var(--mustard)" />
        </g>
        {/* film threading from the reels into the body */}
        <path
          d="M40 70 C 30 130, 110 110, 130 140 M260 70 C 270 130, 190 110, 170 140"
          stroke="#26211e"
          strokeWidth="4"
          fill="none"
        />
        {/* body */}
        <rect x="80" y="118" width="140" height="80" rx="14" fill="var(--teal)" />
        <rect x="80" y="118" width="140" height="16" rx="8" fill="#6a978f" />
        <rect x="92" y="176" width="40" height="6" rx="3" fill="var(--teal-deep)" />
        <rect x="168" y="176" width="40" height="6" rx="3" fill="var(--teal-deep)" />
        {/* glowing lens */}
        <circle cx="150" cy="158" r="26" fill="var(--booth)" stroke="var(--mustard)" strokeWidth="4" />
        <circle className="projector__lens" cx="150" cy="158" r="16" fill="var(--bulb)" />
        <circle cx="150" cy="158" r="26" fill="#ffe7a8" opacity="0.25" />
        {/* feet */}
        <rect x="92" y="198" width="22" height="12" rx="3" fill="var(--brown)" />
        <rect x="186" y="198" width="22" height="12" rx="3" fill="var(--brown)" />
        {/* the lever */}
        <rect x="220" y="140" width="30" height="20" rx="4" fill="var(--brown)" />
        <g className="projector__lever">
          <rect x="258" y="82" width="9" height="72" rx="4.5" fill="#b3b7ae" />
          <circle cx="262" cy="80" r="17" fill="var(--curtain)" stroke="var(--curtain-deep)" strokeWidth="3" />
          <circle cx="256" cy="74" r="5" fill="#fff" opacity="0.4" />
        </g>
        <circle cx="262" cy="150" r="9" fill="var(--mustard)" stroke="var(--brown)" strokeWidth="3" />
      </svg>
    </button>
  )
}
