---
name: wsapt-confluence
description: Binding scope reference for the Jacson3 Investment Portfolio project — the WSAPT dual-level stop/accumulation framework, the "Seeking Confluence" multi-indicator strategy, the no-Microsoft platform constraint, TradingView Plus as the data source of record, and the Jacson3_Holdings/Personal_Holdings/Sharesight portfolio structure. Use this skill for anything touching Master_Watchlist, Jacson3_Holdings, Personal_Holdings, the dashboard, Pine Script alerts, webhooks, Sharesight/Sharesies/Moomoo, or any stop-loss, accumulation, holdings, returns, or confluence logic. Trigger even without the words "WSAPT" or "confluence" — stop-loss levels, accumulation zones, ATR, the Larsson Line, RSI/Bollinger/VRVP/SMA, portfolio holdings, Sharesight, or the Jacson3 watchlist should all load this skill first, before writing or editing code, formulas, or documents for this project. Treat Sections 1-3 as settled scope, not open questions.
---

# WSAPT Confluence Engine — Jacson3 Portfolio Scope Lock

This skill encodes decisions that were deliberately fixed once (see `Jacson3_Portfolio_Technical_Specification.docx` and `Jacson3_Investor_Profile.docx` in the project) so they don't need to be re-derived or re-argued in every new conversation. If a request in this project seems to conflict with anything below, flag the conflict to the user rather than silently overriding either the request or this scope.

Some specific numbers in this project (e.g. BTC's wide-stop buffer percentage) were judgement calls made under incomplete information, not hard derivations — these are tracked in `ASSUMPTIONS_REGISTER.md` with their reasoning and a concrete trigger for when to revisit them. When working on something this skill covers, check whether it touches a tracked assumption, and add a new entry to that register for any new judgement call made during the session rather than letting it go undocumented.

## 1. Platform constraint — no Microsoft products

- No Windows, no Excel, no OneDrive, no Microsoft 365 — anywhere in this project.
- Master data lives in **Google Sheets** (Google Drive → Investment tools folder). Looker Studio is the dashboard layer on top of it.
- Hardware is a Lenovo Yoga 7i driving a three-screen array (Samsung 32" TV + LG 23" monitor) — but display/file-storage guidance must stay platform-agnostic (macOS, ChromeOS, or Linux native tools), never Windows-specific steps.

## 2. Live data source of record — TradingView Plus

- TradingView Plus (account `hummdinger4@gmail.com`) is the live pricing/charting engine — never a placeholder, never assumed to not exist.
- Two real data paths:
  - **Charting & live signals**: TradingView Plus charts, indicators, Pine Script `alertcondition()` blocks, shown on the Samsung 32" TV.
  - **Portfolio database refresh**: TradingView CSV export → Google Sheets `TV_Imports` tab → `XLOOKUP` into `Master_Watchlist`, timestamped on import.
- Execution alerts (Stop-Loss Breach, Accumulation Buy Trigger, Trend Break, Confluence Score state changes) come from TradingView Pine Script alerts → TradingView App / Webhook → Pushover.
- **Any dashboard or visual built outside TradingView is an audit/visualisation layer, never an independent live feed.** It must always show the timestamp of its underlying source.
- **The <1hr data-age rule is non-negotiable.** Every price used in an actionable recommendation must be timestamped and flagged stale if older than 1 hour, unless it's explicitly a daily close. Never write a fabricated or search-derived "live" price into the sheet or dashboard — if no clean, single-source, timestamped print is available, leave the field blank/flagged (e.g. "⏳ NO PRICE DATA YET") rather than estimate.

## 3. The "Seeking Confluence" multi-indicator strategy

Buy / sell / stop-adjustment timing is never decided off a single indicator. Each asset carries a **Confluence Score** built from the signal stack below; WSAPT stop/accumulation levels remain the structural skeleton everything else is read against — confluence is a decision-support overlay, not a replacement for the mechanical WSAPT trigger.

### 3.1 Signal stack and weights

| Signal | Source | Weight |
|---|---|---|
| Larsson Line | CTO Larsson proprietary TradingView indicator | High (anchor signal) |
| 50/200 SMA | Native TradingView | High |
| VRVP (Volume Profile / POC) | Native TradingView | High |
| RSI | Native TradingView | Medium |
| Bollinger Bands | Native TradingView | Medium |
| Chart patterns (tops/bottoms) | Manual/AI-assisted visual read | Medium |
| ATR(14) | Native TradingView | Structural — not a signal, it's the ruler everything else is measured against |

Score each as Bullish (+1) / Neutral (0) / Bearish (−1), weight per the table, sum:
- **Strong (≥ +3)**: supports Zone 1/2 accumulation or holding through normal volatility.
- **Mixed/Watch (−2 to +2)**: no new action.
- **Weak (≤ −3)**: supports ratcheting the tight stop up or reassessing — does not by itself force a sale.

### 3.2 The Larsson Line — proprietary, handle with care

**Never reverse-engineer, reproduce, or approximate the Larsson Line calculation in any custom tool, script, or dashboard.** It's a paid CTO Larsson subscription product; recreating its math breaches its licensing and is out of scope for any build in this project, full stop — no exceptions for "just an approximation" or "just for testing."

The only correct integration pattern: read its reported chart state (Bullish/Bearish/Neutral, or a flip event) directly off TradingView and feed *that state* into the Confluence Score as a manual entry or webhook-fed input. In any dashboard, spreadsheet column, or mockup, the Larsson Line field is always a status input — never a computed line.

### 3.3 Holding categories and stop formulas

Exactly two categories — recorded per-asset in Master_Watchlist column O (`Holding Status`). This replaced an earlier, looser three-tier grouping; treat this as current, not the older version if you see it referenced elsewhere.

- **Core Accumulation** — `BTC, GOOG, AMZN, NVDA, IAA, TSLA`. No tight stop. Wide stop is calibrated **below the asset's VRVP POC, with a buffer**, not a fixed ATR multiple applied uniformly — it's set per-asset against the real chart so a normal test-and-hold at institutional support doesn't trigger it. This is a thesis-failure backstop (e.g. BTC's stop exists for a scenario like a cryptographic break, not normal volatility), not a trading trigger. Tesla's higher volatility and more frequent selling, and BTC's "probably never sold" status, are both accommodated inside this one category — neither needs its own category.
- **Active Trailing** — everything else (all crypto except BTC, AVGO/MU/MRVL/AMD/ALAB/PLTR, MSTR, BABA, EXC/CEN/MEL, and any future addition not explicitly placed in Core Accumulation). Standard dual-level stop:
  - **Tight Stop (Capital Preservation)**: `Close − 1.5 × ATR(14)`
  - **Wide Stop (Trend Defender)**: `Close − 2.5 × ATR(14)`
- **Accumulation zones (both categories)**:
  - **Zone 1 (Pullback)**: `Close − 1.0 × ATR(14)`
  - **Zone 2 (POC)**: manual VRVP chart read — not formulaic.
- The flat 20% maximum-loss rule that appeared in an early Investor Profile draft is retired entirely — ATR-based sizing supersedes it. Don't reintroduce a flat percentage stop anywhere in this project.

## 4. Master_Watchlist column layout

Columns A–N are the original asset table — never change their meaning or position. Columns O–V are the additive block (note: column O is `Holding Status`, not a confluence signal — this shifted the signal columns one place right from an earlier version of this sheet):

| Col | Header | Source |
|---|---|---|
| O | Holding Status | `Core Accumulation` or `Active Trailing` (§3.3). Set once at purchase, changed only deliberately. |
| P | Larsson Line Signal | Manual entry or TradingView webhook (Bullish/Bearish/Neutral text only) |
| Q | RSI (14) | TradingView CSV import or manual entry |
| R | Bollinger Position | Manual read |
| S | VRVP POC Distance | Manual read — also feeds the Core Accumulation wide-stop buffer calc |
| T | Pattern Note | Free text |
| U | Confluence Score | Weighted sum per §3.1 |
| V | Confluence Read | `=IF(U>=3,"Strong",IF(U<=-3,"Weak","Mixed/Watch"))` |

**Known collision risk**: an FX/Commodity Timing widget (NZD/USD, NZD/AUD, WTI, Copper, Gold) also lives on this sheet and should be relocated to start at column **W** to avoid colliding with O–V (not yet applied — see ASSUMPTIONS_REGISTER.md #8). Before adding any new columns to `Master_Watchlist`, check what currently occupies the target range — this collision already happened once and had to be unwound.

## 5. Working with this project's files

- When editing `Master_Watchlist` (or any workbook in this project), recalculate and verify zero formula errors before treating the file as done — this project has already had real bugs from formula edits: copy-pasted formulas with stale row references (WTI and Gold rows in the FX widget both pointed at the wrong row), and a column-insert that silently broke the Confluence Score formula's Larsson Line reference when Holding Status was added at column O. Don't assume a formula is correct after any structural change; check it.
- Regional Utility holdings track **Contact Energy (CEN)** and **Meridian Energy (MEL)** (NZ, for the El Niño hydro thesis) alongside **EXC** (Exelon, US) — both coexist, this isn't an either/or. **BABA** was added the same way: named in the Investor Profile but missing from the sheet, added as Active Trailing.
- Self-contained HTML/React dashboards for this project should bundle React rather than load it from a CDN at runtime — a prior version that loaded React/ReactDOM/Babel from `unpkg.com` at runtime failed to render in the user's actual browser environment. Compile with esbuild (or equivalent) into one dependency-free file.
- Don't fabricate or estimate live prices for NZX-listed or other thinly-covered assets from web search results if there's no single, clean, timestamped source — leave the field blank and flagged instead, consistent with §2's data-integrity rule. CEN, MEL, and BABA all currently have blank price fields for exactly this reason.

## 6. Trade frequency — a tax-relevant design principle

Low trade frequency isn't only capital-preservation discipline — it may also matter for how Jacson3 Ltd.'s trading activity is characterised for NZ tax purposes (frequency and holding period are evidentiary factors in investor-vs-trader determinations). This project has not confirmed how that test applies specifically to a company rather than an individual investor — that's a question for Jacson3's accountant, not something to treat as settled here. Practical implication for anything built in this project: **alerts inform a decision, they never auto-execute a trade**, and tooling should bias toward infrequent, high-conviction action rather than encouraging signal-chasing. Don't design any feature (e.g. a notification frequency, a "quick trade" shortcut) that would push toward materially more frequent trading without flagging that tension to the user first.

## 7. Portfolio holdings — separate from the technical reference layer

`Master_Watchlist` tracks technical/confluence data per ticker only — it has no holdings data (quantity, cost basis, portfolio-specific return). Two additional tabs cover that, and both look up technical data from `Master_Watchlist` by ticker rather than duplicating it:

- **`Jacson3_Holdings`** — the company portfolio, sourced from Sharesight (which aggregates the Jacson3-entity brokers: "Jacson3 Sharesies" and "Jacson3 Crypto" Sharesight portfolios; "Jacson3 ASB Securities" exists but is pending a cleanup decision, reportedly sold down to empty).
- **`Personal_Holdings`** — holdings outside the Jacson3 entity, via Moomoo, connected to Sharesight the same way Sharesies already is (not yet connected as of this revision).

**Why Sharesight, not a custom broker API**: Sharesies has no public API at all (only unofficial, fragile, ToS-risky clients exist — don't build toward these). Moomoo has an official API but it needs a local gateway program with live trading credentials. Both brokers have official, sanctioned direct Sharesight integrations instead, and Sharesight has its own API for pulling a customer's own data. The path: broker → Sharesight (auto-sync, T+1) → Sharesight API → the Holdings tabs.

**Annualised return is pulled from Sharesight, never rebuilt.** Sharesight already computes accurate XIRR-quality returns from real per-lot trade dates. Don't build a separate XIRR calculator from an averaged cost basis for Jacson3/Personal — that would be both redundant and less accurate, since an averaged basis loses the timing information XIRR needs. Aggregating returns *across* Jacson3 and Personal is deliberately deferred until both have real data, and when built must be value-weighted, not a naive average of two percentages.
