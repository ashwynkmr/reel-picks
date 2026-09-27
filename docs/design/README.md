# Design

The approved Phase 2 mockup is [`phase-2-mockup.html`](phase-2-mockup.html) (open it in a browser).
Screenshots of the shipped app are in [`screenshots/`](screenshots/).

## Concept: the page is a 1984 movie palace

Each part of the product maps to a place in the theatre, so the metaphor explains the interface:

| Product job             | Theatre element                          | Why it fits                                |
| ----------------------- | ---------------------------------------- | ------------------------------------------ |
| Brand, first impression | Bulb-lit marquee + lit poster cases      | The first thing you see outside any cinema |
| Choose your services    | Box office window of admission tickets   | Services are literally what gets you in    |
| Choose a mood           | Film vault: cans on shelves, with counts | You're picking which reels to load         |
| Commit (the lever)      | Projector in the booth, beam to screen   | Pulling the lever "rolls film"             |
| The result              | The silver screen                        | The answer appears where films appear      |
| Nothing matches         | "Intermission" title card                | A pause, not an error                      |
| Data freshness, credits | End credits on theatre carpet            | Where the fine print belongs               |

## How the design got here

1. **v1 mockup:** a themed form: tickets, film cans and a projector on plain background. Reviewed and
   **rejected**: "needs more detail, the whitespace looks bland, not fun and classy yet."
2. **Diagnosis:** v1 decorated the controls but not the space. The empty page between them was the
   problem, and the fix was a stronger concept, not more ornaments.
3. **v2 mockup:** the whole page became the theatre (table above). Curtains frame the viewport, the
   filters became places, and the result moved onto the screen. **Approved.**
4. **Build:** implemented as React components with the mockup as the visual spec, then checked at
   1280, 1024 and 390 px, with automated accessibility audits and contrast checks.

## Principles

- **Muted, warm, classy.** Faded velvet and brass, not neon synthwave. All colours are tokens in
  [`src/styles/tokens.css`](../../src/styles/tokens.css); components never hard-code hex values
  outside decorative illustration.
- **One strong accent per area.** Mustard marks "selected" everywhere (tickets, cans); curtain red
  marks the primary action (lever knob, trailer ticket).
- **Real controls under the costume.** Tickets are checkboxes, cans are radio buttons, the projector
  is a button. The theme never replaces platform semantics.
- **Ambient motion is gentle and optional.** Bulbs chase, searchlights sway, reels turn, dust drifts
  in the beam. All of it stops under `prefers-reduced-motion`.
- **One big moment.** The spin is the only long animation, it's around 3 seconds, and it's always skippable.
- **No copyrighted imagery.** Posters are generated "lobby cards" styled by genre.

## The reveal (Phase 3)

![The spin: the reel races through the projector gate, slows onto a film, the clapperboard snaps and the card lands](screenshots/spin.gif)

| Beat  | Duration | What happens                                                                                     |
| ----- | -------- | ------------------------------------------------------------------------------------------------ |
| Pull  | instant  | Lever snaps down, reels race, lamp brightens, beam flickers, marquee bulbs speed up              |
| Roll  | 2.4 s    | 16 frames from the current pool blur through the gate, decelerate, overshoot slightly and settle |
| Slate | 0.65 s   | Clapperboard marked with scene (mood) and take (pick number) claps shut with a white sync flash  |
| Land  | 0.5 s    | Card settles onto the screen, poster drops in, IMDb seal stamps down                             |

Skippable at any point (Skip, the lever, Space); cancelled by Esc or any filter change. Reduced-motion
users go straight to the card. Why no animation library: [ADR 0010](../decisions/0010-motion-without-a-library.md).

## Type

| Role          | Face              | Used for                                       |
| ------------- | ----------------- | ---------------------------------------------- |
| Display       | Limelight         | Marquee, signs, film titles                    |
| Script accent | Yellowtail        | Flourishes: "the picture show", "Intermission" |
| Labels        | Special Elite     | Tickets, can labels, slate, buttons            |
| Reading       | Libre Baskerville | Synopsis and body text                         |

All four are self-hosted ([ADR 0009](../decisions/0009-self-host-fonts.md)).

## Accessibility checks

- axe-core audit of the idle, result and empty states in CI (`src/a11y.test.tsx`).
- Contrast of every text/background pair checked against WCAG AA (4.5:1); the box office teal was
  darkened a shade to pass.
- Focus moves to the film title on each pick so screen readers announce it; Esc clears the screen
  and returns focus to the lever.
