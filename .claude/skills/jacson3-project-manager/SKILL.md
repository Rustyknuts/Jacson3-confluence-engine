---
name: jacson3-project-manager
description: Project hygiene and continuity skill for the Jacson3 Investment Portfolio project. Use whenever a session involves completing a task and needing to update a checklist; making a judgment call that should be logged; changing a formula or spreadsheet structure before which an archive snapshot is needed; finishing a session and needing a clean handoff summary; discovering a new task mid-session that isn't yet in a checklist; noticing drift between what a document says and what was actually built; or being asked to "tidy up", "update the checklists", "archive the workbook", "log an assumption", "commit this", or "what should we do next session". Also trigger when Claude Code and this session are running in parallel — surface conflicts before they become merge problems.
---

# Jacson3 Project Manager

This skill governs five distinct behaviors. Read the section that matches what's needed — don't run all five behaviors every time.

**If multiple behaviors apply simultaneously** (common), use this priority order:
1. **Multi-agent conflict check first** — if Claude Code is active, check for file conflicts before doing anything else
2. **Workbook archive** — if a structural formula/schema change is about to happen, archive before touching the file
3. **New tasks** — write down any newly discovered tasks immediately before the conversation moves on
4. **Assumptions Register** — log any judgment call made during the session
5. **Checklist updates** — mark off completed/deferred items
6. **Session close-out** — summary written into DEVELOPMENT_PLAN.md
7. **Git commit and push** — always last, after everything else is recorded

---

## FIRST: Multi-agent check (Claude Code + this session running in parallel)

When Claude Code is actively working on a file that this session also needs to touch, surface the conflict **before** making any edit:

- Identify the specific file(s) at risk
- State what Claude Code is doing with that file (from what the user has said)
- Ask whether to wait, coordinate, or proceed knowing a merge will be needed

Never silently edit a file that Claude Code is also editing in the same session — the last write wins and the other agent's work is lost.

The files most likely to need coordination, in order of risk:
1. `Jacson3_Watchlist_DB.xlsx` — highest risk; two agents cannot safely edit simultaneously
2. `scripts/` directory — Claude Code is building here; don't create files here from this session without checking
3. `CHECKLISTS/` files — this session owns these; Claude Code should only read them, not write
4. `docs/` files — this session owns these; Claude Code should only read them

**Never trust a description of a file's state without checking it.** If the other environment (Claude.ai or Claude Code) reports having created, modified, or restructured a file, verify the actual current content in this repo (`cat`, `git diff`, `git log`) before editing, building on, or committing anything based on that description. The two environments are not automatically synced — a file described as "already restructured" in one place may not exist that way on disk. This already caused one real instance of wasted work in this project (a checklist restructure that existed only in a Claude.ai session, not in the repo) — treat git as ground truth, always, not a secondhand description.

---

## 1. Checklist Maintenance

**When:** a decision is confirmed, a task is completed, a new task is discovered, or something is deliberately deferred rather than just not-done-yet.

### Rules

- **Check off items only when they are genuinely done**, not when they're in progress or "probably fine." If there's a verification step (e.g. "recalculate the workbook and confirm zero errors"), the item stays unchecked until that step is confirmed, not just when the code is written.
- **Deferral is not incompletion.** When an item is consciously deferred (e.g. "revisit once Phase 2 clarifies this"), mark it checked and add a note explaining the deferral and what would trigger revisiting. Two sub-bullets that start with `If standardizing:` and are never going to be followed up are worse than a single checked item that says "decided: stay free-form, see ASSUMPTIONS_REGISTER §3."
- **New tasks discovered mid-session must be written down immediately**, not held in context and forgotten. Add them to the relevant phase checklist with `[ ]` before doing anything else.
- **The DEVELOPMENT_PLAN.md "Current Phase" line is a single source of truth** — update it any time the phase changes or a parallel track starts. It should read accurately at the end of every session, not be left stale.
- **Sign-off items matter.** Don't close a phase without confirming the "you've personally opened the sheet / confirmed the above" item — the session can't check that off on behalf of the user.

### Format for new items
```markdown
- [ ] Brief imperative description — enough context that a future session knows what it means without reading the whole conversation
```

### Format for deferred items
```markdown
- [x] Decision X — **decided: [the decision].** Revisit when [specific trigger]. See ASSUMPTIONS_REGISTER.md §N.
```

---

## 2. Assumptions Register

**When:** a judgment call is made (a number chosen without full data, a convention picked for convenience, a decision made provisionally), or an existing assumption is resolved or revised.

The Assumptions Register lives at `ASSUMPTIONS_REGISTER.md` in the project root.

### Adding a new entry

Every new entry needs all four of these — an entry without a revisit trigger tends to never get revisited:

1. **What was decided** — the actual choice, not just "we discussed X"
2. **Reasoning at the time** — why it seemed right, including what data was and wasn't available
3. **Why this might need revisiting** — the specific failure mode to watch for, not just "things change"
4. **Revisit when** — a concrete trigger (an event, a phase, a time threshold), not "eventually"

Status values: 🟡 Active | 🟢 Confirmed | 🔴 Revised | ⚪ Retired

### Updating an existing entry

When an assumption is resolved: update the status to 🟢 Confirmed or 🔴 Revised, add an **Update note** with the date and what changed, and don't delete the original reasoning — the history of why something was believed is as useful as the current value.

### What counts as an assumption worth logging

- Any number or threshold that was estimated rather than derived (e.g. ATR multiples, buffer percentages)
- Any formula applied to a group of assets without being checked against each one individually
- Any "for now" decision that was explicitly deferred
- Any architectural choice made for convenience rather than strong evidence (e.g. using the same formula for two categories because inventing a third shape seemed unnecessary)
- Any external dependency assumed to still be true (e.g. "Sharesight's API is available to Standard-plan customers")

---

## 3. Workbook Versioning

**When:** any session is about to make formula changes, column insertions, column deletions, or tab restructuring to `Jacson3_Watchlist_DB.xlsx`.

### Rule: archive before surgery, not after

Before touching the workbook structure (not routine data entry — actual formula or schema changes), copy the current file to `data/archive/` with a date stamp:

```
data/archive/Jacson3_Watchlist_DB_YYYY-MM-DD.xlsx
```

Use today's actual date, not a placeholder. If two structural changes happen the same day, add a suffix: `_YYYY-MM-DD_b.xlsx`.

**This must happen before the edit**, not after. A backup of the already-broken file is useless.

### What counts as "structural"

- Inserting or deleting columns anywhere
- Changing a formula to a different formula (not just updating a value)
- Adding or removing tabs
- Moving a widget (e.g. the FX/Commodity block) to a different column range

### What doesn't need an archive

- Entering data into an already-existing blank cell (e.g. entering a price into a "no price data" cell)
- Updating a timestamp
- Correcting a cell comment

---

## 4. Document Sync Check

**When:** a structural decision is made that should be reflected in more than one document, or at the end of any session where documents were modified.

### The sync surface for this project

Changes to one of these almost always need to touch at least one other:

| What changed | Also update |
|---|---|
| Master_Watchlist column layout (O–V) | Technical Specification §9, wsapt-confluence SKILL.md §4 |
| Holding category logic (Core Accum / Active Trailing) | Technical Specification §2, Investor Profile §III, wsapt-confluence SKILL.md §3.3 |
| A new Sharesight/broker integration decision | Technical Specification §8, wsapt-confluence SKILL.md §7, 05c-portfolio-holdings.md |
| A new assumption logged | ASSUMPTIONS_REGISTER.md, and a pointer from the relevant Technical Specification section |
| A phase closed in a checklist | DEVELOPMENT_PLAN.md "Current Phase" line |
| A new checklist file added | DEVELOPMENT_PLAN.md (→ Checklist pointer), FOLDER_STRUCTURE.md (tree), README.md if it's a major new workstream |
| The wsapt-confluence SKILL.md substantially edited | Re-validate with `quick_validate.py`, re-package with `package_skill.py` |

### Running the check

At the end of a session or after a structural change, run through this table mentally and confirm each cross-reference is still accurate. Flag any drift to the user rather than silently fixing it — the user may have intentionally left something out.

---

## 5. Session Close-Out

**When:** a session is winding down, or when asked "what should we start with next session?"

### The close-out produces three things

**1. What changed this session** — a brief list of actual deliverables: files modified, decisions made, items checked off. Not a narrative — a scannable list a future session can read in 30 seconds.

**2. What's still open** — unchecked items that were touched or discussed but not completed, explicitly flagged as open rather than forgotten.

**3. Next session start point** — one specific, concrete recommendation for where to begin: not "continue Phase 1" but "open TradingView, read CEN's 52-week high, enter it in Master_Watchlist row 31 column E." The more specific, the less context reconstruction is needed.

### Format

```markdown
## Session Close-Out — [DATE]

### Changed this session
- [file or decision]: [what changed]

### Still open
- [item]: [why it's open, what's blocking it]

### Start here next session
[One concrete, specific action — ideally one sentence]
```

Write this into `DEVELOPMENT_PLAN.md` under the "Current Phase" line at the end of every session, appending rather than replacing the previous one.

### Git commit and push (runs in Claude Code only)

After the close-out summary is written, stage all changed files, generate a commit message, commit, and push to GitHub. The push is automatic — no manual step needed.

**Before staging, check these three files specifically:**
- `secrets/` — run `git status` first and confirm nothing in `secrets/` is staged. If it appears, stop and fix `.gitignore` before proceeding.
- `data/Jacson3_Watchlist_DB.xlsx` — commit if data or formulas changed this session. Skip if the only change is the Last Import Timestamp (which updates on every open and creates noisy commits for no reason).
- `dashboard/Jacson3_Dashboard_Prototype.html` — commit only if the dashboard code actually changed, not just because it was re-exported.

**Commit message format:**
```
[session YYYY-MM-DD] One-line summary of the most significant change

- Changed: [file or decision] — [what]
- Changed: [file or decision] — [what]
- Open: [anything still outstanding]

Next session: [the one concrete next action from the close-out]
```

The subject line should be specific — not "session close-out" or "update files" but something like `[session 2026-06-30] BTC wide stop calibrated, project-manager skill added`. The bullet body mirrors the close-out summary already written into DEVELOPMENT_PLAN.md — copy it directly.

After pushing, confirm success before telling the user the session is closed. If the push fails (e.g. diverged remote), surface the error message and the suggested fix rather than silently failing.

---

## 6. Mid-session git commits

**When:** a structural change large enough to warrant its own commit rather than waiting for close-out — e.g. a major formula restructure, a new tab added to the workbook, a new document created.

Same pre-commit checks as above. Commit message format:
```
[mid-session YYYY-MM-DD] What specifically changed
```

Don't commit routine data entry mid-session — that creates noise. Reserve mid-session commits for genuinely discrete, self-contained changes.


