# Jacson3 Portfolio: High-Velocity 5-Day Implementation Blueprint (Prastine Master) - LATEST

This sprint blueprint condenses the optimization of your investment management workspace into **five highly structured, 2-hour daily sessions**. It is custom-tailored for your Lenovo Yoga 7i triple-monitor workspace, providing an alert-driven, institutional-grade management pipeline so you can step away from your screens with confidence.

## Investor Profile & Hardware Configuration

- **Target Total Annual Return (TTAR):** 25% (annualized return CAGR measured via XIRR).
- **Workstation Layout:** * **Samsung 32" TV (Upper Area):** Live TradingView charting engine (SMA 50/200, Bollinger Bands, Volume Profiles, 'Larsson Line').
  - **LG 23" Monitor (Middle Area):** Google Looker Studio watchlists, risk levels, and private equity analyst panels.
  - **Lenovo Yoga 7i Laptop (Lower Area):** Master Google Sheets Database, STRC income tracker, currency crosses, and macro analysis.
- **Risk Discipline:** Dynamic dual-level stops adjusted to daily ATR volatility. Strict < 1-hour data age audit required before any execution.

## Day 1: The Core Data Engine & Live FX/Commodity Ingestion

- **Time Allocation:** 2 Hours
- **Focus:** Developing your master Google Sheets database with automated FX crosses, commodity tracking, and a strict < 1-hour data aging check.
- **Tasks:**
  1. **Sheet Creation:** Open Google Sheets on your Lenovo Yoga 7i. Create a workbook named `Jacson3_Watchlist_DB`. Setup four tabs: `Master_Watchlist`, `TV_Imports`, `STRC_Income`, and `Theses_Source`.
  2. **Establish Database Columns:** On `Master_Watchlist`, create the following header structure in Row 1:
    - `A: Ticker` | `B: Asset Name` | `C: Category` (Crypto / Tech Share / Regional Utility) | `D: Latest Close` | `E: Peak Price` | `F: Daily ATR (14)` | `G: Tight Stop (Preservation)` | `H: Wide Stop (Trend Defender)` | `I: Accumulation 1 (Pullback)` | `J: Accumulation 2 (POC)` | `K: PE Analyst Fundamentals` | `L: Global Analyst Macro` | `M: Last Import Timestamp` | `N: Data Status`
  3. **Input Mathematical Logic:** Write formulas for row 2 (drag down for all assets):
    - **Tight Stop (1.5 ATR preservation floor):** `=E2-(1.5*F2)`
    - **Wide Stop (2.5 ATR trend floor):** `=E2-(2.5*F2)`
    - **Accumulation Zone 1 (1.2 ATR pullback):** `=E2-(1.2*F2)`
    - **Accumulation Zone 2:** Keep as manual entry to input Point of Control (POC) structural support levels derived from your TradingView VRVP charts (such as your ALAB support floor).
  4. **The < 1-Hour Safety Audit (Dynamic):**
    - In the `Data Status` column, write this validation formula to protect against stale executions: `=IF(NOW()-M2 > TIME(1,0,0), "⚠️ STALE DATA (>1HR)", "✅ AUDITED - PRICE ACCURATE")`
    - Apply Conditional Formatting to column N: If text starts with `"⚠️"`, color the row **Muted Amber**.
  5. **Dynamic FX Timing & Commodity Panels:**
    - Leave **Column O** completely blank as a visual buffer.
    - Build your Macro Timing widget in **Columns P, Q, and R** starting at Row 1 using these formulas and notes:

| **Row** | **Column P (Label)** | **Column Q (Active Value Formula)** | **Column R (Sophisticated Timing & Trend Signal Formula)** |
| --- | --- | --- | --- |
| **1** | **FX & Commodity Timing** | **Current Value** | **Trend Timing & Strategy Signal** |
| **2** | NZD / USD | `=GOOGLEFINANCE("CURRENCY:NZDUSD")` | `=IF(AND(Q2>0.62, Q2>AVERAGE(INDEX(GOOGLEFINANCE("CURRENCY:NZDUSD", "price", TODAY()-50, TODAY()), 0, 2))), "🔥 PRIME BUY USD (NZD Strong > 0.62 & Above 50-day SMA - Sweep NZD to USD Assets)", IF(AND(Q2<0.59, Q2<AVERAGE(INDEX(GOOGLEFINANCE("CURRENCY:NZDUSD", "price", TODAY()-50, TODAY()), 0, 2))), "🛑 HOLD NZD (NZD Weak < 0.59 & Below 50-day SMA - Let USD Holdings Float / Do Not Convert)", IF(Q2>AVERAGE(INDEX(GOOGLEFINANCE("CURRENCY:NZDUSD", "price", TODAY()-50, TODAY()), 0, 2)), "📈 NZD BULLISH COIL (Kiwi Above 50-day SMA - Mid-range Strength)", "📉 NZD BEARISH SPREAD (Kiwi Below 50-day SMA - Mid-range Weakness)")))` |
| **3** | NZD / AUD | `=GOOGLEFINANCE("CURRENCY:NZDAUD")` | `=IF(Q3>AVERAGE(INDEX(GOOGLEFINANCE("CURRENCY:NZDAUD", "price", TODAY()-50, TODAY()), 0, 2)), "📈 BUY ASX UTILITIES (Kiwi Stronger than Aussie - High ASX Purchasing Power)", "📉 HOLD NZ baseloads (Aussie Stronger than Kiwi - Hold local NZX utility yields)")` |
| **4** | WTI Crude Oil | `=GOOGLEFINANCE("USO")` | `=IF(Q4>AVERAGE(INDEX(GOOGLEFINANCE("USO", "price", TODAY()-50, TODAY()), 0, 2)), "⚠️ ENERGY INFLATION SQUEEZE (USO above 50-day SMA - Watch NZ retail petrol/logistics margin pressure)", "✅ COOLDOWN (USO below 50-day SMA - Easing transport costs & favorable consumer context)")` |
| **5** | Copper (Infrastructure) | `=GOOGLEFINANCE("COPX")` | `=IF(Q5>AVERAGE(INDEX(GOOGLEFINANCE("COPX", "price", TODAY()-50, TODAY()), 0, 2)), "🚀 DC DEMAND EXPANSION (COPX above 50-day SMA - Structural cooling & grid buildout supportive for NEXTDC/MRVL)", "📉 COMMODITY RE-ACCUMULATION (COPX below 50-day SMA - Base building / macro consolidation)")` |
| **6** | Gold (Liquidity) | `=GOOGLEFINANCE("GLD")` | `=IF(Q6>AVERAGE(INDEX(GOOGLEFINANCE("GLD", "price", TODAY()-50, TODAY()), 0, 2)), "📈 MONETARY DEBASEMENT HEDGE (Gold above 50-day SMA - Defensive/liquidity preservation focus active)", "📉 RISK-ON SIDELINES (Gold below 50-day SMA - Capital rotating heavily to tech/cryptos)")` |

6. **Data Ingestion Run:**
  - Export your daily watchlist from your `hummdinger4@gmail.com` TradingView account to a CSV.
  - Import it directly into `TV_Imports` using `File -> Import -> Replace data in selected sheet`.
  - Use `=XLOOKUP(A2, TV_Imports!A:A, TV_Imports!B:B)` in Column D to update your prices instantly. Use `=NOW()` in Column M to refresh your audit timestamp.
- **Deliverable:** An active, self-auditing Google Sheet database managing USD, AUD, and NZD assets alongside a description-rich, real-time macroeconomic timing panel.

## Day 2: Pine Script v5 Technical Overlay (Samsung 32" TV Console)

- **Time Allocation:** 2 Hours
- **Focus:** Coding the indicator overlay for your Samsung 32" TV to display your custom dynamic levels alongside Bollinger Bands, RSI, and coordinates for your 'Larsson Line'.
- **Tasks:**
  1. Open TradingView on your Samsung 32" TV, navigate to the Pine Editor, and paste the code below:

//@version=5

indicator("Jacson3 Advanced Technical Suite", overlay=true)

// User Input Coordinates (Updated daily from your Day 1 Master Google Sheet)

tightStopInput = input.float(0.0, title="Tight Stop-Loss Floor")

wideStopInput  = input.float(0.0, title="Wide Trend Defender")

accum1Input    = input.float(0.0, title="Accumulation Zone 1")

accum2Input    = input.float(0.0, title="Accumulation Zone 2 (POC)")

// Plotting Dynamic Portfolio Levels

plot(tightStopInput > 0 ? tightStopInput : na, title="Tight Stop", color=color.red, style=plot.style_line, linewidth=2)

plot(wideStopInput > 0 ? wideStopInput : na, title="Wide Trend Defender", color=color.maroon, style=plot.style_line, linewidth=2, linestyle=plot.style_dashed)

plot(accum1Input > 0 ? accum1Input : na, title="Accumulation Zone 1", color=color.green, style=plot.style_line, linewidth=2)

plot(accum2Input > 0 ? accum2Input : na, title="Accumulation Zone 2 (POC)", color=color.blue, style=plot.style_line, linewidth=2, linestyle=plot.style_dashed)

// Core Moving Averages (Golden Cross Analysis)

showSMAs = input.bool(true, title="Show 50 & 200 SMAs")

sma50    = ta.sma(close, 50)

sma200   = ta.sma(close, 200)

plot(showSMAs ? sma50 : na, title="50 Day SMA", color=color.orange, linewidth=1)

plot(showSMAs ? sma200 : na, title="200 Day SMA", color=color.navy, linewidth=2)

// Volatility Channels (Bollinger Bands)

length = input.int(20, title="Bollinger Length")

mult   = input.float(2.0, title="Bollinger StdDev")

basis  = ta.sma(close, length)

dev    = mult * ta.stdev(close, length)

upper  = basis + dev

lower  = basis - dev

p_upper = plot(upper, "BB Upper", color=color.new(color.gray, 50), style=plot.style_dotted)

p_lower = plot(lower, "BB Lower", color=color.new(color.gray, 50), style=plot.style_dotted)

fill(p_upper, p_lower, color=color.new(color.gray, 95), title="Bollinger Channel")

// Alert Triggers

alert_tight_break = ta.crossunder(close, tightStopInput) and tightStopInput > 0

alert_wide_break  = ta.crossunder(close, wideStopInput) and wideStopInput > 0

alert_accum_buy   = ta.crossunder(close, accum1Input) and accum1Input > 0

alertcondition(alert_tight_break, title="🚨 Tight Stop Loss Breached!", message="EXECUTE: Close target position on {{ticker}} to protect capital.")

alertcondition(alert_wide_break, title="🔥 Wide Trend Stop Breached!", message="LIQUIDATION: Trend has collapsed on {{ticker}}. Exit immediately.")

alertcondition(alert_accum_buy, title="🟢 Accumulation Trigger Hit", message="ACCUMULATE: {{ticker}} has entered buying Zone 1.")

2. Save this script on your TradingView Plus account as `Jacson3 Portfolio Advanced Overlay`.
3. Overlay this script alongside your **RSI**, **VRVP Volume Profile**, and **'Larsson Line'** indicators.
- **Deliverable:** A compiling, institutional-grade Pine script on your charting console plotting dual stops, moving averages, and volatility bands.

## Day 3: Triple-Display Workspace Setup & Phone Webhook Configuration

- **Time Allocation:** 2 Hours
- **Focus:** Establishing the physical connection of your triple-screen array and configuring high-priority mobile alerts.
- **Tasks:**
  1. **Physical Cable & Handshake Setup:**
    - Connect your Lenovo Yoga 7i laptop to your LG 23" monitor using your Belkin Connect USB-C Thunderbolt cable, and use your HDMI cable to connect your Samsung 32" TV.
    - Open Windows 11 Display Settings. Align your displays sequentially:
      - **Samsung 32" TV (Upper Display):** Set to 1920x1080 resolution. Display your TradingView charting pane.
      - **LG 23" Monitor (Middle Display):** Dedicated dashboard display for your visual Looker Studio interface.
      - **Lenovo Yoga 7i (Lower Display):** Lower control console for your active Google Sheets database, STRC high-yield tracker, and research documents.
  2. **TradingView Mobile Bridge Setup:**
    - Install the TradingView App on your mobile device. Enable background permissions and set up high-priority, distinctive sounds for app notifications.
    - In TradingView, create a test alert on an asset (such as BTC) on a 1-minute chart.
    - Under the alert actions, check **Notify on App**, **Send Email**, and configure your custom alert payload (which can be linked via Webhooks to pushing platforms like Pushover to send high-volume, siren-style alerts directly to your phone while cycling or hiking).
    - Physically test the setup: step away from your desk, trigger an alert, and verify your phone rings immediately with the exact target ticker and pricing.
- **Deliverable:** A unified, physical workstation layout matching your physiological line-of-sight and a bulletproof mobile webhook bridge.

## Day 4: Looker Studio Interactive Dashboard (Private Equity & Macro Views)

- **Time Allocation:** 2 Hours
- **Focus:** Constructing your visual dashboard on Looker Studio to display technical trends alongside expert analyst commentary.
- **Tasks:**
  1. **Connect Looker Studio:** Open [Google Looker Studio](https://lookerstudio.google.com/), select a Blank Report, and connect your `Jacson3_Watchlist_DB` Google Sheet database as your primary data source.
  2. **Page Configuration:** Create a widescreen canvas (1920x1080) to render cleanly on your central LG 23" display. Install a side navigation panel to switch between two pages:
    - **Tab 1: High-Velocity Cryptocurrencies:** Create tables showing crypto assets: `BTC, SOL, ETH, JUP, USDC, SUI, PYTH, RAY, GRT, SKR, NOS`. Include metrics for close prices, RSI levels, distance from the 200 SMA, and your dynamic stop levels.
    - **Tab 2: High-Conviction Global Shares:** Filter tables to show your tech equities and defensive utilities. Set up conditional highlights: code cells in **Bold Green** if the 50 SMA is above the 200 SMA, and in **Soft Crimson** if trading below both.
  3. **Analyst Commentary Integrations:** Drag two large, multi-line text boxes into your Looker Studio tabs and link them to your Google Sheet commentary cells:
    - **PE Analyst Fundamentals Panel:** Displaying short, medium, and long-term fundamental perspectives for individual holdings.
    - **Global Analyst Macro Panel:** Displaying structural global macroeconomic trends affecting specific assets.
  4. **Data Verification:** Verify that refreshing your Google Sheet immediately updates your Looker Studio dashboard.
- **Deliverable:** An interactive, widescreen dashboard on your central monitor that integrates technical signals, PE fundamentals, and macroeconomic overlays.

## Day 5: CAGR Return Modeling, Income Calendars & The Weekly AI Engine

- **Time Allocation:** 2 Hours
- **Focus:** Establishing your performance ledgers, STRC income projections, and an updatable weekly intelligence reporting engine.
- **Tasks:**
  1. **Staggered Portfolio Return (XIRR) Engine:**
    - On your Google Sheet, open the `Performance_XIRR` tab.
    - Create a ledger: `Date` | `Cash Flow Amount` | `Notes`.
    - Input all capital deposits and withdrawals, treating your initial and recurring cash infusions as negative values, and your current total portfolio value as the final positive value.
    - Calculate your precise Compound Annual Growth Rate (CAGR) using this dynamic equation: `=XIRR(B2:B50, A2:A50, 0.1)`
  2. **STRC Fixed-Income Projections:**
    - On your `STRC_Income` tab, map ex-dividend dates and semi-monthly payment cycles for STRC on Moomoo Australia.
    - Track ex-dividend schedules (falling on the 15th and last day of each month) to project incoming dividend income flows against your 11.50% variable yield.
  3. **The Updatable Theses Engine:**
    - On the `Theses_Source` tab, write down your current strategic theses:
      - *AI Infrastructure (NEXTDC, Marvell custom silicon, and Nvidia).*
      - *Space Technology (Rocket Lab launches, SpaceX IPO liquidity dynamics).*
      - *Regional Hydrology (El Niño weather effects on South Island rainfall, Contact, and Meridian).*
      - *Commodity Overheads (Copper, Crude oil impact on transport overheads).*
    - Copy this text to feed into your AI Weekly Intelligence template below:

WEEKLY UPDATE PROMPT TEMPLATE:

"Act as the lead macro research partner for the Jacson3 investment portfolio.

Review my master theses document, current USD/AUD/NZD currency crosses, global crude oil and copper commodity trends, and APAC news.

Generate a structured, 300-word weekly briefing covering:

1. Macro developments in AI infrastructure, Space sectors (Rocket Lab, SpaceX IPO vacuum), and Regional Hydrology (El Niño impacts on Meridian and Contact).

2. Key commodity trends (crude oil, metals) affecting our holdings.

3. Currency market overview (USD, AUD, NZD) with actionable market timing commentary on when to exchange currencies.

4. Short-term and medium-term PE Analyst fundamental perspective and Global Analyst macro perspective for our watchlist assets.

5. Recommended trailing stop modifications based on weekly ATR adjustments.

*IMPORTANT SECURITY RULE: Check pricing data timestamps. Always state the pricing data age at the top, and do not make actionable recommendations if data is older than 1 hour.*"

- **Deliverable:** An accurate performance return ledger, STRC dividend cash flow engine, and an updatable Weekly AI analysis reporting loop to run every weekend.
