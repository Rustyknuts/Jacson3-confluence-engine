**Jacson3 Portfolio**

# Technical Specification

*Replaces the original Strategic Objectives document and Addendum A. This is the build-facing reference: what the system does, how the WSAPT/Confluence engine works, what's built, and what's still open. The Jacson3 Ltd. Investor Profile remains the separate, person-facing document covering risk tolerance, goals, and accounts — read both; read this one for mechanics. Where this document states a specific number or threshold that was a judgement call rather than a hard derivation (e.g. BTC's wide-stop buffer percentage), the reasoning and revisit conditions live in ASSUMPTIONS_REGISTER.md, not duplicated here.*

# 0. Project Intent

Optimise the Jacson3 Investment Portfolio to fund a healthy, active retirement, targeting a 25% Target Total Annual Return (TTAR), with technical and physical automation that reduces dependence on manual chart-watching from the Lenovo Yoga 7i screen. The system should move from manual chart-watching to an alert-driven workflow that pushes notifications to a mobile device during genuine market events — not generate noise that encourages more frequent trading than the Investor Profile calls for.

> *This document deliberately does not cap itself at a fixed number of objectives. Earlier drafts imposed a 5-item limit; that constraint is removed. Workstreams are listed in §5 in dependency order, and new ones can be added as they're identified.*

# 1. Platform & Data Source Constraints

## 1.1 No Microsoft products

- No Windows, Excel, OneDrive, or Microsoft 365 anywhere in this project.
- Master data lives in Google Sheets (Google Drive → Investment tools folder). Looker Studio is the dashboard/visualisation layer on top of it.
- Hardware remains the Lenovo Yoga 7i driving a three-screen array (Samsung 32" TV + LG 23" monitor); display/file-storage guidance stays platform-agnostic (macOS, ChromeOS, Linux native tools) rather than Windows-specific.

## 1.2 TradingView Plus is the live data source of record

TradingView Plus (account hummdinger4@gmail.com) is the live pricing/charting engine — never a placeholder. Two real data paths:

- **Charting & live signals:** TradingView Plus charts, indicators, Pine Script alertcondition() blocks, displayed on the Samsung 32" TV.
- **Portfolio database refresh:** TradingView CSV export → Google Sheets TV_Imports tab → XLOOKUP into Master_Watchlist, timestamped on import.

Execution alerts (Stop-Loss Breach, Accumulation Buy Trigger, Trend Break, Confluence Score state changes) are drawn from TradingView Pine Script alerts and pushed to mobile via TradingView App / Webhook → Pushover. Any dashboard built outside TradingView is a visualisation/audit layer, never an independent live feed — it must always show the timestamp of its underlying source.

## 1.3 The <1hr data-age rule

Every price used in an actionable recommendation must be timestamped and flagged stale once older than 1 hour, unless explicitly a daily close. Never write a fabricated or search-derived “live” price into the sheet or dashboard — if no clean, single-source, timestamped print is available, leave the field blank and flagged (e.g. “⏳ NO PRICE DATA YET”) rather than estimate. This has already mattered in practice: CEN and MEL were added to the watchlist with blank price fields specifically because no single trustworthy timestamped quote was available at the time.

# 2. Holding Categories

Two categories, replacing the looser groupings implied by earlier drafts (“no-stop,” “long-term accumulator,” “medium-term AI”). Every asset in Master_Watchlist carries a Holding Status (column O) of exactly one of the two below — this determines which stop-formula set applies, not just a label.

## 2.1 Core Accumulation

Held indefinitely; primary behaviour is accumulation — buying near support/pullback levels, occasionally taking profits when frothy, re-buying near institutional support. Current members: BTC, GOOG, AMZN, NVDA, IAA, TSLA.

- **No tight stop.**
- **Wide stop:** functions as a thesis-failure backstop (e.g. a structural break in the investment case), not a trading trigger. The formula differs by asset rather than being uniform:
  - **BTC:** 35% below its VRVP Point of Control (POC), read from a 12-month Fixed Range Volume Profile. BTC is treated as a special case because its historical 50–80% drawdowns are normal cyclical behaviour, not thesis failure — an ATR multiple sized for that range would sit inside, or barely below, an ordinary bad year. See ASSUMPTIONS_REGISTER.md §1 for the full reasoning and its provisional status.
  - **GOOG, AMZN, NVDA, IAA, TSLA:** the same formula as Active Trailing's wide stop, Close − 2.5×ATR(14). POC is not used in their wide-stop calculation. This was chosen over inventing a third formula shape once BTC was carved out as a special case — see ASSUMPTIONS_REGISTER.md §2 for the reasoning and what would prompt revisiting it (in particular, that this makes Core Accumulation's only structural difference from Active Trailing, for these five assets, the absence of a tight stop).
- **Accumulation Zone 1/2:** same as Active Trailing (§2.3).
- Tesla's higher volatility and more frequent selling, and BTC's “probably never sold” status, are both accommodated within this one category's wide, asset-calibrated stop — neither needs a separate category.

## 2.2 Active Trailing

All other positions — cyclical/higher-beta names, typically held 2–5 years, where protecting profit through normal volatility via a mechanical stop is the right behaviour. Current members: all crypto except BTC, AVGO/MU/MRVL/AMD/ALAB/PLTR, MSTR, BABA, EXC, CEN, MEL, and any future addition not explicitly placed in Core Accumulation.

- **Tight Stop (Capital Preservation):** Close − 1.5×ATR(14)
- **Wide Stop (Trend Defender):** Close − 2.5×ATR(14)

## 2.3 Accumulation zones (both categories)

- **Zone 1 (Pullback):** Close − 1.0×ATR(14) — early pullback entry inside an intact uptrend.
- **Zone 2 (POC):** manual VRVP chart read — high-conviction add at institutional support. Not formulaic.

# 3. ATR — the structural ruler

Average True Range measures an asset's typical daily movement (accounting for gaps) averaged over 14 days. Sizing stops as a multiple of ATR, rather than a flat percentage, means the stop distance reflects each asset's own volatility — a flat percentage would be too tight for naturally volatile assets and too loose for naturally calm ones. The flat 20% maximum-loss figure that appeared in earlier drafts of the Investor Profile is retired for this reason; ATR-based sizing supersedes it entirely (see Investor Profile, §III).

# 4. The “Seeking Confluence” Multi-Indicator Strategy

Buy/sell/stop-adjustment timing is never decided off a single indicator. Each asset carries a Confluence Score built from the signals below; WSAPT stop/accumulation levels remain the structural skeleton everything else is read against. Confluence is decision support, not a replacement for the mechanical WSAPT trigger.

## 4.1 Signal stack and weights

| **Signal** | **Source / Tool** | **What It Confirms** | **Weight** |
| --- | --- | --- | --- |
| Larsson Line | CTO Larsson proprietary indicator (TradingView add-on) | Primary proprietary trend-bias signal — tie-breaker when other signals conflict | High (anchor) |
| 50/200 SMA | Native TradingView | Structural trend direction; Golden Cross / Death Cross context | High |
| VRVP (Volume Profile) | Native TradingView | POC and LVN levels — structural support/resistance and slippage risk | High |
| RSI | Native TradingView | Momentum exhaustion / divergence at the edges of a move | Medium |
| Bollinger Bands | Native TradingView | Volatility expansion/contraction context around entries and stops | Medium |
| Chart Patterns (tops/bottoms) | Manual/AI-assisted visual read | Confirms structural top or bottom formation | Medium |
| ATR (14) | Native TradingView, feeds WSAPT math | Sets stop/accumulation distances — the ruler, not a signal itself | Structural (always on) |

## 4.2 The Larsson Line — proprietary, handle with care

The Larsson Line is a paid, proprietary TradingView indicator (CTO Larsson subscription). It must never be reverse-engineered, reproduced, or approximated in any custom tool, script, or dashboard built for this project — doing so would breach its licensing and is out of scope, full stop, regardless of framing (“just an approximation,” “just for testing”).

- Correct integration: read its reported chart state (Bullish/Bearish/Neutral, or a flip event) directly off TradingView and feed that state into the Confluence Score as a manual or webhook-fed input — never recreate its underlying calculation.
- If TradingView's alert system can expose a Larsson Line flip as its own alertcondition(), that's the cleanest hand-off point into the Pine Script bridge (§6).
- In any dashboard, spreadsheet column, or mockup, the Larsson Line field is always a status input — never a chart computed from raw price data.

## 4.3 Confluence Score logic

Score each signal Bullish (+1) / Neutral (0) / Bearish (−1), weight per §4.1, sum:

- **Strong (≥ +3):** supports Zone 1/2 accumulation or holding through normal volatility.
- **Mixed/Watch (−2 to +2):** no new action; tighten attention, not necessarily stops.
- **Weak (≤ −3):** supports ratcheting the Active Trailing tight stop up, or reassessing a Core Accumulation position — does not by itself force a sale.

# 5. Workstreams

Listed in dependency order, not by an arbitrary cap. “Parallel-safe” workstreams have no dependency on the others and can be picked up any time. See DEVELOPMENT_PLAN.md in the project repository for the day-to-day phased checklist version of this section — this is the what-and-why; that document is the how-and-when.

## 5.1 WSAPT Risk & Accumulation Engine

Status: substantially built. The dual-category model (§2), ATR-based formulas (§3), and Master_Watchlist columns (§9) are in place. Remaining: calibrate each Core Accumulation asset's wide-stop POC buffer against its real chart (not a default multiplier); decide and apply a standard Bullish/Neutral/Bearish text convention for columns P–S.

## 5.2 Dual-Asset Visual Dashboard

Status: working self-contained prototype exists, built against a static Master_Watchlist export. Not yet wired to a live feed. Remaining: SMA/RSI/Bollinger/Fibonacci toggles, fundamental and macro commentary panels, full crypto asset list cross-check, live data wiring (depends on §5.3).

- Tabbed interface separating Crypto (BTC, SOL, ETH, JUP, USDC, SUI, PYTH, RAY, GRT, SKR, NOS) from Shares (Semiconductors, Big Tech, Regional Utilities) — built.
- Volume Profile integration (POC/LVN) — partially built, reads from Master_Watchlist column S.
- Dual-update data pipeline: native Google Sheets connection, and TradingView CSV importer — the Sheets side exists; CSV import path not yet automated.

## 5.3 TradingView Alert & Mobile Notification Bridge

Status: not yet started. Custom Pine Script overlay to plot WSAPT levels, alertcondition() blocks for Stop-Loss Breach / Accumulation Buy Trigger / Trend Break / Confluence Read change, and webhook → Pushover delivery to mobile. This is a prerequisite for making §5.2 genuinely live, not an optional add-on — see DEVELOPMENT_PLAN.md §Phase 2 for sequencing.

## 5.4 Macro & Environmental Intelligence (parallel-safe)

Status: partially built (FX/commodity panel for NZD/USD, NZD/AUD, WTI, Copper, Gold; editable theses cards). Remaining: El Niño/hydro tracking scope decision, NZ regional macro (RBNZ policy, swap rates) representation, AI/frontier infrastructure tracking depth, and — specifically called out as still missing — an explicit link between each macro thesis and the watchlist assets it should influence (e.g. tagging CEN/MEL against the Regional Hydrology thesis).

## 5.5 Returns, Dividend Cash Flow & Drawdown Calculator

Status: not yet started; depends on §5.6 for Jacson3/Personal annualised return data. Pulls Sharesight's own annualised return via its API (§8.2) rather than rebuilding XIRR — no longer fully parallel-safe, since it needs real holdings data to mean anything for the two main portfolios. STRC ex-dividend/DRIP tracking and per-asset drawdown (reusing the existing Peak Price column) remain independent and can proceed without §5.6.

## 5.6 Portfolio Holdings & Sharesight Integration

Status: tabs scaffolded (Jacson3_Holdings, Personal_Holdings), not yet populated with real data. Prerequisite for §5.5's return figures. Requires: Sharesight portfolio cleanup (ASB Securities decision), connecting Moomoo to Sharesight, and requesting Sharesight API access for the account's own data. See §8 and CHECKLISTS/05c-portfolio-holdings.md.

# 6. Pine Script Bridge — design notes

Detailed build steps live in the project checklist (CHECKLISTS/02-pine-script-alerts.md); the design constraints that don't change are:

- Recompute ATR(14) and the relevant stop formula on-chart using ta.atr(14) — don't just plot values copied from the sheet, so the chart and the sheet act as two independent checks on the same math.
- Larsson Line is never computed in Pine Script (§4.2) — only ever a separate input or alert.
- Webhook payloads should include enough structure (ticker, alert type, price, timestamp) for any downstream consumer (the dashboard, a future automation) to parse without guessing.

# 8. Portfolio Holdings & Cross-Portfolio Structure

Master_Watchlist's original single table (now the Holding-Status-aware reference layer described in §2 and §7) tracks technical/confluence data per ticker, regardless of who holds what. It does not track actual holdings — quantity, cost basis, or portfolio-specific return. Two additional tabs cover that:

- **Jacson3_Holdings:** the company portfolio. Sourced from Sharesight, which aggregates the Jacson3-entity brokers (currently “Jacson3 Sharesies” and “Jacson3 Crypto” Sharesight portfolios; “Jacson3 ASB Securities” exists but is pending a cleanup decision — reportedly sold down to empty, not yet formally retired).
- **Personal_Holdings:** holdings outside the Jacson3 entity, currently via Moomoo. Sharesight has a direct Moomoo integration (same mechanism as the existing Sharesies connection) — not yet connected as of this revision; see CHECKLISTS/05c-portfolio-holdings.md.

Both tabs key by ticker and look up technical/WSAPT data from Master_Watchlist by formula rather than duplicating it — one ticker, one technical record, referenced from wherever it's actually held. A ticker can appear in a Holdings tab and still only have one row in Master_Watchlist.

## 8.1 Why holdings data routes through Sharesight, not a custom broker API

Sharesies has no official public API — only unofficial, reverse-engineered clients exist, which are fragile and risk breaching Sharesies' terms of service. Moomoo does have an official OpenAPI, but it requires running a local gateway program (OpenD) with live trading credentials — real infrastructure, not a simple key. Both brokers already have official, sanctioned direct integrations with Sharesight instead (trade history auto-syncs, T+1), and Sharesight itself has a real API available to its own customers for pulling their own data. That's the path this project uses: Sharesies/Moomoo → Sharesight (auto-sync) → Sharesight API → Jacson3_Holdings / Personal_Holdings.

## 8.2 Annualised return — sourced, not rebuilt

Sharesight already computes accurate annualised returns from real per-lot trade dates (it has every individual buy/sell timestamp via the broker sync). This project pulls that figure via the Sharesight API rather than rebuilding XIRR math from an averaged cost basis — an averaged basis loses the timing information XIRR actually needs, so reconstructing it independently would be both redundant and less accurate than the number Sharesight already has. See §5.5 and CHECKLISTS/05b-returns-calculator.md.

## 8.3 Aggregation across portfolios

Deliberately deferred until both Jacson3_Holdings and Personal_Holdings have real data. When built, the aggregate must be value-weighted (or computed as one combined cash-flow series), not a naive average of two annualised percentages — a simple average misstates the blended return whenever the two portfolios are different sizes, which they will be.

# 9. Master_Watchlist Column Reference

Columns A–N are the original asset table — never change their meaning or position. Columns O–V are the additive confluence/holding-status block (this supersedes the O–U numbering in the original Addendum A; column O is now Holding Status, shifting the signal columns one place right):

| **Col** | **Header** | **Source / Notes** |
| --- | --- | --- |
| A–N | Original asset table | Unchanged — ticker, name, category, prices, ATR, stop/accum columns, PE/macro notes, timestamp, status |
| O | Holding Status | Core Accumulation or Active Trailing (§2). Set once at purchase; changed only deliberately. |
| P | Larsson Line Signal | Manual entry or TradingView webhook — Bullish/Bearish/Neutral text only, never computed |
| Q | RSI (14) | TradingView CSV import or manual entry |
| R | Bollinger Position | Manual read: Upper/Mid/Lower band proximity |
| S | VRVP POC Distance | Manual read from TradingView VRVP overlay — also feeds the Core Accumulation wide-stop buffer |
| T | Pattern Note | Free text, e.g. “Double top forming” |
| U | Confluence Score | Weighted sum of signals, §4.3 |
| V | Confluence Read | =IF(U≥3,“Strong”,IF(U<=-3,“Weak”,“Mixed/Watch”)) |

*Known collision history: the FX/Commodity Timing widget (NZD/USD, NZD/AUD, WTI, Copper, Gold) previously collided with this column range and was relocated to start at column W. Before adding any new column to Master_Watchlist, check what currently occupies the target range — this has already happened once.*

# 10. Known Issues & Watch Items

Carried forward so they aren't silently lost between sessions.

- CEN and MEL have no live price yet — deliberately left blank rather than filled from an unverified web search. Needed before Pine Script testing can cover these two assets.
- BABA is named in the Investor Profile but was missing from Master_Watchlist until this revision — now added as Active Trailing.
- Columns P–S (RSI/Bollinger/VRVP/Pattern) don't yet have a standardised Bullish/Neutral/Bearish text convention, which limits how much of the Confluence Score (§4.3) can currently be automated versus entered manually.
- Two real formula bugs were previously found and fixed in Master_Watchlist's FX widget (row-reference errors causing WTI and Gold to read the wrong row). Recalculate and spot-check after any formula edit — don't assume a dragged-down formula is correct.
- “Jacson3 ASB Securities” Sharesight portfolio is reportedly empty (sold down) but not yet formally retired or excluded — a deliberately open cleanup decision, not an oversight.
- Personal_Holdings has no real data until Moomoo is connected to Sharesight (§8.1) — the example row in that tab is a worked formula demonstration, not an actual position.

# 11. Change Log

- Removed the 5-objective cap; restructured as open-ended “workstreams” in dependency order (§5).
- Folded the original Addendum A in full into this document; Addendum A is retired as a standalone file.
- Replaced the implicit three-tier holding logic (no-stop / long-term accumulator / medium-term AI) with two explicit categories — Core Accumulation and Active Trailing — each with a clearly different stop-formula shape, not just a different number (§2).
- BTC moved into Core Accumulation, retaining a wide backstop stop rather than no stop at all, in case the underlying investment thesis breaks down.
- Core Accumulation's wide stop redefined as “below POC, with a buffer,” calibrated per-asset against the real chart — not a single fixed ATR multiplier applied uniformly.
- Added Master_Watchlist column O (Holding Status); shifted the original confluence signal columns from O–U to P–V accordingly.
- Added BABA to the watchlist as Active Trailing.
- Added Jacson3_Holdings and Personal_Holdings tabs, separating actual portfolio positions from the technical/confluence reference layer Master_Watchlist remains. Both look up technical data by ticker rather than duplicating it (§8).
- Decided portfolio holdings route through Sharesight (already connected for Sharesies; Moomoo connection pending) rather than a custom broker API — Sharesies has no public API, and Moomoo's official API requires local gateway infrastructure neither broker's direct Sharesight integration does.
- Decided annualised returns for Jacson3/Personal are pulled from Sharesight's own calculation, not rebuilt from an averaged cost basis in this project — Sharesight already has the real per-lot trade timing XIRR needs.
