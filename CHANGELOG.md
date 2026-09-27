# Changelog

All notable changes, grouped by development phase. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [0.4.0] - 2026-09-27 - Phase 3: the reveal

### Added

- The spin: 16 frames from the current pool race through the projector gate with motion blur,
  decelerate, overshoot slightly and settle on the pick (2.4 s).
- Clapperboard snap between spin and card, marked with scene and take, with a sync flash (0.65 s).
- Card landing: the card settles, the poster drops in, the IMDb seal stamps down.
- While spinning: lever held down, reels race, lamp brightens, beam flickers, marquee bulbs speed up.
- Skip at any time with the Skip button, the lever or Space; Esc or a filter change cancels.
- Reduced-motion users get the card instantly; the OS setting is tracked live.
- Phase machine in `usePicker` with cancellable timers; `buildReel` domain function; fake-timer
  tests for the whole sequence (46 tests total). Spin GIF in the README.

### Changed

- ADR 0010 replaces the planned animation library with CSS keyframes (0 KB added).

### Fixed

- Poster cases beside the marquee overlapped between 900 and 1100 px wide (PR #4).

## [0.3.0] - 2026-09-27 - Phase 2: the movie palace

### Added

- 1984 movie-palace theme from the approved mockup (`docs/design/`): velvet curtains, bulb-lit
  marquee with searchlights and poster cases, film-strip divider, theatre-carpet end credits.
- Box office of admission tickets for services; film vault of labelled cans for moods.
- Silver screen with a film-leader countdown, projector beam over a row of seats, and a projector
  whose lever is the main button. It jams, with the lamp out, when nothing matches.
- Result on the screen: generated genre-styled lobby card, clapperboard slate with scene and take,
  IMDb seal, trailer link styled as an admission ticket.
- "Intermission" title card for the empty state.
- Design tokens (`src/styles/tokens.css`) and self-hosted fonts (ADR 0009).
- axe-core accessibility audit of every screen state; README screenshots.

### Changed

- Result moved from a modal dialog onto the screen (ADR 0008).
- Changing any filter now clears the screen, so a stale pick never sits beside new counts.

### Fixed

- Screen readers heard "Classics1 reel" on film cans; now "Classics, 1 reel".
- Box office text contrast raised to WCAG AA.

## [0.2.0] - 2026-09-27 - Phase 1: core picker

### Added

- Platform filter (multi-select, remembered between visits, can't switch off the last one).
- Genre filter with Any, five genres and Classics, each showing how many films it would draw from.
- Random pick that avoids the last five picks (ADR 0006), via a `usePicker` hook over pure logic.
- Result card in a native modal `<dialog>`: rating with star meter, synopsis, genres, services,
  trailer and IMDb links. Esc closes; focus starts on "Watch the trailer".
- Empty state that names the gap and offers one-tap fixes: add a service or try any genre (ADR 0007).
- Space pulls the lever from anywhere that doesn't already use Space.
- Footer with the availability snapshot date and a link to report a film that moved.
- Integration tests for the full flow with Testing Library (32 tests total).

## [0.1.0] - 2026-09-27 - Phase 0: setup and data

### Added

- Vite + React 19 + strict TypeScript scaffold, oxlint, Prettier, Vitest.
- Domain model for movies, platforms and genres (`src/domain/catalogue.ts`).
- Curated catalogue of 76 films across 6 US platforms, with IMDb ratings and spoiler-free synopses.
- Catalogue validator with unit tests, plus a CLI that prints a platform x genre coverage grid.
- Trailer and IMDb link helpers with search fallbacks.
- CI (lint, format, typecheck, tests, data validation, build) and GitHub Pages deploy.
- Product docs: PRD, problem and opportunity, decision log (ADRs 0001-0005).
- Issue templates for features (problem-first), bugs and catalogue corrections; PR template.

### Found

- Coverage grid shows Netflix and Apple TV have no classics, Prime has one sci-fi film and Apple TV
  one thriller. Classics gap is structural (ADR 0005); the others get filled in Phase 4.
