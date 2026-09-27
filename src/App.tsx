import { useCallback, useEffect, useRef } from 'react'
import { CountdownLeader } from './components/CountdownLeader.tsx'
import { Credits } from './components/Credits.tsx'
import { Curtains } from './components/decor/Curtains.tsx'
import { FilmStrip } from './components/decor/FilmStrip.tsx'
import { EmptyState } from './components/EmptyState.tsx'
import { GenreFilter } from './components/GenreFilter.tsx'
import { Marquee } from './components/Marquee.tsx'
import { MovieCard } from './components/MovieCard.tsx'
import { PlatformFilter } from './components/PlatformFilter.tsx'
import { ReelSpinner } from './components/ReelSpinner.tsx'
import { SlateSnap } from './components/SlateSnap.tsx'
import { Theater } from './components/Theater.tsx'
import shippedCatalogue from './data/catalogue.json'
import type { Catalogue } from './domain/catalogue.ts'
import { genreLabel } from './domain/picker.ts'
import { DEFAULT_TIMING, INSTANT, usePicker, type RevealTiming } from './hooks/usePicker.ts'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.ts'
import './App.css'

/** Elements where Space already means something (typing, pressing, ticking). */
const SPACE_CONSUMERS = 'input, textarea, select, button, a, [contenteditable]'

interface Props {
  /** Injectable for tests; defaults to the shipped catalogue. */
  catalogue?: Catalogue
  random?: () => number
  /** Reveal timing; tests pass INSTANT. Reduced-motion users always get INSTANT. */
  timing?: RevealTiming
}

function App({ catalogue = shippedCatalogue as Catalogue, random, timing = DEFAULT_TIMING }: Props) {
  const reducedMotion = usePrefersReducedMotion()
  const effectiveTiming = reducedMotion ? INSTANT : timing
  const picker = usePicker(catalogue.movies, { random, timing: effectiveTiming })
  const { spin, skip, closePick, candidates, pick, phase } = picker
  const canSpin = candidates.length > 0
  const busy = phase === 'rolling' || phase === 'slating'
  const scrollBehavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'

  const screenRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  /** Pull the lever and bring the screen into view (it can be below the fold on phones). */
  const pull = useCallback(() => {
    spin()
    screenRef.current?.scrollIntoView?.({ block: 'center', behavior: scrollBehavior })
  }, [spin, scrollBehavior])

  /** The lever (and Space) pulls when idle, and skips ahead while a spin is playing. */
  const onLever = useCallback(() => (busy ? skip() : pull()), [busy, skip, pull])

  /** Clear the screen and take the user back up to the filters. */
  const changeFilters = useCallback(() => {
    closePick()
    filtersRef.current?.scrollIntoView?.({ block: 'start', behavior: scrollBehavior })
    filtersRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus({ preventScroll: true })
  }, [closePick, scrollBehavior])

  // Space pulls the lever (or skips a spin) from anywhere that doesn't already
  // use Space; Esc clears the screen, cancelling a spin in progress.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && pick) {
        closePick()
        document.querySelector<HTMLButtonElement>('.projector')?.focus()
        return
      }
      if (event.key !== ' ' || event.repeat) return
      if (event.target instanceof Element && event.target.closest(SPACE_CONSUMERS)) return
      event.preventDefault()
      onLever()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onLever, closePick, pick])

  const scene = genreLabel(picker.genre)
  let screen
  if (pick && phase === 'rolling') {
    screen = <ReelSpinner key={picker.take} frames={picker.reel} durationMs={effectiveTiming.rollMs} onSkip={skip} />
  } else if (pick && phase === 'slating') {
    screen = <SlateSnap scene={scene} take={picker.take} durationMs={effectiveTiming.slateMs} />
  } else if (pick) {
    screen = (
      <MovieCard movie={pick} take={picker.take} scene={scene} onSpinAgain={pull} onChangeFilters={changeFilters} />
    )
  } else if (!canSpin && picker.fix) {
    screen = (
      <EmptyState
        platforms={picker.platforms}
        genre={picker.genre}
        fix={picker.fix}
        onAddPlatform={picker.addPlatform}
        onAnyGenre={() => picker.setGenre('any')}
      />
    )
  } else {
    screen = <CountdownLeader />
  }

  const hint = busy ? (
    'Rolling film…'
  ) : canSpin ? (
    <>
      {candidates.length} {candidates.length === 1 ? 'reel' : 'reels'} loaded
      <span className="theater__key-hint">
        {' '}
        · or press <kbd>Space</kbd>
      </span>
    </>
  ) : (
    'Lever jammed: no reels loaded'
  )

  return (
    <>
      <Curtains />
      <div className="stage" data-phase={phase}>
        <Marquee />
        <FilmStrip />

        <main>
          <div ref={filtersRef} className="filters">
            <PlatformFilter selected={picker.platforms} onToggle={picker.togglePlatform} />
            <GenreFilter
              movies={catalogue.movies}
              platforms={picker.platforms}
              selected={picker.genre}
              onSelect={picker.setGenre}
            />
          </div>

          <Theater ref={screenRef} screen={screen} canPull={canSpin} rolling={busy} onPull={onLever} hint={hint} />
        </main>

        <Credits catalogue={catalogue} />
      </div>
    </>
  )
}

export default App
