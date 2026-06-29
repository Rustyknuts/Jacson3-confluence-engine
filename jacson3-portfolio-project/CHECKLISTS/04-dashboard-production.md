# Phase 4 — Dashboard Production Build

Goal: extend the prototype against live data (from Phase 3) to cover the rest of Objective 2's spec — fundamental/macro commentary, full indicator toggles, and anything that was mocked or omitted in the prototype.

**How to work this checklist with Claude:** by this phase the dashboard file will be large. Ask Claude to make targeted edits (str_replace-style, one component at a time) rather than regenerating the whole file — regenerating risks reintroducing the bugs already fixed (the dangling function declarations, the CDN dependency). If a change touches more than one component, say so explicitly so Claude re-validates the whole bundle, not just the edited piece.

## Carry over from the prototype (confirm still true)

- [x] Self-contained build — React/ReactDOM bundled in, zero CDN script tags
- [x] WSAPT stop/accumulation levels computed from real Close/ATR, not hardcoded
- [x] Confluence panel with manual Bull/Neutral/Bear signal-setting per asset
- [x] Freshness/audit badge (AUDITED / STALE / NO DATA)
- [ ] **Needs an update, not yet done**: the prototype's `NO_TRAILING_STOP` / `LONG_TERM_ACCUMULATORS` logic predates the Holding Status column and the two-category restructure (Technical Specification §2). Replace it with logic that reads the actual `Holding Status` column (now O in Master_Watchlist) rather than a hardcoded ticker set in the dashboard code — otherwise the dashboard and the sheet will drift the next time a holding category changes.
- [ ] The Tight Stop display for Core Accumulation assets should show "n/a (no tight stop)" rather than a dash or blank — match what the sheet now shows, don't invent different wording
- [x] Macro & FX panel, editable theses cards
- [ ] **Re-verify after Phase 3 changes**: re-run the same esbuild + headless-render check used originally before treating any Phase 4 change as done

## Indicator toggles (Objective 2 spec, not yet built)

- [ ] Native toggle for 50-day SMA overlay on a per-asset basis
- [ ] Native toggle for 200-day SMA overlay, with Golden Cross / Death Cross visual flag when they cross
- [ ] Distance-from-average metric displayed numerically, not just visually
- [ ] Bollinger Band position indicator (this should read from Master_Watchlist column R once Phase 1's standardization decision is made — don't compute Bollinger Bands independently in the dashboard)
- [ ] Fibonacci levels — confirm with yourself whether this is still wanted; it's in the original Strategic Objectives but hasn't come up since. If yes, scope as its own sub-task before starting

## Volume Profile / structural analysis

- [ ] POC (Point of Control) display per asset — reads from Master_Watchlist column S (VRVP POC Distance)
- [ ] LVN (Low Volume Node) display — confirm whether this needs its own column or can derive from the same VRVP read

## Fundamental & macro commentary panels (Objective 2 spec)

- [ ] Decide the source: is "aggregated analyst commentary" something Claude generates on request, something pulled from a web search each session, or something manually maintained in the sheet? (This has real data-integrity implications — see the note below)
- [ ] **Data integrity note:** if Claude is asked to generate fundamental/macro commentary live, the same rule from the Technical Specification (§1.3) applies — don't present search-derived commentary as more current or authoritative than it is. Timestamp it, cite it, and don't let it silently influence a buy/sell recommendation without the person seeing where it came from
- [ ] Build the UI panel once the source is decided — don't build the display before deciding what feeds it

## Tabbed interface completeness

- [x] Crypto / Tech Share / Regional Utility tabs exist
- [ ] Confirm all 11 named crypto assets from the Strategic Objectives doc are present (BTC, SOL, ETH, JUP, USDC, SUI, PYTH, RAY, GRT, SKR, NOS) — cross-check against the current Master_Watchlist, some may be missing or named differently

## Sign-off

- [ ] Every item in the dashboard's original Key Specifications list (Technical Specification §5.2, originally Objective 2 in the now-retired Strategic Objectives PDF) is either built or has a written reason it's deferred
- [ ] Update `DEVELOPMENT_PLAN.md`'s "Current Phase" line to Phase 5A/5B (parallel tracks — no strict order between them)
