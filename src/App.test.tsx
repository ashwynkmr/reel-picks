import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.tsx'
import { DEFAULT_TIMING, INSTANT } from './hooks/usePicker.ts'
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
  render(<App catalogue={catalogue} random={first} timing={INSTANT} />)
  return { user }
}

/** The result card on the silver screen. */
const card = (name?: string | RegExp) => screen.getByRole('article', name ? { name } : undefined)
const lever = () => screen.getByRole('button', { name: 'Pull the lever' })

describe('Reel Picks', () => {
  it('picks a film that matches the filters and shows its card', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'HBO Max' }))
    await user.click(screen.getByRole('radio', { name: /Action/ }))
    await user.click(lever())

    const result = card('Extraction')
    expect(within(result).getByText(/out of 10 on IMDb/)).toBeInTheDocument()
    expect(within(result).getByText('2000 · 2h 5m')).toBeInTheDocument()
    expect(within(result).getByRole('heading', { name: 'Extraction' })).toHaveFocus()
    expect(within(result).getByRole('link', { name: /Watch the trailer/ })).toHaveAttribute(
      'href',
      expect.stringContaining('youtube.com/results?search_query=Extraction%202000'),
    )
  })

  it('does not repeat the last film when spinning again, and counts the takes', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'HBO Max' }))
    await user.click(lever())
    expect(card('Extraction')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Spin again/ }))
    expect(card('Marriage Story')).toBeInTheDocument()
    expect(within(card()).getByText('Take').parentElement).toHaveTextContent('Take2')
  })

  it('clears the screen with "Change filters" and with Esc', async () => {
    const { user } = setup()
    await user.click(lever())
    await user.click(screen.getByRole('button', { name: 'Change filters' }))
    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    await user.click(lever())
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(lever()).toHaveFocus()
  })

  it('clears the screen when the filters change', async () => {
    const { user } = setup()
    await user.click(lever())
    expect(card()).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: /Drama/ }))
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('jams the lever and offers a one-tap fix when the filters match nothing', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'HBO Max' }))
    await user.click(screen.getByRole('radio', { name: /Classics/ }))

    expect(lever()).toBeDisabled()
    expect(screen.getByText('No reels in the can.')).toBeInTheDocument()
    expect(screen.getByText('None of your services have classics in our catalogue right now.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add HBO Max' }))
    expect(lever()).toBeEnabled()
  })

  it('shows how many films each mood would draw from', () => {
    setup()
    expect(screen.getByRole('radio', { name: /Classics/ })).toHaveAccessibleName('Classics, 1 reel')
    expect(screen.getByRole('radio', { name: /Any genre/ })).toHaveAccessibleName('Any genre, 3 reels')
  })

  it('never lets the last platform be switched off', async () => {
    const { user } = setup()
    for (const name of ['Prime Video', 'HBO Max', 'Disney+', 'Hulu', 'Apple TV']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    expect(screen.getByRole('checkbox', { name: 'Netflix' })).toBeDisabled()
    expect(screen.getByText('Keep at least one service switched on.')).toBeInTheDocument()
  })

  it('has a sound toggle that is on by default and remembered', async () => {
    const { user } = setup()
    const toggle = screen.getByRole('button', { name: /Sound/ })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(window.localStorage.getItem('reel-picks:sound:v1')).toBe('false')
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
    expect(card()).toBeInTheDocument()
  })
})

describe('the reveal sequence', () => {
  afterEach(() => vi.useRealTimers())

  function setupAnimated() {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App catalogue={catalogue} random={first} timing={DEFAULT_TIMING} />)
    return { user }
  }

  it('rolls the reel, snaps the slate, then lands the card', async () => {
    const { user } = setupAnimated()
    await user.click(lever())

    expect(screen.getByText('Rolling film…', { selector: '.visually-hidden' })).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Skip to the result' })).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(DEFAULT_TIMING.rollMs))
    expect(screen.getByText('And… action.')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(DEFAULT_TIMING.slateMs))
    expect(card()).toBeInTheDocument()
    expect(lever()).toBeInTheDocument()
  })

  it('can be skipped with the Skip button', async () => {
    const { user } = setupAnimated()
    await user.click(lever())
    await user.click(screen.getByRole('button', { name: /Skip ›/ }))
    expect(card()).toBeInTheDocument()
  })

  it('can be skipped by pulling the lever again', async () => {
    const { user } = setupAnimated()
    await user.click(lever())
    await user.click(screen.getByRole('button', { name: 'Skip to the result' }))
    expect(card()).toBeInTheDocument()
  })

  it('is cancelled by Esc, and never lands afterwards', async () => {
    const { user } = setupAnimated()
    await user.click(lever())
    await user.keyboard('{Escape}')
    act(() => vi.advanceTimersByTime(DEFAULT_TIMING.rollMs + DEFAULT_TIMING.slateMs))
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByText('Pull the lever to roll film')).toBeInTheDocument()
  })

  it('is cancelled by a filter change', async () => {
    const { user } = setupAnimated()
    await user.click(lever())
    await user.click(screen.getByRole('radio', { name: /Drama/ }))
    act(() => vi.advanceTimersByTime(DEFAULT_TIMING.rollMs + DEFAULT_TIMING.slateMs))
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('skips the animation entirely for reduced-motion users', async () => {
    const matchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia
    try {
      const { user } = setupAnimated()
      await user.click(lever())
      expect(card()).toBeInTheDocument()
    } finally {
      window.matchMedia = matchMedia
    }
  })
})
