import { describe, expect, it } from 'vitest'
import { clap, sprocketTimes, startWhir, thud } from './sounds.ts'

describe('sprocketTimes', () => {
  const times = sprocketTimes(2400)

  it('starts immediately and stays within the roll', () => {
    expect(times[0]).toBe(0)
    expect(times.at(-1)).toBeLessThan(2400)
  })

  it('slows down, like the reel', () => {
    const gaps = times.slice(1).map((t, i) => t - times[i])
    expect(gaps[0]).toBeLessThan(40)
    expect(gaps.at(-1)).toBeGreaterThan(120)
    for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeGreaterThanOrEqual(gaps[i - 1])
  })
})

describe('without Web Audio', () => {
  it('every sound is a safe no-op', () => {
    expect(() => {
      const stop = startWhir(1000)
      stop()
      clap()
      thud()
    }).not.toThrow()
  })
})
