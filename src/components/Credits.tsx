import type { Catalogue } from '../domain/catalogue.ts'
import './Credits.css'

const CORRECTION_URL = 'https://github.com/ashwynkmr/reel-picks/issues/new?template=data_correction.yml'
const REPO_URL = 'https://github.com/ashwynkmr/reel-picks'

function formatAsOf(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Footer styled as end credits on a theatre carpet. Carries the data freshness note. */
export function Credits({ catalogue }: { catalogue: Catalogue }) {
  return (
    <footer className="credits">
      <p className="credits__title">The End?</p>
      <p>
        Directed by <b>you</b> · Projection by <b>Reel Picks</b>
      </p>
      <p>
        <b>{catalogue.movies.length}</b> films in the vault · {catalogue.region} listings as of{' '}
        {formatAsOf(catalogue.asOf)}
      </p>
      <p>
        Services change their libraries often. <a href={CORRECTION_URL}>Report a film that moved</a> ·{' '}
        <a href={REPO_URL}>How this was made</a>
      </p>
    </footer>
  )
}
