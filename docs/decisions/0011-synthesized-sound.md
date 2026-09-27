# 0011. Synthesize sound effects in code; on by default with a remembered mute

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

Sound was requested as part of the fun: a projector whir during the spin and a clapper snap on the
reveal. Options:

1. **Audio files** (stock or recorded): realistic, but need licensing, hosting and a download
   before the first spin, and they play at a fixed speed regardless of the animation.
2. **Synthesized with the Web Audio API:** generated at runtime from oscillators and filtered noise.

## Decision

Synthesize all three sounds (whir, clap, seal thud) in `src/audio/sounds.ts`, driven by the reveal
phase so they can't drift out of sync. The sprocket clicks use the same deceleration curve as the
reel, so the sound slows down with the picture.

**On by default,** because sound is part of the dopamine hit the product is built around. The
choice is remembered. Browsers only allow audio after a user gesture, and the lever pull is one,
so nothing ever plays on page load.

## Consequences

- **Gained:** 0 KB of audio assets, nothing to license, sound matched frame-for-frame to the
  animation, and it degrades to silence where Web Audio is missing.
- **Gave up:** realism. A recorded projector would sound richer.
- **Risk:** sound on by default can surprise someone in a quiet room. Mitigations: nothing plays
  until they pull the lever, the toggle is always visible, and it remembers "off". If this app had
  analytics, the mute rate would tell us whether the default is right.
