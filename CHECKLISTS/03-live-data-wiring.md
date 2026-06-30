# Phase 3 — Live Data Wiring

Goal: the dashboard stops reading a static export and starts reading something that updates.

**Path decided: Path A — Google Apps Script + TV_Imports tab.** Claude Code built this in the session ending 2026-06-30. Scripts delivered: `scripts/tv-import.gs` (the import engine) and `scripts/TV_Imports_schema.md` (XLOOKUP templates and schema reference). No need to revisit Path B.

**How to work this checklist with Claude:** this phase involves real credentials (Google Sheets API access). Claude should never see or handle your actual API keys/secrets in chat — see the "Secrets" note in `FOLDER_STRUCTURE.md`.

## Step 1 — Install the Apps Script (you, not Claude)

- [ ] **Confirm ticker format first:** open Master_Watchlist column A and confirm tickers are bare (e.g. `MEL`, `AAPL`) not exchange-prefixed (e.g. `NZX:MEL`). If bare: `STRIP_EXCHANGE_PREFIX = true` (the default) is correct. If prefixed: flip it to `false` in `tv-import.gs` before installing.
- [ ] Open Master_Watchlist in Google Sheets → Extensions → Apps Script
- [ ] Paste the full contents of `scripts/tv-import.gs` and save
- [ ] Reload the Sheet — confirm a "Jacson3 Portfolio" menu appears in the menu bar
- [ ] Run "Import TradingView CSV…" from that menu and confirm the HTML dialog appears (660×500px, paste-from-clipboard UX)

## Step 2 — First real import

- [ ] In TradingView: open the Screener, add the required columns per `scripts/TV_Imports_schema.md` (exact column names matter — alias tolerance is explained in the schema doc)
- [ ] Export the Screener as CSV, paste the contents into the import dialog
- [ ] Confirm the TV_Imports tab was created with correct headers (columns A–H per the schema)
- [ ] Confirm the `Import_Timestamp` column is populated with a single timestamp across all rows (not per-row varying times)
- [ ] Confirm exchange prefixes were stripped correctly — `NZX:MEL` should appear as `MEL` in the Ticker column

## Step 3 — Post-import verification (Claude Code's 10-item checklist from TV_Imports_schema.md)

*Copy these items into this checklist once the schema doc is accessible — they live in `scripts/TV_Imports_schema.md` under "Post-import verification checklist."*

- [ ] All 10 post-import verification items from `scripts/TV_Imports_schema.md` confirmed ✓

## Step 4 — Wire XLOOKUP formulas into Master_Watchlist

- [ ] Paste the XLOOKUP templates from `scripts/TV_Imports_schema.md` into Master_Watchlist for: Last Close, ATR(14), RSI(14), per-row timestamp
- [ ] Confirm the batch `=MAX(TV_Imports!$A:$A)` formula for the freshness badge is in place
- [ ] Confirm the `<1hr` audit badge in column N reads the real import timestamp, not a client-side time
- [ ] Recalculate the workbook and confirm zero formula errors after wiring

## Step 5 — Dashboard wiring

- [ ] Write a small script (Python or Node) that reads Master_Watchlist via the Sheets API and outputs the same JSON shape the dashboard prototype currently expects — or use the TV_Imports tab directly
- [ ] Store Google Sheets API credentials in `secrets/` — never committed to git
- [ ] Re-bundle the dashboard with esbuild after adding the live-fetch code — keep the no-CDN-dependency rule
- [ ] Test: run an import, confirm the dashboard reflects the new data and its freshness badge shows AUDITED
- [ ] Leave the system running for a few hours and confirm the STALE counter changes state naturally — this is the real end-to-end proof

## Sign-off

- [ ] Dashboard has shown both an AUDITED and a STALE state for the same asset, naturally, without forcing it
- [ ] Update `DEVELOPMENT_PLAN.md`'s "Current Phase" line to Phase 4
