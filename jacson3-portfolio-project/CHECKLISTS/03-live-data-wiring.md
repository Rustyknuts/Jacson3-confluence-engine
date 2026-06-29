# Phase 3 — Live Data Wiring

Goal: the dashboard stops reading a static export and starts reading something that updates. Pick Path A or Path B below — don't build both.

**How to work this checklist with Claude:** this phase involves real credentials (Google Sheets API access, possibly a webhook endpoint). Claude should never see or handle your actual API keys/secrets in chat — see the "Secrets" note in `FOLDER_STRUCTURE.md`. Have Claude write the code that *reads* a credential from an environment variable or local config file; you fill in the actual value yourself, outside the conversation.

## Decide the path first

- [ ] Path A (Google Sheets API, read-only) or Path B (webhook → intermediary)? Write your decision here: ________
- [ ] If Path A: confirm the `TV_Imports` tab in Master_Watchlist is actually receiving the TradingView CSV exports on a real cadence (manual upload is fine for now — just confirm it's happening)
- [ ] If Path B: confirm Phase 2's webhook is firing reliably first — this path inherits all of Phase 2's risk plus more

## Path A steps (if chosen)

- [ ] Create a Google Cloud service account (or use an existing one) with read-only access to the specific Sheet — not broader Drive access
- [ ] Store the service account credentials file locally, outside git (see `FOLDER_STRUCTURE.md` → `secrets/`)
- [ ] Write a small script (Python or Node) that reads Master_Watchlist via the Sheets API and outputs the same JSON shape the dashboard prototype currently expects
- [ ] Confirm the script's output timestamp matches the sheet's actual `Last Import Timestamp` column — this is the field the <1hr audit badge depends on
- [ ] Decide how the dashboard fetches this: a local script run on a schedule that writes a JSON file the dashboard reads, or a tiny local server the dashboard calls
- [ ] Test: change a price in the sheet, re-run the fetch, confirm the dashboard reflects it without manual data re-injection

## Path B steps (if chosen)

- [ ] Decide on the intermediary (Google Apps Script bound to the Sheet, a small serverless function, or similar)
- [ ] Confirm the intermediary can receive Phase 2's webhook payload and write it somewhere the dashboard can read
- [ ] Same final test as Path A: change something upstream, confirm it reaches the dashboard without manual intervention

## Either path

- [ ] Confirm the dashboard's freshness badge logic (already built — `AUDITED` / `STALE` / `NO DATA`) is reading the *real* import timestamp, not a client-side "page loaded" time
- [ ] Re-bundle the dashboard with esbuild (or equivalent) after adding the live-fetch code — keep the no-CDN-dependency rule from the prototype
- [ ] Leave the system running for at least a few hours and confirm the STALE counter actually changes state on its own as data ages — this is the real proof the audit logic works end-to-end, not just in a single test

## Sign-off

- [ ] Dashboard has shown both an AUDITED and a STALE state for the same asset, naturally, without you forcing it
- [ ] Update `DEVELOPMENT_PLAN.md`'s "Current Phase" line to Phase 4
