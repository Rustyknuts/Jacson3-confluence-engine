# Jacson3 Portfolio — Assumptions Register

This document exists because several decisions in this project were made as reasonable starting points under incomplete information, not as settled, evidence-backed conclusions. Treat every entry here as **provisional** — each one should be revisited when the trigger condition is met, not left to quietly calcify into unquestioned scope the way the original flat 20% stop-loss rule did.

**How to use this document:** when you or Claude make a judgment call that isn't fully derived from hard data — a number picked because it "seemed reasonable," a rule applied to assets it wasn't specifically checked against, a deferred decision standing in for a real one — add it here with the reasoning, not just the conclusion. When a trigger condition is met, revisit the entry and update its status rather than deleting it; the history of *why* something changed is as useful as the current value.

---

## Status key
- 🟡 **Active assumption** — currently in use, not yet revisited
- 🟢 **Confirmed** — checked against real data/outcome, holding up
- 🔴 **Revised** — turned out wrong or insufficient, see the entry's update note
- ⚪ **Retired** — no longer applicable (e.g. the thing it was about was removed)

---

## 1. BTC's Core Accumulation wide-stop buffer: 35% below POC

**Status:** 🟡 Active assumption

**What was decided:** BTC's wide stop = POC × 0.65 (35% below its Fixed-Range Volume Profile Point of Control). With POC at $68,308 (12-month fixed range, read 2026-06-29), this sets the wide stop at approximately $44,400.

**Reasoning at the time:** BTC's wide stop is meant to be a thesis-failure backstop, not a trigger for ordinary volatility. Search-sourced data at the time showed BTC's realistic 12-month range as roughly $58K–$126K, with a -44% trailing 12-month change, and historical drawdowns of 50-80% are well-documented as *normal* cyclical behavior for BTC (2022: -77%; 2025 alone: $126K→~$80K). An ATR-based multiple (tested at 2× and 4×ATR) would have placed the wide stop inside or barely below that normal historical range — meaning an ordinary bad year could trigger what's supposed to be a "thesis broke" signal. 35% below POC was chosen to sit below the realistic floor of normal cyclical drawdowns without being so wide it would never trigger under any circumstance.

**Why this might need revisiting:**
- The 35% figure was Claude's recommendation, accepted without independently modeling historical BTC drawdown percentiles — it's a reasoned estimate, not a backtested number.
- POC will drift every time the Fixed Range Volume Profile window is re-anchored or the lookback period changes — this stop should be recalculated whenever POC is re-read, not treated as permanent.
- If BTC has a genuinely structural negative event (the "cryptographic vulnerability" scenario named in the Investor Profile), 35% may turn out to be too wide (doesn't trigger fast enough) or the framing may need to change entirely — a true thesis-failure event might warrant immediate manual action regardless of what any stop level says.

**Revisit when:** the POC is re-read on a materially different lookback window; after any cycle where BTC's realistic drawdown range becomes clearer with more data; or if this stop is ever actually approached, as a real test of whether 35% was the right distance.

---

## 2. GOOG/AMZN/NVDA/IAA/TSLA's Core Accumulation wide-stop: ATR-based, not POC-based

**Status:** 🟡 Active assumption — formula now resolved and implemented

**What was decided:** Unlike BTC, the other five Core Accumulation assets' wide stop uses the identical formula to Active Trailing's wide stop: `Close − 2.5×ATR(14)`. POC (column J) is not used in their wide-stop calculation at all — Core Accumulation's only remaining structural difference from Active Trailing for these five assets is having no tight stop (column G shows "n/a"); the wide stop itself is calculated the same way as any Active Trailing asset.

**Reasoning at the time:** BTC's extreme historical drawdown range (50-80%+ as normal cyclical behavior) doesn't describe GOOG/AMZN/NVDA/IAA/TSLA, which are large-cap equities with materially different volatility profiles. Applying BTC's 35%-below-POC convention to all six Core Accumulation assets would have been treating them as more alike than they are — this was caught and corrected mid-session. Once BTC was carved out as a special case, the simplest defensible default for the remaining five was to reuse the existing, already-validated Active Trailing wide-stop formula rather than invent a third formula shape.

**Why this might need revisiting:**
- Core Accumulation and Active Trailing now only differ by the presence/absence of a tight stop for five of the six assets in this category — worth checking later whether that's still a meaningful enough distinction, or whether it quietly erodes the point of having two categories at all.
- Equities can still have idiosyncratic structural risk (e.g. a regulatory action, an accounting scandal) that a generic ATR multiple won't distinguish from normal volatility — the same "is this a thesis failure or just noise" question that drove BTC's approach applies here too, just less extremely, and isn't really addressed by this choice.
- TSLA in particular was already flagged in the Investor Profile as more volatility-prone and subject to "occasional selling" than the other four — a uniform 2.5×ATR multiple across all five may not fit TSLA as well as it fits GOOG/AMZN/NVDA/IAA.

**Revisit when:** after observing how each asset's wide stop actually sits relative to real historical drawdowns once a year or more of data has passed; if TSLA's behavior diverges noticeably from the other four; if the Core-vs-Active distinction starts to feel like it isn't doing meaningful work for these five assets.

---

## 3. RSI/Bollinger/VRVP (columns Q/R/S) left free-form, not standardized

**Status:** 🟡 Active assumption

**What was decided:** Columns Q (RSI), R (Bollinger Position), S (VRVP POC Distance) remain free-text notes rather than being constrained to exact "Bullish"/"Neutral"/"Bearish" values, unlike column P (Larsson Line Signal) which already uses that convention.

**Reasoning at the time:** Standardizing now, before Phase 2 (Pine Script) clarifies what the alert/webhook payload actually needs to consume, risked locking in a convention that doesn't match the real downstream requirement. Deferring costs little — the Confluence Score formula already only reads Larsson Line (P) and column L, **"Global Analyst Macro"** — which is notably *not* one of the 7 signals in the Technical Specification's §4.1 signal stack at all; it's a substitute being used in the interim, not the spec'd design. With that substitution in place, these three columns (Q/R/S) aren't blocking anything currently functional.

**Why this might need revisiting:** the Confluence Score is currently less automated than the full design in the Technical Specification describes (§4.1's full signal stack includes RSI, Bollinger, VRVP as Medium/High-weight inputs) — this deferral is the reason those weights aren't actually being applied yet. The longer this stays deferred, the longer the Confluence Score under-represents the intended multi-indicator design.

**Revisit when:** Phase 2 (Pine Script) is underway and the webhook payload format is clearer; or proactively, if it's been more than a month or two without revisiting.

---

## 4. "Jacson3 ASB Securities" left as a dormant historical record, not archived

**Status:** 🟡 Active assumption

**What was decided:** Confirmed zero balance, but the empty Sharesight portfolio is being left in place rather than archived/retired.

**Reasoning at the time:** No clear benefit to archiving immediately; explicitly framed as "revisit if this becomes problematic."

**Why this might need revisiting:** if it ever causes confusion in a holdings pull (Phase 5C), shows up unexpectedly in an aggregate report, or simply accumulates enough dormant clutter to be worth tidying.

**Revisit when:** any of the above happens, or during a periodic Sharesight cleanup.

---

## 5. CEN's Peak Price is a placeholder (set equal to Close), not a real 52-week high

**Status:** 🟡 Active assumption — should be resolved soon, not a long-term assumption

**What was decided:** CEN's Peak Price was set equal to its Latest Close (9.99) as a temporary, clearly-non-fabricated stand-in, because the real 52-week high hadn't been located on TradingView yet at time of entry.

**Reasoning at the time:** Leaving the cell blank risked breaking the drawdown-from-peak calculation elsewhere; entering a guessed number would have violated the project's core data-integrity rule. Setting Peak = Close is the only option that's both non-fabricated and numerically safe (drawdown reads as 0% rather than nonsense).

**Why this might need revisiting:** until the real 52-week high is entered, CEN's drawdown-from-peak metric will always read as 0%, which is misleading if anyone glances at it without knowing it's a placeholder.

**Revisit when:** immediately, next time CEN's chart is open — this is the one entry in this register that should be resolved quickly rather than left open-ended.

---

## 6. Sharesight is the system of record for portfolio holdings, not a custom broker API

**Status:** 🟢 Confirmed — checked against real documentation, not just assumed

**What was decided:** Jacson3_Holdings and Personal_Holdings tabs source data via Sharesight's API (once requested/connected), fed by Sharesight's existing direct integrations with Sharesies and Moomoo, rather than building against either broker's own API.

**Reasoning at the time:** Sharesies has no public API at all (only unofficial, ToS-risky clients exist). Moomoo has an official API but requires standing up a local gateway program with live trading credentials. Both brokers have official, sanctioned direct Sharesight integrations instead, and Sharesight has a real API for customers to pull their own data.

**Why this is marked Confirmed rather than Active:** this was independently verified via web research into each platform's actual documented capabilities at the time, not just an assumption taken at face value — though "confirmed" still means "confirmed as of the date below," not "permanently true," since broker API offerings do change.

**Revisit when:** if Sharesight ever changes its API access policy or pricing tier requirements; if either broker discontinues their direct Sharesight integration; periodically, since this kind of platform capability claim has a shelf life.

---

## 7. Annualised return for Jacson3/Personal is pulled from Sharesight, not recalculated

**Status:** 🟢 Confirmed — reasoning checked, not yet validated against a live pulled number

**What was decided:** Don't rebuild XIRR from an averaged cost basis in this project. Pull Sharesight's own annualised return figure via its API once Phase 5C's data pull exists.

**Reasoning at the time:** Sharesight has the real per-lot trade dates from the broker sync; an averaged cost basis in Master_Watchlist does not, and XIRR's accuracy depends on that timing information. Rebuilding it independently would be both redundant and less accurate than the number Sharesight already computes.

**Why this might need revisiting:** this hasn't yet been checked against an actual pulled Sharesight figure — the reasoning is sound, but "Sharesight's number is right" should be spot-checked against the Sharesight UI directly once real data exists (this is already a checklist item in 05c, not just an assumption sitting here unexamined).

**Revisit when:** Phase 5C's API pull is live — confirm the first real pulled figure against Sharesight's own UI before treating it as routine.

---

## 8. FX/Commodity Timing widget column relocation

**Status:** 🟡 Active assumption — documented but not yet executed

**What was decided:** Addendum A (and the current Technical Specification, which carries the same note forward) specify that the FX/Commodity Timing widget in Master_Watchlist must move from columns P/Q/R to column W, to avoid colliding with the new confluence-data columns (O–V) added to the main asset table.

**Reasoning at the time:** When confluence-data columns were extended across O–V, the existing FX/Commodity widget at P/Q/R fell inside that range. Relocating it to column W was identified as the fix and recorded in both Addendum A and the Technical Specification's column reference (§9) — but documenting the fix and actually applying it are two different steps, and only the first has happened.

**Why this might need revisiting:** This relocation has NOT actually been applied in the live Google Sheet or in the Blueprint document — the Blueprint docx still shows the widget at its old P/Q/R position. The Technical Specification's column reference (§9) already assumes the move has happened, which it hasn't yet. Until this is fixed, there's a live discrepancy between what the Tech Spec describes and what the actual Master_Watchlist sheet and Blueprint document contain — anyone editing either column range without checking both files risks operating on stale assumptions.

**Revisit when:** Needs manual fix in the actual Master_Watchlist sheet (move FX/Commodity widget from P/Q/R to column W), then the Blueprint doc should be updated to match. Mark this entry Confirmed/Retired once both steps are done.

---

## 9. Confluence Score (column U) silently scores non-Bullish/Neutral/Bearish "Global Analyst Macro" labels as Neutral

**Status:** 🟡 Open issue — not yet a judgement call with a chosen resolution; flagging as needing a decision

**What's happening:** Column L ("Global Analyst Macro") sometimes holds labels outside the Bullish/Neutral/Bearish convention (e.g. NVDA → "High Growth", EXC → "Defensive"). The Confluence Score formula in column U only recognizes the literal strings "bullish" and "bearish" — anything else, including these legitimate but differently-worded macro reads, silently scores as 0 (Neutral). This means NVDA and EXC's Confluence Scores currently reflect "no opinion" on this input when the actual analyst input was a real, specific view the formula can't parse.

**Affected rows:** A full re-check of L2:L33 found five rows whose value isn't exactly "bullish"/"neutral"/"bearish": **NVDA** ("High Growth") and **EXC** ("Defensive") both hold a real, specific analyst view the formula can't parse, and so score as 0 by accident. **CEN**, **MEL**, and **BABA** all hold "N/A" — a different case (no live opinion entered at all, consistent with these three already being flagged elsewhere as missing live price data), but it hits the same silent-zero mechanism.

**Options to resolve (not deciding here, just listing):**
1. Standardize column L's values to strictly Bullish/Neutral/Bearish, moving nuance (e.g. "Defensive", "High Growth") into a free-text note elsewhere.
2. Expand the formula to map known non-standard labels to a score (e.g. "Defensive" → slightly bearish/neutral, "High Growth" → bullish) — fragile, breaks on any new unlisted label.
3. Leave as-is but flag explicitly in the dashboard when L's value isn't one of the three recognized states, so it's visibly "unscored" rather than silently defaulting to 0.

**Revisit when:** before treating any Confluence Read of "Mixed/Watch" as meaningful for an asset whose column L value isn't exactly bullish/neutral/bearish — check the raw L value directly rather than trusting U for that asset until this is resolved.

---

## Adding new entries

Format for new entries: **what was decided**, **the reasoning at the time** (so a future session understands why it seemed right, not just what was chosen), **why this might need revisiting** (the specific failure mode to watch for, not just "things change"), and **revisit when** (a concrete trigger, not "eventually"). An assumption without a revisit trigger tends to never get revisited.
