# 0004. Model "Classics" as a flag on top of genres

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

Users asked for a "Classics" category alongside the five genres: IMDb Top 250 calibre films.
But a classic is not a genre. _The Matrix_ is sci-fi **and** a classic; _Casablanca_ is drama **and**
a classic.

## Decision

`classic: boolean` on each movie. In the UI, Classics appears as a sixth option in the genre row
(that's how users think about it), but under the hood it filters on the flag, not on `genres`.

## Consequences

- **Gained:** a classic still appears when someone picks its real genre. No duplicate entries.
- **Gave up:** a small mismatch between UI (one row of six) and data (five genres + a flag),
  documented here and in `src/domain/catalogue.ts`.
- **Criteria for "classic":** in or near the IMDb Top 250 at the snapshot date, or widely treated as
  canonical. Judgement call, reviewed in PRs.
