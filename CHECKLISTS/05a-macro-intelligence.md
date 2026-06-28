# Phase 5A — Macro & Environmental Intelligence (parallel track)

Goal: cover the remainder of Objective 4's spec. No dependency on Phases 1–4 — safe to work this whenever there's a lull elsewhere, or concurrently.

**How to work this checklist with Claude:** this phase is more research/writing than code. Claude should web-search for current macro/commodity context rather than rely on memory, and should clearly separate "this is what I found, dated X" from "this is the existing thesis you wrote" — don't let the two blend into one undifferentiated paragraph.

## Already built

- [x] FX & Commodity Timing panel (NZD/USD, NZD/AUD, WTI, Copper, Gold) in the dashboard
- [x] Editable theses cards (AI Infrastructure, Space Technology, Regional Hydrology, Commodity Overheads)

## Decide the theses doc's home

- [ ] Theses_Source as a Google Sheet tab (original blueprint plan) or a markdown file in this repo's `docs/` (recommended — Claude can read it directly without an API round-trip)
- [ ] If markdown: create `docs/THESES.md`, migrate the four existing theses into it
- [ ] If Sheets: confirm the tab exists and the dashboard's editable cards write back to it (currently they're session-only, in-memory — this would need real persistence)

## Remaining macro coverage (Objective 4 spec)

- [ ] El Niño / hydro tracking: is this just a thesis note, or should it pull an actual data feed (e.g. NIWA, NOAA ENSO index)? Decide scope before building
- [ ] Commodity passing-overview (oil, gold, copper, data-center-relevant minerals) — confirm the current 3-commodity panel (WTI/Copper/Gold) is sufficient, or expand
- [ ] NZ regional macro (RBNZ policy, wholesale swap rates) — currently not represented anywhere; decide if this is a dashboard panel or a periodic written note
- [ ] AI/Frontier infrastructure tracking (NEXTDC, Marvell, Nvidia, SpaceX/Rocket Lab liquidity dynamics) — currently only as a thesis card; decide if any of these need to be actual watchlist assets with WSAPT levels, or stay macro-context-only
- [ ] Currency market overview (USD/AUD/NZD, with the stated option to edit the list) — confirm the current 2-pair panel (NZD/USD, NZD/AUD) covers this, or needs a 3rd cross / editable list UI

## Link to individual asset analysis (explicitly required by Objective 4)

- [ ] Confirm there's an actual visible connection between a macro thesis and the specific assets it should influence — right now the theses cards and the watchlist are separate panels with no cross-reference
- [ ] Minimum viable version: a tag or note on relevant watchlist rows pointing back to which thesis applies (e.g. CEN/MEL tagged "Regional Hydrology")

<details>
<summary>Reference: the FX/Commodity widget's actual GOOGLEFINANCE formulas (from the original 5-Day Blueprint, Day 1) — already implemented in Master_Watchlist columns W–Z</summary>

```
NZD/USD value:  =GOOGLEFINANCE("CURRENCY:NZDUSD")
NZD/AUD value:  =GOOGLEFINANCE("CURRENCY:NZDAUD")
WTI Crude:      =GOOGLEFINANCE("USO")
Copper:         =GOOGLEFINANCE("COPX")
Gold:           =GOOGLEFINANCE("GLD")
```

Each pairs with a signal formula comparing the current value to its 50-day SMA via `AVERAGE(INDEX(GOOGLEFINANCE(...,"price", TODAY()-50, TODAY()), 0, 2))`. These are already live in the sheet (columns W–Z) — useful as a reference pattern if extending to a 3rd currency cross or additional commodity.
</details>

<details>
<summary>Reference: weekly AI briefing prompt template (from the original 5-Day Blueprint, Day 5) — a starting point, not gospel</summary>

> Act as the lead macro research partner for the Jacson3 investment portfolio. Review the master theses document, current USD/AUD/NZD currency crosses, global crude oil and copper commodity trends, and APAC news. Generate a structured briefing covering: (1) macro developments in AI infrastructure, Space sectors, and Regional Hydrology; (2) key commodity trends affecting our holdings; (3) currency market overview with market-timing commentary; (4) short/medium-term fundamental and macro perspective for watchlist assets; (5) recommended trailing stop modifications based on weekly ATR adjustments. **Always state pricing data age at the top; do not make actionable recommendations if data is older than 1 hour.**

Worth revisiting this template once the theses doc's home (above) is decided, so it points at the actual current source rather than an assumed Sheets tab.
</details>

## Sign-off

- [ ] Every macro thesis has at least one watchlist asset it's explicitly linked to, or a written note explaining why it's purely contextual
