# Reel Picks: product requirements

- **Owner:** [@ashwynkmr](https://github.com/ashwynkmr)
- **Last updated:** 2026-09-27
- **Status:** In development (see [roadmap](#development-phases))

Background, personas and competitive gaps: [problem and opportunity](product/problem-and-opportunity.md).
Decisions and tradeoffs: [decision log](decisions/README.md).

## Overview

Reel Picks is a one-screen web app that answers "what do we watch tonight?" in under 10 seconds.
You choose the streaming platforms you have and the genre you're in the mood for, pull a lever, and a
film reel spins and lands on one movie. The winner opens as an expanded card with its IMDb rating, a
short synopsis and a trailer link. The function is simple on purpose; the value is the moment of the
reveal, styled like an 80s movie palace.

## Goals

- Pick a movie in 3 interactions or fewer: platform, genre, pull.
- Make the reveal feel rewarding: a ~2.5 s spin, then a satisfying card expansion.
- Show the three things needed to decide: IMDb rating, 2-3 sentence synopsis, trailer link.
- Carry a warm, muted 80s cinema look without feeling like a costume.
- Work well on a phone as well as a laptop.

## Non-goals (v1)

- No accounts, watchlists or rating history.
- No live availability API; the catalogue is curated by hand ([ADR 0001](decisions/0001-static-curated-catalogue.md)).
- No embedded trailer playback; the trailer opens on YouTube.
- No recommendation engine; the pick is random within the filters.
- US only.

## Core user flow

1. **Platforms:** tick one or more (remembered next visit).
2. **Genre:** pick one of Action, Comedy, Drama, Thriller, Sci-Fi, Classics, or "Any".
3. **Pull the lever** (or press Space).
4. **Reel spins** for about 2.5 s and stops on a film.
5. **Card expands** with the details. From here: watch the trailer, spin again (same filters), or change filters.

If nothing matches, the lever jams with a "No reels in the can" message and a suggestion to widen the filters.

## Functional requirements

| Area            | Requirement                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform filter | Multi-select; at least one stays on. A film qualifies if it streams on any selected platform. Netflix, Prime Video, HBO Max, Disney+, Hulu, Apple TV. |
| Genre filter    | Single-select plus "Any". Action, Comedy, Drama, Thriller, Sci-Fi, and Classics ([ADR 0004](decisions/0004-classics-as-a-flag.md)).                   |
| Picker          | Random pick from the filtered set; never repeats any of the last 5 picks while alternatives remain.                                                   |
| Empty state     | Blocks the spin, explains why, suggests which filter to widen.                                                                                        |
| Result card     | Shown on the silver screen (ADR 0008): generated poster, title, year, runtime, services, genres, classic badge.                                       |
| IMDb rating     | Score out of 10 with a star meter; stored snapshot, links to IMDb.                                                                                    |
| Synopsis        | 2-3 sentences, spoiler-free, max 280 characters.                                                                                                      |
| Trailer         | Opens the official trailer on YouTube in a new tab ([ADR 0003](decisions/0003-trailer-search-links.md)).                                              |
| Controls        | Spin again, change filters; Space to spin, Esc to close; full touch support.                                                                          |
| Sound           | Projector whir during the spin, clapper snap on reveal. On by default, mute toggle, preference remembered.                                            |
| Persistence     | Last platforms and mute setting saved in the browser.                                                                                                 |
| Accessibility   | Keyboard operable, visible focus, `prefers-reduced-motion` skips the spin, colour contrast AA.                                                        |

## Data

About 150 films in `src/data/catalogue.json`, blending classics, 2000s favourites and recent releases.
Schema and rules live in `src/domain/catalogue.ts` and are enforced by `npm run validate:data` in CI,
which also prints a platform x genre coverage grid to catch thin combinations.

## Design direction

A small-town movie palace in 1984: faded velvet, marquee bulbs, film cans and a big studio camera.
Muted and warm, not neon synthwave.

| Role             | Colour                      | Hex     |
| ---------------- | --------------------------- | ------- |
| Background       | Projection-booth charcoal   | #2B2622 |
| Surface          | Faded ticket cream          | #EFE4CF |
| Primary accent   | Dusty theatre-curtain red   | #A3453B |
| Secondary accent | Worn marquee mustard        | #D1A546 |
| Cool accent      | Faded teal (Kodak box edge) | #4F7A74 |
| Text on light    | Film-can brown              | #3A2E26 |

**Motifs:** marquee header with chasing bulbs; platforms as admission tickets; genres as film cans;
a projector with a pull lever; posters blurring past in a vertical film strip; the result card snaps
open like a clapperboard into a script-page card; light grain and vignette.

**Motion:** one hero animation per pick (spin ~2.5 s, card ~0.5 s spring); everything else under 250 ms.

## Development phases

| Phase | Scope                                                                                  | Gate                                         | Status  |
| ----- | -------------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| 0     | Scaffold, tooling, CI/CD, curated catalogue, validator, product docs                   | Every record valid; coverage grid reviewed   | Done    |
| 1     | Filters, `usePicker` hook, no-repeat history, plain result card, empty state, keyboard | Works end to end, unstyled                   | Done    |
| 2     | 80s look: palette, type, marquee, tickets, film cans, projector, grain                 | Look signed off                              | Done    |
| 3     | Motion: film-strip spin, lever pull, clapperboard card, reduced-motion                 | Spin-to-card feels right on phone and laptop | Next    |
| 4     | Mobile polish, accessibility pass, sounds, catalogue to ~150, launch                   | Lighthouse a11y ≥ 95; shared publicly        | Planned |
