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
import { Theater } from './components/Theater.tsx'
import shippedCatalogue from './data/catalogue.json'
import type { Catalogue } from './domain/catalogue.ts'
import { genreLabel } from './domain/picker.ts'
import { usePicker } from './hooks/usePicker.ts'
import './App.css'

/** Elements where Space already means something (typing, pressing, ticking). */
const SPACE_CONSUMERS = 'input, textarea, select, button, a, [contenteditable]'

interface Props {
  /** Injectable for tests; defaults to the shipped catalogue. */
  catalogue?: Catalogue
  random?: () => number
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function App({ catalogue = shippedCatalogue as Catalogue, random }: Props) {
  const picker = usePicker(catalogue.movies, random)
  const { spin, closePick, candidates, pick } = picker
  const canSpin = candidates.length > 0

  const screenRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  /** Pull the lever and bring the screen into view (it can be below the fold on phones). */
  const pull = useCallback(() => {
    spin()
    screenRef.current?.scrollIntoView?.({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [spin])

  /** Clear the screen and take the user back up to the filters. */
  const changeFilters = useCallback(() => {
    closePick()
    filtersRef.current?.scrollIntoView?.({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    filtersRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus({ preventScroll: true })
  }, [closePick])

  // Space pulls the lever from anywhere that doesn't already use Space; Esc clears the screen.
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
      pull()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pull, closePick, pick])

  let screen
  if (pick) {
    screen = (
      <MovieCard
        movie={pick}
        take={picker.take}
        scene={genreLabel(picker.genre)}
        onSpinAgain={pull}
        onChangeFilters={changeFilters}
      />
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

  const hint = canSpin ? (
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
      <div className="stage">
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

          <Theater ref={screenRef} screen={screen} canPull={canSpin} onPull={pull} hint={hint} />
        </main>

        <Credits catalogue={catalogue} />
      </div>
    </>
  )
}

export default App
