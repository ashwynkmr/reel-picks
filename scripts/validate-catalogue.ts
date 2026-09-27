/**
 * CLI wrapper around validateCatalogue: `npm run validate:data`.
 *
 * Runs with Node's built-in TypeScript type stripping (Node 22.18+),
 * so there is no compile step. Exits non-zero on any problem so CI fails.
 * Also prints the platform x genre coverage grid, flagging cells with
 * fewer than 2 films, which is where users will see repeats.
 */
import catalogueJson from '../src/data/catalogue.json' with { type: 'json' }
import type { Catalogue } from '../src/domain/catalogue.ts'
import { coverageMatrix, validateCatalogue } from '../src/domain/validateCatalogue.ts'

const catalogue = catalogueJson as Catalogue
const problems = validateCatalogue(catalogue)

console.log(`Catalogue: ${catalogue.movies.length} movies, ${catalogue.region}, as of ${catalogue.asOf}\n`)

const matrix = coverageMatrix(catalogue)
const columns = Object.keys(Object.values(matrix)[0])
console.log(['platform'.padEnd(10), ...columns.map((c) => c.padStart(9))].join(''))
for (const [platform, row] of Object.entries(matrix)) {
  const cells = columns.map((c) => {
    const n = row[c]
    return (n < 2 ? `${n}!` : String(n)).padStart(9)
  })
  console.log([platform.padEnd(10), ...cells].join(''))
}
console.log('\n(! = fewer than 2 films: users picking this combination will see repeats or an empty state)\n')

if (problems.length > 0) {
  console.error(`Found ${problems.length} problem(s):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log('All records valid.')
