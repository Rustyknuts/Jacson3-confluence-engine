# Jacson3 Investment Portfolio — Development Plan

**Status:** Living document. Update the "Current Phase" line below as you move through phases — this is the one place to check for where the project actually stands.

**Current Phase:** Phase 1 (Data Layer Lock) — substantially complete, pending user sign-off. Phase 3 Path A tooling built in parallel (safe — import script has no Phase 2 dependency).

## Session Close-Out — 2026-06-30

### Changed this session
- `scripts/tv-import.gs` — created: Google Apps Script with "Jacson3 Portfolio" custom menu, HTML paste dialog, RFC-4180 CSV parser, TV header alias mapping, exchange-prefix stripping, TV_Imports tab writer (creates tab on first run, clears and rewrites on each import)
- `scripts/TV_Imports_schema.md` — created: TV_Imports column layout (A–H), TradingView Screener column setup guide, XLOOKUP formula templates for price/ATR/RSI/per-row timestamp/freshness badge, 10-item post-import verification checklist
- `FOLDER_STRUCTURE.md` — updated: documents `scripts/` directory and its purpose
- `.claude/skills/jacson3-project-manager/SKILL.md` — installed: skill was missing from `.claude/skills/`; diagnosed via `ls`, stub created, then replaced with full 215-line file from downloaded zip
- `CHECKLISTS/03-live-data-wiring.md` — Path A decision ticked; install-and-test pre-steps added
- `ASSUMPTIONS_REGISTER.md` — entry #8 added: `STRIP_EXCHANGE_PREFIX = true` default in tv-import.gs
- Decision: Phase 3 Path A chosen — TV CSV → TV_Imports tab via Apps Script (not webhook path)

### Still open
- `tv-import.gs` not yet installed in the Sheet — file exists in repo but has not been pasted into Extensions → Apps Script
- Phase 1 sign-off — pending user personally opening the sheet to verify formulas (checklist item cannot be ticked on behalf of the user)
- Core Accumulation POC buffers — still placeholders for GOOG, AMZN, NVDA, IAA, TSLA (BTC calibrated; others deferred)

### Start here next session
Open the Sheet → Extensions → Apps Script → paste the contents of `scripts/tv-import.gs` → Save → reload the Sheet → confirm the "Jacson3 Portfolio" menu appears, then run a first import from TradingView Screener.

---

## How to use this plan

This is the sequencing logic. The day-to-day work happens in `CHECKLISTS/`, where each phase below has a matching `.md` checklist file with checkboxes you tick off in your editor or on GitHub. This file explains *why* the order is what it is; the checklists tell you *what* to actually do.

Before starting any phase, point Claude (Code or Cowork) at this file and the matching checklist. The `.claude/skills/wsapt-confluence/SKILL.md` skill loads automatically for anything touching this project's logic, so you shouldn't need to re-explain WSAPT, the confluence weights, or the no-Microsoft / TradingView-source-of-truth rules each time — if Claude seems to be re-deriving settled scope, that's a sign the skill didn't trigger and it's worth flagging.

---

## Why this order, not the original 5-objective order

The Strategic Objectives document lists five objectives as roughly parallel work streams. They aren't, once you look at what actually depends on what:

- The dashboard (Objective 2) and the alert bridge (Objective 3) both **read from** the Master_Watchlist confluence columns (Objective 1). Building either before the data layer is stable means rebuilding them once it changes.
- The alert bridge (Objective 3) is a **prerequisite** for making the dashboard live (Objective 2) — there's no point polishing dashboard UI against a static export when the real blocker is "nothing pushes live data into it yet."
- The macro/FX panel and theses doc (Objective 4) and the returns/dividend calculator (Objective 5) **don't depend on anything else** in the project. They're the right thing to pick up whenever you're blocked or context-switching, not a late-stage nice-to-have.

So the phases below group work by actual dependency, not by objective number.

---

## Phase 1 — Data Layer Lock (Objective 1, foundation for everything else)

**Goal:** Master_Watchlist is the single source of truth, fully columned, formula-verified, with zero ambiguity about what's manual vs. computed vs. not-yet-wired.

**Status: substantially restructured.** Columns now run O–V (Holding Status inserted at O, shifting the original confluence columns one place right), formula-verified after that restructure, the FX widget collision is resolved (relocated to W–Z), known formula bugs are fixed, and CEN/MEL/BABA are all added without fabricated data. The Technical Specification (replacing the original Strategic Objectives doc and Addendum A) documents this in full.

**Why this phase matters most:** every later phase reads from this sheet. A bug here (like the row-reference errors already caught once) silently corrupts the confluence score, the dashboard, and any alert built on top of it. This is the one phase where "looks right" isn't good enough — formulas need to be recalculated and checked, not eyeballed.

**Remaining before calling this phase closed:**
- Get a real TradingView print for CEN, MEL, and BABA (all currently flagged "NO PRICE DATA YET" — correct behavior, but blocks Phase 3's alert testing for these assets).
- Calibrate each Core Accumulation asset's (BTC, GOOG, AMZN, NVDA, IAA, TSLA) wide-stop POC buffer against its real chart — column H currently shows a clearly-flagged placeholder for these, not a real number, since this requires looking at each asset's actual VRVP chart, not a uniform multiplier.
- Decide whether RSI/Bollinger/VRVP/Pattern (columns Q–T) get a standardized Bullish/Neutral/Bearish text convention now, or stay free-form until Phase 2. Recommendation: standardize now — Phase 3's confluence-state webhook payload needs a consistent format to parse, and retrofitting free-text later is more work than constraining it now.

→ Checklist: `CHECKLISTS/01-data-layer.md`

---

## Phase 2 — Pine Script & Alert Bridge (Objective 3)

**Goal:** TradingView Pine Script overlay computes/plots the WSAPT stop levels and confluence state on the chart itself, and pushes state changes out via webhook.

**Why before the dashboard:** the dashboard's entire value proposition is showing *live* state. Until something actually pushes live state somewhere, every dashboard iteration is decorating a static mockup. This is also genuinely the highest-skill, most failure-prone phase (Pine Script syntax, TradingView's alert system quirks, webhook payload shape) — better to hit those problems once, early, than discover them after the dashboard is built around assumptions about what the payload looks like.

**Sequencing within this phase:**
1. Pine Script reads Master_Watchlist's WSAPT levels (or recomputes them from the same ATR formula — decide which, see checklist) and plots Tight/Wide/Accum lines on-chart.
2. Add `alertcondition()` blocks for Stop-Loss Breach, Accumulation Buy Trigger, Trend Break — these were already scoped in the original blueprint, lowest-risk to implement first.
3. Add the Confluence Read state as a plot/label (per Technical Specification §4.2 — Larsson Line is a manual/webhook *input* to this, never computed by the script).
4. Wire webhook → Pushover for at least one alert end-to-end before building out the rest — prove the full path works before scaling it.

**Hard constraint carried from the Technical Specification:** the Larsson Line is never computed in Pine Script. If TradingView's alert system can expose a Larsson Line flip as its own `alertcondition()`, that's a separate, cleaner integration — don't try to derive it from price data as a workaround.

→ Checklist: `CHECKLISTS/02-pine-script-alerts.md`

---

## Phase 3 — Live Data Wiring (bridges Objective 2 and 3)

**Goal:** the dashboard stops reading a static export and starts reading something that updates.

**Two real paths exist (Technical Specification §1.2-1.3) — pick one, don't build both:**
- **Path A (simpler):** TradingView CSV export → Google Sheets `TV_Imports` tab → dashboard reads the Sheet via Google Sheets API (read-only).
- **Path B (more real-time):** Phase 2's webhook → some small intermediary (Sheets Apps Script, or a tiny serverless function) → dashboard polls or receives pushed updates.

**Recommendation:** start with Path A. It's lower-risk, reuses infrastructure Phase 1 already has (the `TV_Imports` tab exists), and gives you a working live dashboard faster. Path B is the eventual goal but has more moving parts (auth, hosting, error handling) that are easier to add once Path A proves the rest of the pipeline works.

**This phase is also where the no-CDN-dependency lesson from the dashboard prototype matters again:** any live-data dashboard build should keep bundling its own dependencies rather than loading them at runtime, for the same reliability reason as before.

→ Checklist: `CHECKLISTS/03-live-data-wiring.md`

---

## Phase 4 — Dashboard Production Build (Objective 2)

**Goal:** take the prototype (already built, already bug-fixed) and extend it against live data — tabs, indicator toggles, fundamental/macro commentary panels, all the things in Objective 2's spec that the prototype only partially covers.

**Why this is Phase 4, not Phase 2:** every dashboard feature built before Phase 3 is wiring is provisional. This phase is where that provisional work gets made real, and where the remaining unbuilt pieces (fundamental analyst commentary, macro commentary feed, full SMA/RSI/Bollinger/Fibonacci toggles) get added against a live backend instead of mock data.

→ Checklist: `CHECKLISTS/04-dashboard-production.md`

---

## Phase 5A — Macro & Environmental Intelligence (Objective 4) — parallel track

**No dependency on Phases 1–4.** Pick this up any time there's a lull, or run it concurrently with Phase 2/3 if you have the bandwidth to context-switch.

**Already done:** the Macro & FX panel in the dashboard prototype, the editable theses cards.

**Remaining:** decide whether the "Theses_Source" doc lives as its own Google Sheet tab (per the original blueprint) or as a markdown file in this repo's `docs/` folder that Claude can read directly — recommend the latter, since it makes the theses available to Claude Code/Cowork without an API round-trip, and the dashboard can still read it via Sheets if you want it user-editable from the spreadsheet too.

→ Checklist: `CHECKLISTS/05a-macro-intelligence.md`

---

## Phase 5B — Returns & Dividend Calculator (Objective 5)

**Partially independent.** STRC dividend tracking and per-asset drawdown don't depend on anything else. But the Jacson3/Personal annualised return figure now depends on Phase 5C — it's pulled from Sharesight's own calculation rather than rebuilt here, so it needs real holdings data to mean anything.

**Good candidate for:** building the STRC/drawdown pieces first if you want an early, low-risk win regardless of Phase 5C's status; hold off on the Sharesight-sourced return display until 5C has real data.

→ Checklist: `CHECKLISTS/05b-returns-calculator.md`

---

## Phase 5C — Portfolio Holdings & Sharesight Integration — parallel track, prerequisite for 5B's return figures

**No dependency on Phases 1–4.** This is about your actual holdings data, not the technical/confluence engine — safe to work whenever, but Phase 5B's Jacson3/Personal return figures can't be real until this is done.

**What changed since the original design:** the watchlist now has three tabs instead of one — `Master_Watchlist` (technical/confluence reference, unchanged), `Jacson3_Holdings` (the company portfolio), and `Personal_Holdings` (your Moomoo account). Both Holdings tabs look up technical data from Master_Watchlist by ticker rather than duplicating it.

**Why Sharesight, not a custom broker API:** Sharesies has no public API at all — only unofficial, fragile, ToS-risky clients. Moomoo has a real official API but it needs a local gateway program with live trading credentials, which is real infrastructure to stand up. Both brokers already have official, sanctioned Sharesight integrations instead, and Sharesight has its own API for customers to pull their own data. That's the path: broker → Sharesight (auto-sync) → Sharesight API → the Holdings tabs.

**Real-world steps this needs from you, not Claude:** tidying up the existing Sharesight portfolios (deciding what happens to the apparently-empty "Jacson3 ASB Securities"), connecting Moomoo to Sharesight the same way Sharesies already is, and requesting Sharesight API access for your own account. None of this happens inside a chat with Claude.

→ Checklist: `CHECKLISTS/05c-portfolio-holdings.md`

---

## Definition of "production ready"

Loosely defined on purpose — but at minimum, before calling this project production-ready:

1. No dashboard view shows a price without a visible timestamp and freshness badge (the <1hr rule, enforced visually, not just in the data).
2. No formula in Master_Watchlist was added without a recalculation check (see Phase 1).
3. The Larsson Line is never computed anywhere in the codebase — only ever read as a state input.
4. The dashboard renders with zero external runtime dependencies (no CDN scripts) — bundle everything.
5. Every phase's checklist is fully checked, or has an explicit, written reason in that checklist for why an item was skipped.

---

## See also

- `.claude/skills/wsapt-confluence/SKILL.md` — the binding scope reference, loads automatically in Claude Code/Cowork sessions in this repo.
- `docs/Jacson3_Portfolio_Technical_Specification.docx` — the full build-facing spec this plan and skill are both derived from (replaces the original Strategic Objectives doc and Addendum A).
- `docs/Jacson3_Investor_Profile.docx` — who the investor is: risk tolerance, holding categories, accounts, tax posture.
- `FOLDER_STRUCTURE.md` — where everything in this repo lives and why.
- `CHECKLISTS/` — the actual day-to-day task lists, one per phase.
