import catalogueJson from './data/catalogue.json'
import { GENRES, PLATFORMS, type Catalogue } from './domain/catalogue.ts'

const catalogue = catalogueJson as Catalogue

/**
 * Phase 0 placeholder. It proves the data loads and the deploy pipeline
 * works end to end; the real picker UI arrives in Phase 1.
 */
function App() {
  const classics = catalogue.movies.filter((m) => m.classic).length

  return (
    <main className="placeholder">
      <h1>Reel Picks</h1>
      <p>Coming soon to a browser near you.</p>
      <p className="placeholder__stats">
        {catalogue.movies.length} films in the can ({classics} classics) across {PLATFORMS.length} platforms and{' '}
        {GENRES.length} genres. {catalogue.region} availability as of {catalogue.asOf}.
      </p>
    </main>
  )
}

export default App
