# Jacson3 Ltd. Investor Profile

*Revised to reconcile holding categories with actual practice, retire the flat percentage stop-loss rule in favour of ATR-based sizing (see the Jacson3 Portfolio Technical Specification), and reflect decisions made during the build of the WSAPT Confluence Engine.*

# I. Core Objectives & Time Horizon

- **Target Total Annual Return (TTAR):** 25% after all fees and tax.
- **Investment Purpose:** Investment proceeds are intended to be drawn down to support lifestyle.
- **Time Horizon:** A balanced approach combining a medium-term trend bias with a long-term “buy and hold” perspective.

# II. Investment Strategy & Style

- **Investment Style:** The strategy is dynamic, incorporating elements of value, contrarian, and trend investing.
- **Trade Frequency:** The entity is not a high-frequency trader; most positions (excluding accumulation or personal consumption) are intended to be traded only a small number of times per year to protect capital.
- **Decision-Making:** Entry/exit points are determined using technical analysis for timing in conjunction with corporate fundamentals for conviction.
- **Macro Strategy:** Buying near market lows (technical) and taking profits when markets appear “frothy” (technical, sentiment, influencer commentary).
- **Asset Classes:** Active across multiple markets, including NZ, AU, and US shares, ETFs, Cryptocurrency, and Managed Funds.

## II.a Tax posture and trade frequency — design principle, not a fixed rule

Low trade frequency is not only a capital-preservation discipline; it is also relevant to how Jacson3 Ltd.'s share and crypto activity might be characterised for tax purposes. New Zealand's investor-vs-trader tests (for individuals) weigh stated intent, holding period, and transaction frequency as evidence — there is no official fixed trade-count threshold, despite some informal commentary online suggesting one.

> *This research was unable to confirm how these tests specifically apply to a company (Jacson3 Ltd.) as opposed to an individual investor, and general web research is not a substitute for advice from Jacson3's own accountant. Confirm the applicable position, and any practical frequency guideline, with that accountant — do not treat the figures in this document as a compliance threshold.*

- **Design principle for the WSAPT/Confluence system (see Technical Specification):** alerts inform a decision, they never auto-execute a trade, and the system should bias toward infrequent, high-conviction action consistent with this section — not toward signal-chasing.

# III. Risk Management & Protection

Stop-loss and accumulation levels are governed by the WSAPT (volatility-adjusted) framework — see the Jacson3 Portfolio Technical Specification for the full mechanics and formulas. The flat 20% maximum-loss rule previously stated here has been retired: ATR-based sizing replaces it, since a fixed percentage doesn't account for how differently individual assets actually move.

Holdings are classified into exactly two categories. Which category an asset belongs to is recorded per-asset in the Master_Watchlist (a “Holding Status” column), not inferred ad hoc.

## III.a Core Accumulation

Held indefinitely with the primary behaviour being accumulation — buying near support/pullback levels and occasionally taking profits when markets appear frothy, then re-buying near volume/institutional support. These positions carry a wide, loose ATR-based stop calibrated to sit below the asset's VRVP Point of Control (POC) with a buffer, so a normal test-and-hold at institutional support does not trigger it. This stop functions as a thesis-failure backstop, not a trading trigger — it exists in case the original investment thesis breaks down, however unlikely, not because frequent selling is expected.

- **Bitcoin (BTC):** long-term holder position with no current intention to sell. Included in this category specifically so a backstop stop exists in the event the original thesis breaks down materially (for example, a major cryptographic vulnerability) — not because near-term selling is anticipated.
- **Google (GOOG), Amazon (AMZN), NVIDIA (NVDA), IAA (ASX), Tesla (TSLA):** accumulated and held, with profits occasionally taken when markets are “frothy” and re-bought near volume/institutional support levels. Tesla is managed with extra volatility in mind and, consistent with this category's wide backstop stop, may be sold more often than the others in this group — it does not require its own separate category to account for this.

## III.b Active Trailing

All other positions — cyclical or higher-beta names typically held on a multi-year horizon with a focus on protecting profit through normal volatility. These carry the standard dual-level ATR stop: a Tight Stop (capital preservation) and a Wide Stop (trend defender), both tighter than Core Accumulation's backstop, since these positions are expected to be exited mechanically when a real trend break occurs.

- **AI / Semiconductor (multi-year horizon, protecting recent profits):** AVGO, MU, MRVL, AMD, ALAB, PLTR
- **Other medium-term holdings:** MSTR, BABA
- All Crypto holdings other than BTC, and all Regional Utility holdings

This is the current list, not an exhaustive or final one — new positions are classified into one of the two categories at the time of purchase and recorded in Master_Watchlist.

# IV. Administrative and Data Profile

- **Investor Entity:** Jacson3 Ltd.
- **Key Brokerage Accounts (Order of Importance):** Sharesies, Moomoo, ASB Securities.
- **Tax Status:** NZ company tax rate – 28%. Jacson3 currently holds significant tax losses on its books.
- **Primary Data Source:** TradingView Plus.
- **Watchlist Location:** Maintained in Google Drive, in the Investment tools folder — see the Technical Specification for the no-Microsoft platform constraint that governs how this and related files are stored and edited.
- **Platform Constraint:** No Windows, Excel, or Microsoft 365 anywhere in this project — see Technical Specification §1.

## IV.a Performance Review & Resources

- **Sharesight** is the system of record for portfolio performance tracking and tax reporting (dividend income, taxable gains where applicable, FIF calculations). The XIRR/dividend/drawdown calculator being built for this project (Technical Specification, Returns & Income workstream) is intended to *complement* Sharesight — e.g. providing staggered-cashflow IRR modelling Sharesight doesn't natively surface — not to replace it as the official record.
- Accesses earnings reports and company/project news via the TradingView Plus subscription, occasionally reading annual reports.
- Investment fundamentals analysis is guided by *The Intelligent Investor* principles.
- Relies on multiple YouTube channels for insight, including InvestAnswers, CTO Larsson, Business with Brian, Coin Bureau, Andrei Jikh, Raoul Paul, Ticker Symbol YOU, Mark Tilbury, Lark Davis, Real Vision, and Digital Asset News.
- Paid subscriptions to InvestAnswers (Patreon) and CTO Larsson (proprietary trend technical indicator — see Technical Specification for the strict rule on how this indicator is and isn't used in this project's tooling).

# V. Change Log

Tracked here so future sessions can see what changed and why, without re-deriving it from conversation history.

- Retired the flat 20% maximum-loss rule — superseded entirely by ATR-based sizing, which adapts the stop distance to each asset's own volatility rather than applying one number to every asset regardless of how differently they move.
- Collapsed three previously implied categories (No-Stop / Core Accumulator / Medium-Term AI) into two: Core Accumulation and Active Trailing. Tesla's “occasional selling” and BTC's backstop-only stop are both accommodated within Core Accumulation's wide, POC-buffered stop — neither needs its own category.
- Added BABA to the Active Trailing group, matching its actual presence in the Master_Watchlist.
- Added §II.a: trade frequency as a tax-relevant design principle, with an explicit pointer to the entity's accountant rather than a stated numeric threshold.
- Clarified Sharesight's role relative to the in-project Returns & Income calculator (complement, not replacement).
