# Phase 5C — Portfolio Holdings & Sharesight Integration (parallel-safe, prerequisite for 5.5)

Goal: Jacson3_Holdings and Personal_Holdings tabs in Master_Watchlist DB are populated from real Sharesight data, not manual guesses or fabricated figures. This unblocks Phase 5.5's Returns Calculator, which depends on Sharesight's annualised return numbers rather than rebuilding XIRR math here.

**How to work this checklist with Claude:** the Sharesight cleanup and Moomoo connection steps below happen entirely inside Sharesight's and Moomoo's own apps — Claude can't do these for you. Claude's part starts once API access exists: writing the pull script and wiring the lookup formulas, which are already scaffolded in the sheet.

## Step 1 — Tidy up Sharesight portfolios (you, not Claude)

- [x] Confirm "Jacson3 ASB Securities" is genuinely empty (sold down as expected) — **verified, zero balance**
- [x] Decide: archive/retire it in Sharesight, or leave it as a dormant historical record — **decided: leave as a dormant historical record for now.** Revisit if this becomes problematic (e.g. it starts showing up in reports or confusing the holdings pull).
- [x] Confirm "Jacson3 Sharesies" and "Jacson3 Crypto" are both correctly attributed to Jacson3 Ltd (they are — both are Jacson3, just split by broker)

## Step 2 — Connect Moomoo to Sharesight (you, not Claude)

- [x] In the Moomoo app: Account → More → Tax Documents → Sync to Sharesight → Auto Sync → Connect Now
- [x] Authorise the connection and create a new Sharesight portfolio for it — **actual name: "Personal-MooMoo"** (exact casing/hyphen matters for lookups — corrected in `Personal_Holdings` column B)
- [x] Note: trades sync on a T+1 basis — first sync confirmed received, faster than the 48hr estimate
- [x] Confirm at least one trade has synced successfully before moving on — **confirmed**

## Step 3 — Request Sharesight API access (you, not Claude)

- [ ] Email api@sharesight.com (or the current address on portfolio.sharesight.com/api/) requesting API access for your own data, specifying the Sharesight account email
- [ ] Once granted, store the API credentials in `secrets/` — never paste them into a chat with Claude
- [ ] Check whether your Sharesight plan (Standard/Premium/Business) is what's required for API access — confirm this hasn't changed since this checklist was written

## Step 4 — Wire the pull (Claude can help once Step 3 is done)

- [ ] Decide the pull mechanism: a script run on a schedule (matching the Sharesight T+1 sync cadence — no point polling more often than that), writing into the `Jacson3_Holdings` and `Personal_Holdings` tabs
- [ ] Map Sharesight's API response fields to the existing tab columns (Ticker, Sharesight Portfolio, Quantity Held, Average Cost Basis, Current Value, Annualised Return, Last Sync Timestamp)
- [ ] Exclude "Jacson3 ASB Securities" from the Jacson3_Holdings pull until Step 1's cleanup decision is made
- [ ] Confirm the `WSAPT Confluence Ref` lookup column (already a working formula against `Master_Watchlist`) correctly resolves for every real ticker pulled in — it will show "ticker not in Master_Watchlist" for anything Sharesight holds that isn't yet tracked technically; decide per-asset whether to add it to Master_Watchlist or leave it untracked
- [ ] Update the Sync Status column to reflect real sync state, not the current "NOT YET CONNECTED" placeholder

## Step 5 — Verify, don't assume

- [ ] Recalculate the workbook and confirm zero formula errors after populating real data
- [ ] Spot-check one Jacson3_Holdings row and one Personal_Holdings row against what Sharesight's own UI shows for the same ticker — confirm quantity, cost basis, and return all match
- [ ] Confirm the annualised return figure pulled is Sharesight's own calculation, not something recomputed in the sheet — per Technical Specification §5.5, this project deliberately doesn't rebuild XIRR for sources that already provide it correctly

## Sign-off

- [ ] Both Holdings tabs show real data for at least one ticker each, sourced from Sharesight, not placeholders
- [ ] Update `DEVELOPMENT_PLAN.md` to reflect this phase's completion before starting Phase 5.5 in earnest
