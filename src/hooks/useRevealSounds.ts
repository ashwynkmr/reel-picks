import { useEffect, useRef } from 'react'
import { clap, startWhir, thud } from '../audio/sounds.ts'
import type { Phase, RevealTiming } from './usePicker.ts'

/** Where in the slate animation the stick hits the board (matches the 55% keyframe in SlateSnap.css). */
const CLAP_AT = 0.55
/** When the IMDb seal stamps down after the card appears (matches the seal-stamp delay in MovieCard.css). */
const THUD_AFTER_MS = 340

/**
 * Plays the soundtrack for the reveal, driven entirely by the picker's
 * phase so sound can never get out of step with the picture:
 *   rolling -> projector whir; slating -> clapper crack; showing -> seal thud.
 * Skipping or cancelling stops whatever is playing. Muting stops it too.
 */
export function useRevealSounds(phase: Phase, take: number, soundOn: boolean, timing: RevealTiming) {
  const stopWhir = useRef<() => void>(() => {})
  const timers = useRef<number[]>([])
  const clapped = useRef(false)
  const lastPhase = useRef<Phase>(phase)
  const lastTake = useRef(take)

  useEffect(() => {
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    const clearLater = () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
    }

    // Only a new phase or a new take makes sound. Toggling sound on mid-scene
    // shouldn't replay a clap for a card that's already on screen. (With
    // reduced motion, "spin again" goes showing -> showing, so the take matters.)
    const prevPhase = lastPhase.current
    const changed = prevPhase !== phase || lastTake.current !== take
    lastPhase.current = phase
    lastTake.current = take

    if (!soundOn) {
      stopWhir.current()
      clearLater()
      return
    }
    if (!changed) return

    switch (phase) {
      case 'rolling':
        clapped.current = false
        stopWhir.current = startWhir(timing.rollMs)
        break
      case 'slating':
        stopWhir.current()
        later(() => {
          clap()
          clapped.current = true
        }, timing.slateMs * CLAP_AT)
        break
      case 'showing':
        stopWhir.current()
        clearLater()
        // A clap only counts if it came from this take's slate.
        if (prevPhase !== 'slating') clapped.current = false
        // Skipped (or instant, for reduced motion) before the clap: still give the snap.
        if (!clapped.current) clap()
        clapped.current = true
        later(thud, THUD_AFTER_MS)
        break
      case 'idle':
        stopWhir.current()
        clearLater()
        clapped.current = false
        break
    }
  }, [phase, take, soundOn, timing.rollMs, timing.slateMs])

  // Silence everything on unmount.
  useEffect(
    () => () => {
      stopWhir.current()
      timers.current.forEach((id) => window.clearTimeout(id))
    },
    [],
  )
}
