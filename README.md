# Reel Picks

[![CI](https://github.com/ashwynkmr/reel-picks/actions/workflows/ci.yml/badge.svg)](https://github.com/ashwynkmr/reel-picks/actions/workflows/ci.yml)
[![Deploy](https://github.com/ashwynkmr/reel-picks/actions/workflows/deploy.yml/badge.svg)](https://github.com/ashwynkmr/reel-picks/actions/workflows/deploy.yml)

**Pick your streaming services and a mood, pull the lever, get one movie.**
An 80s movie-palace themed picker that ends "what do we watch tonight?" in under 10 seconds.

**Live:** https://ashwynkmr.github.io/reel-picks/ · **Case study:** [how it was scoped, designed and shipped](docs/CASE_STUDY.md)

![The Reel Picks lobby: a bulb-lit marquee between two poster cases, a box office of admission tickets, a film vault of labelled cans, and a silver screen showing a film-leader countdown](docs/design/screenshots/lobby.jpg)

![The spin: pull the lever, the reel races and slows onto a film, the clapperboard snaps, the card lands](docs/design/screenshots/spin.gif)

| The pick lands on the screen                                                                                                           | Nothing matches? Intermission, with a fix                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Result card for Joker with a generated poster, clapperboard slate, IMDb seal and trailer ticket](docs/design/screenshots/reveal.jpg) | ![Intermission card saying Netflix has no classics, with buttons to add HBO Max, add Disney+ or try any genre](docs/design/screenshots/empty-state.jpg) |

> Built in public as a product case study: every phase shipped through a reviewed PR with its
> reasoning. Start with the [case study](docs/CASE_STUDY.md), then the
> [problem](docs/product/problem-and-opportunity.md), the [PRD](docs/PRD.md) and the
> [decision log](docs/decisions/README.md).

| Lighthouse (production) | Performance | Accessibility | Best practices | SEO |
| ----------------------- | ----------- | ------------- | -------------- | --- |
| Mobile                  | 97          | 100           | 100            | 100 |
| Desktop                 | 100         | 100           | 100            | 100 |

---

## The problem

US households pay for several streaming services, but each app only shows its own library and is
tuned to keep you browsing. Aggregators fix availability but hand you another long list. The result
is 20 minutes of scrolling and a rewatch of something familiar.

**Job to be done:** _when I can't decide, help me commit to a good movie I already have access to,
fast, so I can stop choosing and start watching._

## The product bet

| Principle                 | What it means in the product                                      |
| ------------------------- | ----------------------------------------------------------------- |
| One answer, not a list    | The reel lands on a single film. Want another? Pull again.        |
| Enough to say yes in 10 s | IMDb rating, a spoiler-free synopsis, a trailer. Nothing else.    |
| Make choosing fun         | The spin is the product: a small dopamine hit instead of a chore. |
| Honest about limits       | Availability is a dated snapshot, and the app says so.            |

## Key decisions and tradeoffs

| Decision                                                                                           | Tradeoff                                                                                              |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [Hand-curated catalogue, no live API](docs/decisions/0001-static-curated-catalogue.md)             | No backend or keys, every film worth watching; availability can drift, so the snapshot date is shown. |
| [Prefer originals and studio-owned films](docs/decisions/0005-prefer-owned-titles.md)              | Snapshot stays accurate for longer; Netflix and Apple TV end up with almost no classics.              |
| [Classics as a flag, not a genre](docs/decisions/0004-classics-as-a-flag.md)                       | A classic still appears under its real genre; small UI/data mismatch, documented.                     |
| [Trailer links via YouTube search](docs/decisions/0003-trailer-search-links.md)                    | Never a dead link; one extra click when no verified id exists.                                        |
| [React + Vite on GitHub Pages](docs/decisions/0002-react-vite-github-pages.md)                     | Easy reel-to-card animation and typed data; costs a build step and ~75 KB.                            |
| [Skip the last five picks on re-spin](docs/decisions/0006-avoid-recent-repeats.md)                 | Spins feel fresh; gives up strict randomness, which nobody wanted.                                    |
| [Empty states offer a one-tap fix](docs/decisions/0007-empty-states-offer-a-fix.md)                | No dead ends; suggesting other services could read as an upsell.                                      |
| [Show the result on the screen, not a modal](docs/decisions/0008-reveal-on-the-screen.md)          | Filters and lever stay in reach; custom focus management replaces the dialog's built-in trap.         |
| [Self-host fonts](docs/decisions/0009-self-host-fonts.md)                                          | No third-party requests; a slightly larger bundle.                                                    |
| [Reveal with CSS keyframes, no animation library](docs/decisions/0010-motion-without-a-library.md) | 0 KB added and compositor-smooth; no physics springs or drag gestures.                                |
| [Synthesized sound, on by default](docs/decisions/0011-synthesized-sound.md)                       | No audio files or licensing, synced to the animation; less realistic than recordings.                 |

## What I'd measure

No analytics in v1, by choice. First metrics to add: time from load to first card (< 10 s),
spins per session (≤ 3 median), trailer click-through (> 35%), and empty-state rate (< 2%).
Details and the riskiest assumptions: [problem and opportunity](docs/product/problem-and-opportunity.md#5-success-metrics-if-this-were-a-real-product).

## Roadmap

| Phase | Scope                                                        | Status |
| ----- | ------------------------------------------------------------ | ------ |
| 0     | Scaffold, CI/CD, curated catalogue + validator, product docs | Done   |
| 1     | Working picker: filters, no-repeat random pick, result card  | Done   |
| 2     | 80s look: marquee, ticket and film-can filters, projector    | Done   |
| 3     | Motion: film-strip spin, lever, clapperboard reveal          | Done   |
| 4     | Polish: mobile, accessibility, sound, ~150 films, launch     | Done   |

v1.0 is shipped. What I'd build next is in the [case study](docs/CASE_STUDY.md#8-whats-next).

Changes per phase: [CHANGELOG](CHANGELOG.md). How the look evolved, including a rejected first
mockup: [design notes](docs/design/README.md).

## Catalogue

154 hand-picked films, US availability as of 2026-09-27, across Netflix, Prime Video, HBO Max,
Disney+, Hulu and Apple TV. `npm run validate:data` checks every record and prints a coverage grid
of films per platform and genre:

```
platform   classics   action   comedy    drama thriller    scifi
netflix          1!        8       11       11       11        7
prime             6       10        7       12        9        5
max              15       10        8        8       12        8
disney           18       17       14        9        4       13
hulu             10        8       13       15       12       10
appletv          0!        7        5       11        3        3
```

The two `!` cells are real market gaps, not missing data: Netflix and Apple TV own almost no
catalogue classics. The app says so and offers a one-tap fix
([ADR 0007](docs/decisions/0007-empty-states-offer-a-fix.md)).

Spot a film that moved platforms? [Open a catalogue correction](https://github.com/ashwynkmr/reel-picks/issues/new?template=data_correction.yml).

## Tech

React 19, TypeScript (strict), Vite, Vitest, oxlint, Prettier. Plain CSS with design tokens, no UI
framework; self-hosted fonts. GitHub Actions runs lint, format, typecheck, unit and integration tests
(Testing Library), an axe-core accessibility audit, data validation and a build on every PR, and
deploys `main` to GitHub Pages.

```
src/
  domain/      Pure logic: types, filtering, no-repeat picking, validation, links (unit-tested)
  hooks/       usePicker (filters, pick, reveal phases), useRevealSounds, usePersistentState, ...
  audio/       Synthesized projector whir, clapper and seal thud (Web Audio API)
  components/  Box office, film vault, theater + projector lever, reel spinner, slate, result card
    decor/     Curtains, film strip, set props (purely decorative, aria-hidden)
  styles/      Design tokens and base styles
  data/        catalogue.json, the curated movie list
scripts/       validate-catalogue.ts (CLI used in CI)
docs/          PRD, problem and opportunity, decision log, design notes + mockup
```

## Run locally

Requires Node 22.18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # everything CI runs
npm run build && npm run preview   # the production build at http://localhost:4173/reel-picks/
```

## License

[MIT](LICENSE)
