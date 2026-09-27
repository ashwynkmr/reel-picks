# Problem and opportunity

> Status: hypotheses from personal experience and informal conversations, not validated research.
> Section 6 lists how each would be tested.

## 1. The problem

The average US household pays for several streaming services, yet "what should we watch?" still takes
longer than it should. The failure is not a lack of options; it is too many options spread across
apps that each only show their own library.

**The moment we care about:** it's 9pm, one or two people are on the couch, everyone is a bit tired,
and nobody wants to be the one who picks. They scroll Netflix, then Prime, then give up and rewatch
something familiar, or put on nothing at all.

## 2. Who it's for

| Persona                   | Situation                                                 | What they need                                              |
| ------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| **The couch negotiator**  | Picking with a partner or roommate; two people, two moods | A neutral tie-breaker so nobody has to "own" the choice     |
| **The tired scroller**    | Alone, low energy, subscribed to 3 or more services       | One confident suggestion, not another grid of 40 posters    |
| **The classics catch-up** | Knows there are famous films they've never seen           | A nudge toward something great they actually have access to |

**Job to be done:** _"When I have a free evening and can't decide, help me commit to a good movie I
already have access to, fast, so I can stop choosing and start watching."_

## 3. Why existing options fall short

| Option                            | What it does well                    | Gap for this moment                                                          |
| --------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| Each streaming app's home screen  | Personalised rows, autoplay previews | Only shows its own library; optimised for time-in-app, not time-to-decision  |
| Aggregators (JustWatch, Reelgood) | Accurate cross-platform availability | Built for search and browse; you still have to choose from a long list       |
| Single-app shuffle buttons        | One tap to a random title            | Locked to one service; random across everything, including things you'd skip |
| Letterboxd, IMDb lists            | Great taste signals and ratings      | No sense of what you can watch tonight on your subscriptions                 |
| Asking a friend / group chat      | Trusted, personal                    | Slow, and they don't know what you subscribe to                              |

**The opening:** nobody combines _your_ subscriptions + a _mood_ + a _single committed pick_ + a bit of
fun. Reel Picks deliberately gives you one answer, not a list.

## 4. Product principles

1. **One answer, not a list.** Showing more options recreates the problem.
2. **Enough info to say yes in 10 seconds:** rating, a spoiler-free synopsis, a trailer.
3. **Make choosing fun.** The spin is the product. It turns a chore into a small moment of anticipation.
4. **Honest about limits.** Availability data goes stale; say when it was captured.

## 5. Success metrics (if this were a real product)

v1 ships with **no analytics**, on purpose (see [ADR 0001](../decisions/0001-static-curated-catalogue.md)).
These are the metrics I would instrument first, with privacy-friendly, cookieless counters:

| Metric                              | Why it matters                                 | Early target  |
| ----------------------------------- | ---------------------------------------------- | ------------- |
| Time from page load to first card   | The core promise: decide fast                  | < 10 s median |
| Spins per session                   | 1-3 is healthy; 8+ means picks aren't landing  | median ≤ 3    |
| Trailer click-through from the card | Proxy for "this pick was interesting"          | > 35%         |
| Empty-state rate                    | How often filters lead nowhere (catalogue gap) | < 2% of spins |
| 7-day return rate                   | Did it become the household habit?             | > 20%         |

**Counter-metric:** spins per session should not be pushed down by removing choice. If users re-spin a
lot, the fix is better picks, not hiding the lever.

## 6. Riskiest assumptions and how to test them

| Assumption                                                  | Risk if wrong                                | Cheapest test                                                |
| ----------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| People want one pick, not a shortlist                       | Users re-spin endlessly or leave             | Watch 5 people use it; count spins before they commit        |
| A curated list of ~150 films is enough variety              | Repeats feel stale by week two               | Track repeat-pick rate; coverage grid in CI flags thin cells |
| Platform availability from a manual snapshot is good enough | User clicks through and the film isn't there | Data-correction issue template; measure reports per month    |
| The playful 80s theme helps rather than slows people down   | Delight turns into friction                  | Time-to-first-card with and without the spin animation (A/B) |

## 7. Known gaps (found while building)

- **Classics are concentrated on HBO Max, Disney+ and Hulu.** Netflix owns one classic in the
  catalogue (Klaus) and Apple TV none, so "Apple TV + Classics" returns nothing. This is a real
  market fact, not a data bug; the empty state explains it and offers to add a platform. (Found by
  the coverage grid in Phase 0; still true at 154 films.)
- **Availability rotates monthly** for licensed titles. Mitigated by favouring originals and
  studio-owned films ([ADR 0005](../decisions/0005-prefer-owned-titles.md)).
- **US only.** Rights differ by country; international support would need a data source per region.
