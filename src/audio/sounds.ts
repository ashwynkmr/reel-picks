/**
 * Synthesized sound effects (ADR 0011). Everything is generated with the
 * Web Audio API: no audio files to license, host or download, and the
 * sounds can follow the animation exactly (the sprocket clatter slows down
 * as the reel does).
 *
 * All functions are safe to call where Web Audio doesn't exist (tests,
 * very old browsers): they simply do nothing.
 */

let context: AudioContext | null = null

/** Lazily creates the shared AudioContext. Browsers only allow this after a user gesture, which the lever is. */
function audio(): AudioContext | null {
  if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return null
  context ??= new window.AudioContext()
  if (context.state === 'suspended') void context.resume()
  return context
}

let noise: AudioBuffer | null = null

/** One second of white noise, reused as the raw material for clicks and cracks. */
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noise) return noise
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return noise
}

/**
 * When each sprocket click happens during a roll, in ms from the start.
 * The film starts fast (a click every ~35 ms) and slows to a crawl, easing
 * out like the reel animation, so sound and picture decelerate together.
 */
export function sprocketTimes(durationMs: number): number[] {
  const times: number[] = []
  const fastest = 35
  const slowest = 190
  let t = 0
  while (t < durationMs) {
    times.push(t)
    const progress = t / durationMs
    t += fastest + (slowest - fastest) * progress ** 2.2
  }
  return times
}

/** A short burst of filtered noise with a fast decay: the building block of clicks and cracks. */
function burst(ctx: AudioContext, out: AudioNode, at: number, length: number, gain: number, freq: number) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = freq
  filter.Q.value = 1.2
  const env = ctx.createGain()
  env.gain.setValueAtTime(gain, at)
  env.gain.exponentialRampToValueAtTime(0.0001, at + length)
  src.connect(filter).connect(env).connect(out)
  src.start(at, Math.random() * 0.5, length + 0.02)
}

/**
 * The projector running: a low motor hum plus sprocket clatter, both
 * slowing down over `durationMs`. Returns a function that stops it early
 * (skip, cancel, mute).
 */
export function startWhir(durationMs: number): () => void {
  const ctx = audio()
  if (!ctx) return () => {}
  const now = ctx.currentTime
  const end = now + durationMs / 1000

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(0.55, now + 0.08)
  master.gain.setValueAtTime(0.55, end - 0.4)
  master.gain.exponentialRampToValueAtTime(0.0001, end + 0.15)
  master.connect(ctx.destination)

  // Motor: a soft sawtooth hum that drops in pitch as the reel slows.
  const motor = ctx.createOscillator()
  motor.type = 'sawtooth'
  motor.frequency.setValueAtTime(72, now)
  motor.frequency.exponentialRampToValueAtTime(38, end)
  const motorTone = ctx.createBiquadFilter()
  motorTone.type = 'lowpass'
  motorTone.frequency.value = 260
  const motorLevel = ctx.createGain()
  motorLevel.gain.value = 0.12
  motor.connect(motorTone).connect(motorLevel).connect(master)
  motor.start(now)
  motor.stop(end + 0.2)

  // Sprockets: clicks on the same easing as the picture.
  for (const ms of sprocketTimes(durationMs)) burst(ctx, master, now + ms / 1000, 0.018, 0.35, 2600)

  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    const t = ctx.currentTime
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), t)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)
    motor.stop(t + 0.1)
    window.setTimeout(() => master.disconnect(), 200)
  }
}

/** The clapperboard: a sharp wooden crack with a little body underneath. */
export function clap(): void {
  const ctx = audio()
  if (!ctx) return
  const now = ctx.currentTime
  burst(ctx, ctx.destination, now, 0.07, 0.9, 1800)
  burst(ctx, ctx.destination, now + 0.004, 0.04, 0.6, 4200)

  const body = ctx.createOscillator()
  body.type = 'sine'
  body.frequency.setValueAtTime(180, now)
  body.frequency.exponentialRampToValueAtTime(60, now + 0.09)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.35, now)
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
  body.connect(env).connect(ctx.destination)
  body.start(now)
  body.stop(now + 0.15)
}

/** A soft rubber-stamp thud for the IMDb seal landing on the card. */
export function thud(): void {
  const ctx = audio()
  if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(110, now)
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.14)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.4, now)
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
  osc.connect(env).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.2)
}
