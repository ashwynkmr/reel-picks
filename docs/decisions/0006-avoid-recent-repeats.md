# 0006. Avoid repeating the last five picks

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

"Spin again" is the most-used action after the first pick. With true randomness, a pool of 20 films
repeats one of the last five picks about a quarter of the time. People read that as the app being
broken or lazy, even though it is statistically fair. Music apps faced the same complaint about
shuffle and made it deliberately less random.

## Decision

Exclude the last 5 picks from the pool. If a filter combination is so thin that every film is
recent, fall back to excluding only the immediately previous pick. With one matching film, allow the
repeat rather than showing nothing.

## Consequences

- **Gained:** spins feel fresh for a whole evening; a thin shelf still works.
- **Gave up:** strict uniform randomness, which nobody asked for.
- **Not persisted:** history resets on reload. Remembering picks across nights is a watchlist-shaped
  feature and out of scope for v1.
- **Tuning:** `RECENT_PICKS_TO_AVOID` in `src/domain/picker.ts`. The "spins per session" metric would
  tell us if 5 is right.
