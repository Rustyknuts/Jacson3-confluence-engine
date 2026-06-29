# Phase 2 — Pine Script & Alert Bridge

Goal: TradingView Pine Script overlay computes/plots WSAPT levels and confluence state, and pushes state changes via webhook. This is the highest-skill, most failure-prone phase — budget more iteration time here than the checklist length suggests.

**How to work this checklist with Claude:** Claude can write and review Pine Script, but cannot execute it on TradingView or see your chart. Expect a tighter loop than usual: Claude drafts → you paste into TradingView's Pine Editor → you report the actual error or behavior back → Claude revises. Don't ask for the whole script in one shot; build it in the order below so each piece is testable on its own.

## Step 1 — WSAPT levels on-chart

- [ ] Decide: should Pine Script recompute Tight/Wide/Accum Z1 from `ta.atr(14)` directly on the chart, or should it just plot values pulled from Master_Watchlist? (Recommend: recompute on-chart using the same formula — `Close - 1.5*ATR` etc. — so the chart and the sheet are two independent checks on the same math, not one copying the other)
- [ ] Write the Pine Script `study`/`indicator` skeleton with the ATR(14) calculation
- [ ] Add `plot()` calls for Tight Stop, Wide Stop, Accumulation Zone 1
- [ ] Paste into TradingView Pine Editor on one test asset (recommend starting with an **Active Trailing** holding — e.g. ETH or AVGO — not a **Core Accumulation** holding like BTC/GOOG/AMZN/NVDA/IAA/TSLA, since those don't use the standard Tight/Wide formula at all — see Technical Specification §2)
- [ ] Confirm the plotted lines visually match what Master_Watchlist computes for the same asset at the same Close/ATR

<details>
<summary>Starter script (from the original 5-Day Blueprint, Day 2) — a working base to adapt, not a finished product</summary>

```pinescript
//@version=5
indicator("Jacson3 Advanced Technical Suite", overlay=true)

// User Input Coordinates (update daily from Master_Watchlist)
tightStopInput = input.float(0.0, title="Tight Stop-Loss Floor")
wideStopInput  = input.float(0.0, title="Wide Trend Defender")
accum1Input    = input.float(0.0, title="Accumulation Zone 1")
accum2Input    = input.float(0.0, title="Accumulation Zone 2 (POC)")

// Plotting Dynamic Portfolio Levels
plot(tightStopInput > 0 ? tightStopInput : na, title="Tight Stop", color=color.red, linewidth=2)
plot(wideStopInput > 0 ? wideStopInput : na, title="Wide Trend Defender", color=color.maroon, linewidth=2, linestyle=plot.style_dashed)
plot(accum1Input > 0 ? accum1Input : na, title="Accumulation Zone 1", color=color.green, linewidth=2)
plot(accum2Input > 0 ? accum2Input : na, title="Accumulation Zone 2 (POC)", color=color.blue, linewidth=2, linestyle=plot.style_dashed)

// Core Moving Averages (Golden Cross Analysis)
showSMAs = input.bool(true, title="Show 50 & 200 SMAs")
sma50    = ta.sma(close, 50)
sma200   = ta.sma(close, 200)
plot(showSMAs ? sma50 : na, title="50 Day SMA", color=color.orange, linewidth=1)
plot(showSMAs ? sma200 : na, title="200 Day SMA", color=color.navy, linewidth=2)

// Alert Triggers
alert_tight_break = ta.crossunder(close, tightStopInput) and tightStopInput > 0
alert_wide_break  = ta.crossunder(close, wideStopInput) and wideStopInput > 0
alert_accum_buy   = ta.crossunder(close, accum1Input) and accum1Input > 0

alertcondition(alert_tight_break, title="Tight Stop Loss Breached", message="EXECUTE: Close target position on {{ticker}} to protect capital.")
alertcondition(alert_wide_break, title="Wide Trend Stop Breached", message="LIQUIDATION: Trend has collapsed on {{ticker}}. Exit immediately.")
alertcondition(alert_accum_buy, title="Accumulation Trigger Hit", message="ACCUMULATE: {{ticker}} has entered buying Zone 1.")
```

This version takes the levels as manual inputs rather than computing ATR on-chart — decide in the step above whether to keep that (simpler, but means re-entering values when the sheet changes) or switch to on-chart `ta.atr(14)` computation (matches the "recompute, don't copy" recommendation above). It also doesn't yet branch on Holding Status — Core Accumulation assets would need the wide-stop input wired to the POC-buffer value instead of a flat ATR multiple, with no tight-stop input at all.
</details>

## Step 2 — Alert conditions (lowest-risk, do these before the confluence plot)

- [ ] Add `alertcondition()` for Stop-Loss Breach (price crosses below Tight Stop) — **Active Trailing assets only**
- [ ] Add `alertcondition()` for Accumulation Buy Trigger (price enters Zone 1) — both categories
- [ ] Add `alertcondition()` for Trend Break (price crosses below Wide Stop) — both categories, but treat a Core Accumulation Wide Stop breach as a thesis-failure flag to review, not an automatic sell signal (Technical Specification §2.1)
- [ ] Create the TradingView alerts from these conditions on at least one test asset per category (one Active Trailing, one Core Accumulation)
- [ ] Confirm at least one alert actually fires (force it by adjusting a threshold temporarily, or wait for a real trigger) — don't move on until you've seen one fire for real

## Step 3 — Confluence state plot/label

- [ ] Add a label or plot showing the current Confluence Read state (Strong / Mixed-Watch / Weak)
- [ ] **Reminder, not optional:** the Larsson Line is never computed here. If you want it reflected on this chart, it has to come in as a manual input or a separate alert TradingView's own Larsson Line indicator exposes — not derived from price data in this script
- [ ] Add an `alertcondition()` for Confluence Read state changes

## Step 4 — Webhook end-to-end (prove it before scaling)

- [ ] Set up the webhook URL (Pushover, or whatever endpoint you're using) in TradingView's alert configuration
- [ ] Fire one test alert and confirm it actually reaches your phone/Pushover
- [ ] Check the payload shape — does it include the data you'll need in Phase 3 (asset ticker, alert type, price, timestamp)? If not, adjust the alert message template now, before wiring more alerts to it
- [ ] Repeat for all 4 alert types (Stop-Loss Breach, Accumulation Buy Trigger, Trend Break, Confluence Read change) on the test asset
- [ ] Roll out to the full watchlist once the test asset's alerts are confirmed working

## Sign-off

- [ ] At least one alert of each type has fired for real and been received on your phone
- [ ] Update `DEVELOPMENT_PLAN.md`'s "Current Phase" line to Phase 3
