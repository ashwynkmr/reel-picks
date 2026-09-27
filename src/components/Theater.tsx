import { forwardRef, type ReactNode } from 'react'
import { DirectorsChair, StudioCamera } from './decor/Props.tsx'
import { Projector } from './Projector.tsx'
import './Theater.css'

interface Props {
  /** What's on the silver screen: the countdown, an empty state, or the result. */
  screen: ReactNode
  canPull: boolean
  /** A spin is playing: brighter, flickering beam and a held-down lever. */
  rolling: boolean
  onPull: () => void
  hint: ReactNode
}

const SEAT_COUNT = 14

/**
 * The auditorium: a gold-framed silver screen, a row of seats, and the
 * projection booth with the lever. The beam of light is decorative and
 * sits over the seats, the way it would in a real theatre.
 *
 * The ref points at the screen so the app can scroll it into view when a
 * film is picked.
 */
export const Theater = forwardRef<HTMLDivElement, Props>(function Theater(
  { screen, canPull, rolling, onPull, hint },
  ref,
) {
  return (
    <section className="theater" aria-label="Screen">
      <div className={`theater__beam ${canPull ? '' : 'is-off'} ${rolling ? 'is-rolling' : ''}`} aria-hidden="true" />
      <div className="theater__proscenium">
        <div ref={ref} className="theater__screen" aria-live="polite">
          {screen}
        </div>
      </div>
      <div className="theater__seats" aria-hidden="true">
        {Array.from({ length: SEAT_COUNT }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="theater__booth">
        <DirectorsChair />
        <div className="theater__lever">
          <Projector disabled={!canPull} rolling={rolling} onPull={onPull} describedBy="lever-hint" />
          <p id="lever-hint" className="theater__hint">
            {hint}
          </p>
        </div>
        <StudioCamera />
      </div>
    </section>
  )
})
