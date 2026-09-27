import { useEffect, useRef, type CSSProperties } from 'react'
import type { Movie } from '../domain/catalogue.ts'
import './ReelSpinner.css'

interface Props {
  /** Frames to spin through; the last one is the pick. */
  frames: Movie[]
  durationMs: number
  onSkip: () => void
}

/** Height of one frame, including the dark gap between frames. Must match --frame-h in the CSS. */
const FRAME_H = 220

/**
 * The spin: a vertical strip of film frames racing through the projector
 * gate, blurring, then easing to a stop on the pick. It's one CSS keyframe
 * animation whose travel distance is set from the frame count, so it runs
 * on the compositor and stays smooth on phones.
 */
export function ReelSpinner({ frames, durationMs, onSkip }: Props) {
  const skipRef = useRef<HTMLButtonElement>(null)

  // If the button that started the spin has just disappeared (e.g. "Spin
  // again" on the old card), give keyboard users somewhere sensible to be.
  useEffect(() => {
    if (document.activeElement === document.body || document.activeElement === null) {
      skipRef.current?.focus({ preventScroll: true })
    }
  }, [])

  const style = {
    '--travel': `${(frames.length - 1) * FRAME_H}px`,
    '--roll-ms': `${durationMs}ms`,
  } as CSSProperties

  return (
    <div className="reel" style={style}>
      <p className="visually-hidden">Rolling film…</p>
      <div className="reel__gate" aria-hidden="true">
        <div className="reel__strip">
          {frames.map((movie, i) => (
            <div key={i} className="reel__frame genre-art" data-genre={movie.genres[0]}>
              <span className="reel__title">{movie.title}</span>
              <span className="reel__year">{movie.year}</span>
            </div>
          ))}
        </div>
      </div>
      <button ref={skipRef} type="button" className="reel__skip" onClick={onSkip}>
        Skip ›
      </button>
    </div>
  )
}
