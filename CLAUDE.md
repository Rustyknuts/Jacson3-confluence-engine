# CLAUDE.md — Persistent instructions for this project

These instructions apply to every session in this project, in both Claude Code and Claude.ai.

---

## File links — always provide them when asking for a visual check

Whenever you suggest that the user should visually verify, open, or check a file, **always provide a direct link or file path to the current instance of that file** at the same time. Never just name the file — give them something they can click or navigate to immediately.

Examples of when this applies:
- "Open Master_Watchlist and confirm column A tickers are bare" → provide the Google Sheets link
- "Check the DEVELOPMENT_PLAN.md Current Phase line" → provide the file path or GitHub link
- "Verify the dashboard renders correctly" → provide the local file path or hosted URL
- "Confirm the Sharesight portfolio shows the correct balance" → provide the Sharesight URL

The reason: the user works across multiple instances of files (local copies, Google Drive copies, GitHub copies, downloaded outputs) and it's easy to check the wrong one. A link removes that ambiguity every time.

For Google Sheets and Google Drive files, use the actual shareable URL if known. For local project files, use the full path relative to the project root. For GitHub, use the permalink to the file on the current branch.

---

## Claude.ai and Claude Code are not automatically in sync — verify before trusting either

This project is worked on from two separate environments: a Claude.ai chat session, and Claude Code in this local repo. **Neither environment automatically knows what the other has done.** A file that Claude.ai describes as "already restructured" or "already updated" may not exist on disk here at all — it may only exist in that chat's own working copy, not yet downloaded, not yet pasted in, not yet committed.

**This already happened once and caused real wasted effort:** a checklist file was restructured in a Claude.ai session, but the actual file in this repo was never updated to match. Claude Code (correctly) trusted git as ground truth, found the old version, and a close-out attempt was built on stale content before the mismatch was caught.

**Standing rule:** if Claude.ai (or any instruction arriving secondhand from that session) claims a project file has been created, modified, or restructured, **do not assume that's reflected in this repo.** Before editing, building on, or committing anything described that way:

1. Check the actual current state of the file in this repo first (`cat`, `git diff`, `git log`) — don't trust a description of what it "should" contain.
2. If the local file doesn't match what's being described, say so explicitly and ask for the actual content (preferably pasted directly, not via a download link — those can silently fail to land on disk) rather than guessing or merging the two.
3. Treat git as the source of truth for "what this repo actually contains right now" — a chat transcript describing an edit is not the same as the edit existing here.

This applies in both directions: don't assume Claude.ai's description of this repo's state is current either, since it can't see local changes Claude Code has made since the last sync point it's aware of.

---

## Other persistent instructions

*(Add further project-wide instructions here as they come up — this file is the single place for "always do X in this project" rules.)*
