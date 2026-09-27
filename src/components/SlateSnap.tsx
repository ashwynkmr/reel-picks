import type { CSSProperties } from 'react'
import './SlateSnap.css'

interface Props {
  scene: string
  take: number
  durationMs: number
}

/**
 * The beat between the spin and the card: a clapperboard marked with the
 * scene (the mood) and take (which pick this is) snaps shut, with a flash.
 */
export function SlateSnap({ scene, take, durationMs }: Props) {
  return (
    <div className="slate-snap" style={{ '--slate-ms': `${durationMs}ms` } as CSSProperties}>
      <p className="visually-hidden">And… action.</p>
      <div className="slate-snap__board" aria-hidden="true">
        <div className="slate-snap__stick" />
        <div className="slate-snap__body">
          <div className="slate-snap__row slate-snap__row--title">Reel Picks</div>
          <div className="slate-snap__row">
            <div>
              <span>Scene</span>
              {scene}
            </div>
            <div>
              <span>Take</span>
              {take}
            </div>
          </div>
        </div>
      </div>
      <div className="slate-snap__flash" aria-hidden="true" />
    </div>
  )
}
