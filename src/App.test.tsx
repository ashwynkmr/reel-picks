import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'
import type { Catalogue, Movie } from './domain/catalogue.ts'

const movie = (id: string, title: string, overrides: Partial<Movie>): Movie => ({
  id,
  title,
  year: 2000,
  runtimeMinutes: 125,
  genres: ['drama'],
  classic: false,
  platforms: ['netflix'],
  imdbRating: 7.5,
  synopsis: 'A synopsis long enough to pass validation rules in the catalogue.',
  ...overrides,
})

const catalogue: Catalogue = {
  asOf: '2026-09-27',
  region: 'US',
  movies: [
    movie('extraction-2020', 'Extraction', { genres: ['action'], platforms: ['netflix'] }),
    movie('marriage-story-2019', 'Marriage Story', { genres: ['drama'], platforms: ['netflix'] }),
    movie('the-matrix-1999', 'The Matrix', { genres: ['scifi', 'action'], classic: true, platforms: ['max'] }),
  ],
}

/** Always picks the first eligible film, so tests are deterministic. */
const first = () => 0

function setup() {
  const user = userEvent.setup()
  render(<App catalogue={catalogue} random={first} />)
  return { user }
}

describe('Reel Picks', () => {
  it('picks a film that matches the filters and shows its card', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'HBO Max' }))
    await user.click(screen.getByRole('radio', { name: /Action/ }))
    await user.click(screen.getByRole('button', { name: 'Pull the lever' }))

    const card = screen.getByRole('dialog', { name: 'Extraction' })
    expect(within(card).getByText(/7\.5/)).toBeInTheDocument()
    expect(within(card).getByText('2000 · 2h 5m')).toBeInTheDocument()
    expect(within(card).getByRole('link', { name: /Watch the trailer/ })).toHaveFocus()
    expect(within(card).getByRole('link', { name: /Watch the trailer/ })).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com/results?search_query=Extraction%202000'),
    )
  })

  it('does not repeat the last film when spinning again', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'HBO Max' }))
    await user.click(screen.getByRole('button', { name: 'Pull the lever' }))
    expect(screen.getByRole('dialog', { name: 'Extraction' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Spin again' }))
    expect(screen.getByRole('dialog', { name: 'Marriage Story' })).toBeInTheDocument()
  })

  it('closes the card with "Change filters"', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Pull the lever' }))
    await user.click(screen.getByRole('button', { name: 'Change filters' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers a one-tap fix when the filters match nothing', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'HBO Max' }))
    await user.click(screen.getByRole('radio', { name: /Classics/ }))

    expect(screen.queryByRole('button', { name: 'Pull the lever' })).not.toBeInTheDocument()
    expect(screen.getByText('No reels in the can.')).toBeInTheDocument()
    expect(screen.getByText('None of your services have classics in our catalogue right now.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add HBO Max' }))
    expect(screen.getByRole('button', { name: 'Pull the lever' })).toBeInTheDocument()
  })

  it('never lets the last platform be switched off', async () => {
    const { user } = setup()
    for (const name of ['Prime Video', 'HBO Max', 'Disney+', 'Hulu', 'Apple TV']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    expect(screen.getByRole('checkbox', { name: 'Netflix' })).toBeDisabled()
    expect(screen.getByText('Keep at least one service switched on.')).toBeInTheDocument()
  })

  it('remembers platforms between visits', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'Hulu' }))
    expect(JSON.parse(window.localStorage.getItem('reel-picks:platforms:v1') ?? '[]')).not.toContain('hulu')
  })

  it('pulls the lever with the Space key', async () => {
    const { user } = setup()
    await user.click(document.body)
    await user.keyboard(' ')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
