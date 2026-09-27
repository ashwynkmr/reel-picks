import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'
import { INSTANT } from './hooks/usePicker.ts'

/**
 * Automated accessibility audit of each screen state with axe-core.
 * jsdom can't compute colour contrast, so that rule is checked by hand
 * against the palette in src/styles/tokens.css instead.
 */
async function audit(container: HTMLElement) {
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)
}

describe('accessibility', () => {
  it('has no violations on the idle screen', async () => {
    const { container } = render(<App random={() => 0} timing={INSTANT} />)
    expect(await audit(container)).toEqual([])
  })

  it('has no violations with a film on screen', async () => {
    const user = userEvent.setup()
    const { container } = render(<App random={() => 0} timing={INSTANT} />)
    await user.click(screen.getByRole('button', { name: 'Pull the lever' }))
    expect(await audit(container)).toEqual([])
  })

  it('has no violations in the empty state', async () => {
    const user = userEvent.setup()
    const { container } = render(<App random={() => 0} timing={INSTANT} />)
    for (const name of ['Prime Video', 'HBO Max', 'Disney+', 'Hulu', 'Apple TV']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    await user.click(screen.getByRole('radio', { name: /Classics/ }))
    expect(await audit(container)).toEqual([])
  })
})
