# Jacson3 Portfolio Project

Jacson3 Ltd is building tooling (Google Sheets data layer, TradingView Pine Script alerts, a Looker Studio dashboard) to manage its investment portfolio: a WSAPT dual-level stop/accumulation framework cross-checked by a multi-indicator "Confluence" score, feeding mobile alerts so positions don't require constant manual chart-watching.

## File links — always provide them when asking for a visual check
Whenever you suggest that the user should visually verify, open, or check a file, **always provide a direct link or file path to the current instance of that file** at the same time. Never just name the file — give them something they can click or navigate to immediately.

Examples of when this applies:
- "Open Master_Watchlist and confirm column A tickers are bare" → provide the Google Sheets link
- "Check the DEVELOPMENT_PLAN.md Current Phase line" → provide the file path or GitHub link
- "Verify the dashboard renders correctly" → provide the local file path or hosted URL
- "Confirm the Sharesight portfolio shows the correct balance" → provide the Sharesight URL

For Google Sheets and Google Drive files, use the actual shareable URL if known. For local project files, use the full path relative to the project root. For GitHub, use the permalink to the file on the current branch.

## Goal

Fund a healthy, active retirement: target a 25% Target Total Annual Return (TTAR) after fees and tax, with investment proceeds intended to be drawn down to support lifestyle. Automation should reduce — not increase — trade frequency; alerts inform a decision, they never auto-execute one.

## Hard constraints

- **No Microsoft *software/cloud* stack** — Office, Excel, OneDrive, Microsoft 365, Edge browser. The OS itself is Windows 11 (that's the actual hardware this runs on) and that's fine; the constraint is specifically about not using Microsoft's productivity/cloud apps for this project's data, docs, or browsing. Master data lives in **Google Sheets** (Google Drive → Investment tools folder); **Looker Studio** is the dashboard/visualisation layer on top of it.
- **TradingView Plus** (account `hummdinger4@gmail.com`) is the live pricing/charting engine — never a placeholder. Any dashboard built outside TradingView is an audit/visualisation layer only, never an independent feed, and must always show the timestamp of its underlying source. Prices used in an actionable recommendation must be **<1hr old** (or an explicit daily close) — never fabricate or estimate a "live" price; leave the field blank/flagged instead.

## Where the deep detail lives

- `.claude/skills/wsapt-confluence/SKILL.md` — binding scope reference for the WSAPT stop/accumulation formulas, the Confluence signal stack, Master_Watchlist's column layout, and the holdings/Sharesight structure. Load it before touching any of that.
- `docs/Jacson3_Technical_Specification.md` — full build-facing spec (source of truth for mechanics; supersedes the old Strategic Objectives doc and Addendum A).
- `docs/Jacson3_Investor_Profile.md` — person-facing risk tolerance, goals, and accounts.
- `ASSUMPTIONS_REGISTER.md` — judgement calls made under incomplete information (e.g. BTC's stop-loss buffer %). Check before treating any specific number as settled fact.

## Known open issue

The FX/Commodity Timing widget in Master_Watchlist still sits at columns P/Q/R. It's documented (Technical Specification §9) as needing to move to column W to avoid colliding with the confluence columns (O–V), but the move hasn't actually been applied yet in the live sheet or the Blueprint doc — see ASSUMPTIONS_REGISTER.md #8.
