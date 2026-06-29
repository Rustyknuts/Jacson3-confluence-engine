# Phase 1 — Data Layer Lock

Goal: Master_Watchlist is fully columned, formula-verified, and has zero ambiguity about manual vs. computed vs. not-yet-wired fields. Everything downstream reads from this.

**How to work this checklist with Claude:** paste or reference this file at the start of the session. Ask Claude to verify each completed item rather than assume it's still true — sheets drift. For unchecked items, give Claude the specific item, not the whole checklist at once; one task per turn keeps the recalculation/verification step honest.

## Foundation (should already be true — verify, don't assume)

- [x] Master_Watchlist columns A–N (original asset table) unchanged in meaning and position
- [x] Column O added: Holding Status (Core Accumulation / Active Trailing), shifting the original confluence columns one place right (now P–V)
- [x] Columns P–V present (Larsson Line Signal, RSI, Bollinger Position, VRVP POC Distance, Pattern Note, Confluence Score, Confluence Read)
- [x] Confluence Score formula (column U) re-pointed to column P (Larsson Line) after the column insert — this broke silently once already when O's meaning changed; re-verify it's still reading P, not O
- [x] FX/Commodity Timing widget relocated from P–S to W–Z to avoid collision
- [x] Internal formula references in the relocated widget updated to match (Q→X, R→Y, S→Z)
- [x] Trend Timing formula row-reference bugs fixed (WTI row was reading Copper's row; Gold row was reading a nonexistent row)
- [x] CEN (Contact Energy), MEL (Meridian Energy), and BABA (Alibaba) added as new rows
- [x] EXC (Exelon) retained alongside CEN/MEL — not replaced
- [x] CEN/MEL/BABA price fields correctly left blank/flagged rather than filled from unverified web search
- [x] Tight/Wide/Accum formulas (columns G/H/I) updated to branch on Holding Status — Core Accumulation gets no tight stop and a POC-buffered wide stop; Active Trailing gets the standard 1.5×/2.5×/1.0× ATR formulas
- [x] Tight/Wide/Accum formulas guard against blank prices (CEN/MEL/BABA) so they show "no price data" rather than silently computing to zero
- [ ] **Re-verify**: open the current Master_Watchlist and confirm all of the above are still true before proceeding — if anyone (including Claude) has touched the sheet since the last session, don't trust this checklist's memory of it

## Before this phase is "done"

- [x] Get one real, single-source, timestamped TradingView price for CEN — **done: Close 9.99, ATR 0.371. Peak Price is still a placeholder (set equal to Close) — real 52-week high not yet located.**
- [x] Get one real, single-source, timestamped TradingView price for MEL — **done: Close 5.75, ATR 0.170, 52wk high 6.04. Fully clean, no placeholders.**
- [x] Get one real, single-source, timestamped TradingView price for BABA — **done: Close 94.81, ATR 3.52, 52wk high 192.13. Fully clean, no placeholders. Note: ~51% off 52wk high, a real large drawdown, not a data error.**
- [x] Confirm Active Trailing assets populate Tight/Wide/Accum Z1 correctly once price + ATR are entered — **confirmed for CEN, MEL, BABA**
- [ ] Find CEN's real 52-week high on TradingView and replace the current placeholder Peak Price (currently set equal to Close as a non-fabricated stand-in)
- [x] **BTC wide stop calibrated**: POC read from 12-month Fixed Range Volume Profile = $68,308. Wide stop = POC × 0.65 (35% buffer) = $44,400.20. BTC is a special case — see ASSUMPTIONS_REGISTER.md §1 for full reasoning (its historical 50-80% drawdowns are normal cyclical behavior, not thesis failure, so a POC-percentage buffer fits better than an ATR multiple here).
- [x] **GOOG/AMZN/NVDA/IAA/TSLA wide stop formula decided**: these five use the same formula as Active Trailing's wide stop (`Close − 2.5×ATR`), not a POC buffer — see ASSUMPTIONS_REGISTER.md §2. POC (column J) is no longer part of their wide-stop calculation; it remains available for manual accumulation-zone reference only.
- [ ] Confirm each of GOOG/AMZN/NVDA/IAA/TSLA's resulting wide stop (now live via the ATR formula) looks sensible against their real charts — this is a sanity check, not a fresh calibration, since the formula is already the same one validated for Active Trailing assets
- [x] Decide: do columns Q–T (RSI, Bollinger, VRVP, Pattern) get a standardized text convention now (e.g. exactly "Bullish"/"Neutral"/"Bearish" for the ones that support it) or stay free-form? — **decided: stay free-form for now, revisit once Phase 2 (Pine Script) clarifies what the alert/webhook payloads actually need.** Confluence Score continues to read only Larsson Line (P) + Global Analyst Macro (L) until this is revisited.
- [ ] Recalculate the full workbook and confirm zero formula errors (`recalc` or equivalent — don't eyeball it)
- [ ] Spot-check at least 3 Active Trailing rows by hand: pick an asset, manually compute Tight Stop = Close − 1.5×ATR, confirm the sheet matches
- [ ] Spot-check at least 1 Core Accumulation row by hand: confirm column G shows "n/a (no tight stop)" and column H reflects the POC-buffer logic, not a generic ATR multiple

## Sign-off

- [ ] You've personally opened the sheet (not just read Claude's description of it) and confirmed the above
- [ ] Update `DEVELOPMENT_PLAN.md`'s "Current Phase" line to Phase 2 once this is checked off
