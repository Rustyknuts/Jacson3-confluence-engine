# Phase 5B — Returns, Dividend Cash Flow & Drawdown Calculator (parallel track)

Goal: accurate annualised return per portfolio, and (once both portfolios have real data — see Phase 5C) an aggregated view across them. Depends on Phase 5C for Jacson3/Personal holdings data; STRC tracking and drawdown are independent of everything else.

**How to work this checklist with Claude:** this is the one phase that's pure financial calculation with no TradingView/dashboard dependency, so it's also the one place Claude's "not a financial advisor" boundary matters most directly — Claude can build the calculator and explain XIRR mechanics, but shouldn't be asked to interpret your specific return numbers as advice about what to do next. Keep that as a separate, explicit question if you want it.

## Annualised return — don't rebuild what Sharesight already does correctly

- [ ] **Decided**: pull Sharesight's own annualised return figure via its API for both Jacson3_Holdings and Personal_Holdings (Phase 5C), rather than rebuilding XIRR from an averaged cost basis here. Sharesight has the real per-lot trade dates from the Sharesies/Moomoo sync; an averaged cost basis in this sheet does not, and can't reproduce an accurate annualised figure on its own.
- [ ] Confirm this figure is genuinely "within portfolio" — i.e. Sharesight is computing Jacson3 Sharesies, Jacson3 Crypto, and (once connected) Personal Moomoo as their own returns, not blended together
- [ ] **Aggregation across portfolios — explicitly deferred.** A blended Jacson3+Personal return was discussed and deliberately not built yet, since Personal_Holdings has no real data until Phase 5C connects Moomoo. When ready: the correct aggregate isn't a simple average of the two percentages — it needs to be value-weighted (e.g. portfolio-value-weighted average, or treat all cash flows across both as one combined XIRR series) or it will misstate the true blended return. Don't ship a naive average-of-two-percentages "aggregate" number.
- [ ] Once both portfolios have real data: decide whether "aggregated across portfolios" means (a) Jacson3 total (Sharesies + Crypto, and ASB Securities if retained) vs. Personal, or (b) one grand total across everything — these answer different questions, build whichever you actually want to see, or both if they're cheap to add once the data exists

## STRC dividend tracking

- [ ] Confirm the current ex-dividend schedule and semi-monthly payment cycle for STRC (Strategy Shares Short Duration High Yield Credit) — this should be sourced from Moomoo or the fund's own site, not estimated
- [ ] Build the DRIP (Dividend Reinvestment) status tracking — decide if this is a manual checkbox per payment or something that can be inferred from a transaction import
- [ ] Build a simple forward calendar view: next N expected payment dates based on the semi-monthly cycle

## Drawdown

- [ ] Confirm what "drawdown" means in this context: portfolio-wide peak-to-trough, or per-asset (the Master_Watchlist already has a Peak Price column per asset — reuse it rather than rebuilding)
- [ ] Build the calculation once scope is confirmed

## Sign-off

- [ ] Jacson3 and Personal each show a real, Sharesight-sourced annualised return (not a placeholder, not a rebuilt XIRR)
- [ ] STRC dividend schedule confirmed against a real source, not assumed
- [ ] Aggregation across portfolios either built correctly (value-weighted) or explicitly still deferred — not a naive average
