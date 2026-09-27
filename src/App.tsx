import { useEffect } from 'react'
import { EmptyState } from './components/EmptyState.tsx'
import { GenreFilter } from './components/GenreFilter.tsx'
import { MovieCard } from './components/MovieCard.tsx'
import { PlatformFilter } from './components/PlatformFilter.tsx'
import shippedCatalogue from './data/catalogue.json'
import type { Catalogue } from './domain/catalogue.ts'
import { usePicker } from './hooks/usePicker.ts'

const CORRECTION_URL = 'https://github.com/ashwynkmr/reel-picks/issues/new?template=data_correction.yml'

/** Elements where Space already means something (typing, pressing, ticking). */
const SPACE_CONSUMERS = 'input, textarea, select, button, a, [contenteditable]'

interface Props {
  /** Injectable for tests; defaults to the shipped catalogue. */
  catalogue?: Catalogue
  random?: () => number
}

function App({ catalogue = shippedCatalogue as Catalogue, random }: Props) {
  const picker = usePicker(catalogue.movies, random)
  const { spin, candidates } = picker
  const canSpin = candidates.length > 0

  // Space pulls the lever from anywhere on the page, unless focus is on
  // something that already uses Space.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== ' ' || event.repeat) return
      if (event.target instanceof Element && event.target.closest(SPACE_CONSUMERS)) return
      event.preventDefault()
      spin()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [spin])

  return (
    <>
      <header className="site-header">
        <h1>Reel Picks</h1>
        <p>Pick your services and a mood. Pull the lever. Get one movie.</p>
      </header>

      <main className="picker">
        <PlatformFilter selected={picker.platforms} onToggle={picker.togglePlatform} />
        <GenreFilter
          movies={catalogue.movies}
          platforms={picker.platforms}
          selected={picker.genre}
          onSelect={picker.setGenre}
        />

        <section className="lever" aria-label="Pick a movie">
          {canSpin ? (
            <>
              <button type="button" className="lever__button" onClick={spin}>
                Pull the lever
              </button>
              <p className="lever__hint">
                Picking from {candidates.length} {candidates.length === 1 ? 'film' : 'films'}. Press Space anytime.
              </p>
            </>
          ) : (
            picker.fix && (
              <EmptyState
                platforms={picker.platforms}
                genre={picker.genre}
                fix={picker.fix}
                onAddPlatform={picker.addPlatform}
                onAnyGenre={() => picker.setGenre('any')}
              />
            )
          )}
        </section>
      </main>

      <MovieCard movie={picker.pick} onSpinAgain={spin} onClose={picker.closePick} />

      <footer className="site-footer">
        <p>
          {catalogue.movies.length} films. {catalogue.region} streaming availability as of {catalogue.asOf}; services
          change their libraries often. <a href={CORRECTION_URL}>Report a film that moved</a>.
        </p>
      </footer>
    </>
  )
}

export default App
