# Jacson3 Investment Portfolio

Personal investment portfolio management system: a WSAPT (dual-level stop-loss/accumulation) risk engine, a multi-indicator "Seeking Confluence" scoring strategy, a live dashboard, TradingView Pine Script alerts, and supporting macro/returns tooling.

## Start here

1. Read `DEVELOPMENT_PLAN.md` — explains what's built, what's next, and why the phases are ordered the way they are.
2. Check `CHECKLISTS/` for the phase you're currently on.
3. Read `docs/Jacson3_Investor_Profile.docx` (who the investor is, risk tolerance, holding categories, accounts) and `docs/Jacson3_Portfolio_Technical_Specification.docx` (how the system works — this replaces the old Strategic Objectives PDF and Addendum A, which are retired).
4. Check `ASSUMPTIONS_REGISTER.md` for judgement calls that were made without full certainty (e.g. BTC's wide-stop buffer percentage) — each entry says why it might need revisiting and what would trigger that.
5. The `.claude/skills/wsapt-confluence/` skill loads automatically in Claude Code or Cowork sessions in this repo — it encodes the locked scope decisions (no Microsoft products, TradingView as source of truth, holding categories, confluence signal weights, the Larsson Line handling rule, the tax-relevant trade-frequency principle) so you don't need to re-explain them each session.

## Current state (update this as the project progresses)

- **Data layer**: Master_Watchlist restructured around two holding categories (Core Accumulation, Active Trailing — see Technical Specification §2) rather than the earlier looser groupings. BABA added alongside the existing CEN/MEL addition. Core Accumulation's wide stop is correctly flagged as needing real per-asset POC data before it's anything more than a placeholder. Two new tabs — `Jacson3_Holdings` and `Personal_Holdings` — separate actual portfolio positions from the technical/confluence reference layer; both scaffolded but not yet populated with real data (see Technical Specification §8 and CHECKLISTS/05c).
- **Dashboard**: working self-contained prototype with real watchlist data, manual confluence input panel, macro/FX panel. Not yet wired to a live feed, and not yet updated for the new Holding Status column — see Technical Specification §5.2.
- **Pine Script / alerts**: not yet started.
- **Macro intelligence**: partially built (FX/commodity panel, theses cards). Missing an explicit link between each thesis and the watchlist assets it should influence.
- **Returns/dividend calculator**: not yet started. Annualised return for Jacson3/Personal will be pulled from Sharesight's own calculation (not rebuilt) once the holdings tabs above have real data — see Technical Specification §8.2.

## Key constraints (full detail in the skill / Technical Specification)

- No Microsoft products anywhere in this project.
- TradingView Plus is the live data source of record — anything else is a visualization layer on top of it.
- Every price used in a recommendation must show its age; flag anything over 1 hour old as stale. Never fabricate a price from an unverified search result — leave it blank and flagged instead (current examples: CEN, MEL, BABA).
- Two holding categories only — Core Accumulation (no tight stop, POC-buffered wide stop as a thesis-failure backstop) and Active Trailing (standard 1.5×/2.5× ATR dual stop). No flat-percentage stop anywhere.
- The Larsson Line (CTO Larsson's proprietary indicator) is never computed or approximated — only its reported chart state is ever used, as a manual or webhook input.
- Alerts inform; they never auto-execute. Trade frequency is kept low partly for capital preservation and partly because frequency may be tax-relevant for Jacson3 Ltd. — confirm specifics with the accountant, not this document.
