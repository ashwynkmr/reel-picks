import './Props.css'

/* Set dressing for the booth row: a director's chair and an 80s studio camera. Decorative only. */

export function DirectorsChair() {
  return (
    <div className="prop" aria-hidden="true">
      <svg viewBox="0 0 170 160" width="190">
        <polygon points="120,112 160,96 160,140 120,126" fill="var(--curtain)" />
        <rect x="112" y="110" width="10" height="18" rx="3" fill="var(--brown)" />
        <ellipse cx="160" cy="118" rx="5" ry="22" fill="var(--curtain-deep)" />
        <rect x="10" y="10" width="8" height="140" rx="3" fill="var(--gold-lo)" />
        <rect x="92" y="10" width="8" height="140" rx="3" fill="var(--gold-lo)" />
        <rect x="8" y="16" width="94" height="34" rx="3" fill="var(--teal)" />
        <text
          x="55"
          y="38"
          textAnchor="middle"
          fill="var(--cream)"
          fontFamily="Special Elite, monospace"
          fontSize="12"
          letterSpacing="2"
        >
          DIRECTOR
        </text>
        <rect x="4" y="70" width="104" height="7" rx="3" fill="var(--gold-lo)" />
        <rect x="12" y="92" width="86" height="10" rx="2" fill="var(--teal)" />
        <path d="M16 102 L94 150 M94 102 L16 150" stroke="var(--gold-lo)" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <p>Directed by you</p>
    </div>
  )
}

export function StudioCamera() {
  return (
    <div className="prop" aria-hidden="true">
      <svg viewBox="0 0 200 170" width="220">
        <g className="prop__reel">
          <circle cx="72" cy="30" r="26" fill="#3d3631" stroke="var(--tin)" strokeWidth="4" />
          <circle cx="72" cy="18" r="5" fill="var(--booth-deep)" />
          <circle cx="72" cy="30" r="6" fill="var(--mustard)" />
        </g>
        <g className="prop__reel">
          <circle cx="124" cy="30" r="26" fill="#3d3631" stroke="var(--tin)" strokeWidth="4" />
          <circle cx="124" cy="18" r="5" fill="var(--booth-deep)" />
          <circle cx="124" cy="30" r="6" fill="var(--mustard)" />
        </g>
        <rect x="52" y="54" width="92" height="50" rx="8" fill="var(--teal-deep)" />
        <rect x="52" y="54" width="92" height="10" rx="5" fill="var(--teal)" />
        <rect x="144" y="66" width="24" height="26" rx="3" fill="var(--brown)" />
        <polygon points="168,62 196,52 196,106 168,96" fill="var(--booth-deep)" stroke="var(--tin)" strokeWidth="2" />
        <rect x="26" y="66" width="28" height="12" rx="3" fill="var(--brown)" />
        <circle cx="24" cy="72" r="8" fill="var(--booth-deep)" stroke="var(--tin)" strokeWidth="2" />
        <rect x="90" y="104" width="14" height="12" fill="var(--brown)" />
        <path
          d="M97 116 L60 166 M97 116 L134 166 M97 116 L97 166"
          stroke="var(--gold-lo)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle className="prop__tally" cx="66" cy="84" r="4" fill="var(--curtain)" />
      </svg>
      <p>Camera rolling</p>
    </div>
  )
}
