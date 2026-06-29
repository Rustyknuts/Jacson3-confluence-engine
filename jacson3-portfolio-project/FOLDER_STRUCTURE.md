# Jacson3 Portfolio — Project Folder Structure

This structure is designed to work identically whether you're driving it from Claude Code (terminal) or Cowork (desktop app) — both read the same `.claude/skills/` convention, and nothing here assumes a terminal exists.

```
jacson3-portfolio/
├── DEVELOPMENT_PLAN.md          ← the phased plan, start here every session
├── FOLDER_STRUCTURE.md          ← this file
├── ASSUMPTIONS_REGISTER.md      ← judgement calls made without full certainty; what to revisit and when
├── README.md                    ← short orientation for anyone (including future-you) opening this cold
│
├── .claude/
│   └── skills/
│       └── wsapt-confluence/
│           └── SKILL.md         ← loads automatically; encodes the locked scope (Technical Spec + Investor Profile)
│
├── CHECKLISTS/
│   ├── 01-data-layer.md
│   ├── 02-pine-script-alerts.md
│   ├── 03-live-data-wiring.md
│   ├── 04-dashboard-production.md
│   ├── 05a-macro-intelligence.md
│   ├── 05b-returns-calculator.md
│   └── 05c-portfolio-holdings.md  ← Sharesight/Moomoo integration, prerequisite for 05b's return figures
│
├── docs/
│   ├── Jacson3_Portfolio_Technical_Specification.docx  ← replaces Strategic Objectives + Addendum A
│   ├── Jacson3_Investor_Profile.docx
│   ├── Jacson3_Portfolio_5Day_Implementation_Blueprint.docx  ← original step-by-step build notes; still has concrete reference detail (Pine Script starter, GOOGLEFINANCE formulas) folded into CHECKLISTS/
│   └── THESES.md                ← if you choose the markdown option in Phase 5A
│
├── data/
│   ├── Jacson3_Watchlist_DB.xlsx       ← current source-of-truth export — now 6 tabs:
│   │                                      Master_Watchlist (technical/confluence reference),
│   │                                      Jacson3_Holdings, Personal_Holdings (actual positions,
│   │                                      sourced from Sharesight — see Technical Spec §8),
│   │                                      TV_Imports, STRC_Income, Macro_Theses
│   └── archive/                         ← dated snapshots before major changes, see note below
│
├── dashboard/
│   ├── Jacson3_Dashboard_Prototype.html ← the self-contained build
│   └── src/                             ← if/when you split this into separate component files
│       (currently one file by design — split only if it gets unwieldy)
│
├── pine-script/
│   └── jacson3-wsapt-overlay.pine       ← created in Phase 2
│
├── secrets/                             ← see "Secrets" section below — NEVER commit this folder
│
└── .gitignore                           ← must include `secrets/` — see below
```

## Why these specific top-level folders

- **`CHECKLISTS/` separate from `docs/`** — checklists are living, frequently-edited, git-tracked task lists. `docs/` is closer to read-only reference material (the original scope documents). Mixing them makes it harder to see at a glance what's "process" vs. "reference."
- **`data/` separate from `dashboard/`** — the spreadsheet is the source of truth; the dashboard is a consumer of it. Keeping them in separate folders reinforces that the dashboard should never be where data gets manually edited.
- **`pine-script/` as its own top-level folder, not nested under `dashboard/`** — Pine Script lives and is tested entirely inside TradingView, not in this repo's runtime. It's here for version control and so Claude can read/edit it, but it has no folder-structure relationship to the dashboard code.
- **No `src/` split for the dashboard yet** — the current build is intentionally one self-contained file (that's also why it has no CDN dependencies). Don't split it into multiple files until it's actually too large to work with as one — premature splitting just adds a build step for no current benefit.

## Secrets — read this before Phase 3 or 5C

Phase 3 (Live Data Wiring) introduces a Google Sheets API service account key and possibly a webhook secret. Phase 5C (Portfolio Holdings) introduces Sharesight API credentials. None of these should ever:
- be pasted into a chat with Claude (Code or Cowork) — Claude doesn't need to see the actual key value to write code that reads it from a file or environment variable
- be committed to git

Practical setup:
1. Create the `secrets/` folder locally (it's in the structure above but should stay empty in git).
2. Add `secrets/` to `.gitignore` before Phase 3 or 5C starts, not after — easy to forget under deadline pressure.
3. Store the actual service account JSON / API keys inside `secrets/`, referenced by filename in code (e.g. `secrets/google-service-account.json`, `secrets/sharesight-api-key.json`), never inlined.
4. If you ever need Claude to debug a credentials-related error, paste the *error message*, not the credential file contents.

## Archive convention for `data/`

Before any change to Master_Watchlist that touches formulas (not just data entry), copy the current file into `data/archive/` with a date stamp, e.g. `Jacson3_Watchlist_DB_2026-06-25.xlsx`. This isn't full version control (git can technically track binary xlsx files, but diffs are unreadable) — it's a cheap rollback point for the one file in this project where a silent formula error is hardest to spot.

## What does NOT need its own folder

- The `.skill` packaged file (`wsapt-confluence.skill`) — once unpacked into `.claude/skills/wsapt-confluence/`, the zip itself doesn't need to live in the repo. Keep it wherever you keep downloads if you want a backup, but it's not part of the working structure.
- Test/scratch files — use your own `/tmp` or a `.scratch/` folder added to `.gitignore` if you want Claude to have a workspace that definitely never gets committed by accident.
