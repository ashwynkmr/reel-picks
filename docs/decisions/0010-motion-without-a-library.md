# 0010. Build the reveal with CSS keyframes and a phase timer, not an animation library

- **Status:** Accepted (updates [ADR 0002](0002-react-vite-github-pages.md), which planned a motion library)
- **Date:** 2026-09-27

## Context

The reveal is the product's dopamine moment: pull the lever, the reel spins and slows onto the pick,
a clapperboard snaps, the card lands. ADR 0002 assumed a motion library (Framer Motion) for this.
Once the Phase 2 design put the result on the screen rather than in a modal, the tricky part (a
shared-layout morph from reel to card) disappeared. What's left is a fixed sequence of timed
effects.

## Decision

- The picker hook runs a small phase machine: `idle → rolling → slating → showing`. The pick is
  decided the moment the lever is pulled; phases are presentation only.
- Each phase's visuals are CSS keyframes (transform, opacity, filter) with durations passed in as CSS
  custom properties from the same timing constants the hook uses, so they can't drift apart.
- **Timing budget:** 2.4 s roll + 0.65 s slate ≈ 3 s from pull to card, inside the 10-second
  time-to-decision goal ([metrics](../product/problem-and-opportunity.md#5-success-metrics-if-this-were-a-real-product)).
- **Always interruptible:** Skip button, pulling the lever again, or Space jumps to the card; Esc or
  any filter change cancels. Every pending timer is cleared on interruption and unmount.
- **Reduced motion:** users with `prefers-reduced-motion` get the card immediately (no roll, no slate),
  and the setting is tracked live.

## Consequences

- **Gained:** zero added bundle size (a motion library is ~30-40 KB gzipped, a third of the current
  app); animations run on the compositor; the sequence is unit-tested with fake timers.
- **Gave up:** physics-based springs and gesture-driven motion (for example, dragging the lever).
  Revisit if the lever should follow a finger.
- **Watch:** if "spins per session" is high, a 3-second reveal might become a tax on re-spins. The
  skip affordance is the first mitigation; shortening the re-spin roll is the next.
