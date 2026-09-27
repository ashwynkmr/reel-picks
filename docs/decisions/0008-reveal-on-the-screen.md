# 0008. Show the result on the silver screen, not in a modal

- **Status:** Accepted (supersedes the modal `<dialog>` from Phase 1)
- **Date:** 2026-09-27

## Context

Phase 1 showed the pick in a native modal dialog: free focus trapping and Esc handling. The Phase 2
design puts a silver screen at the centre of the page, and a modal on top of it would hide the very
thing the metaphor is built around. A modal also hides the filters and the lever, which are the next
two things a user touches ("spin again" or "change filters").

## Decision

Render the result inside the screen, in the page flow.

- On each pick the screen scrolls into view and focus moves to the film title, so screen readers
  announce it.
- Esc clears the screen and returns focus to the lever.
- **Changing any filter clears the screen.** A card picked under the old filters would otherwise sit
  there while the counts and lever reflect new ones.

## Consequences

- **Gained:** the result lives where films live; filters and lever stay visible, so the loop
  (pull → read → pull again) is one tap; it sets up Phase 3, where the reel spins on the same screen.
- **Gave up:** the dialog's built-in focus trap and backdrop. Replaced by explicit focus management,
  covered by integration tests and the axe audit.
