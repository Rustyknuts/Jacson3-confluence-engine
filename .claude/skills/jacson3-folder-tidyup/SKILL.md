---
name: jacson3-folder-tidyup
description: Conservative file organization skill for the Jacson3 project's two messy zones — duplicate/stale files inside the git repo, and the pile of downloaded zips/exports in the Downloads folder. Use when asked to "tidy up", "clean up Downloads", "organize the project folder", "archive old files", "find duplicates", or when the user expresses confusion about which copy of a file is current. Also trigger proactively if you notice signs of duplication while doing other work — multiple similarly-named zips, a nested folder that mirrors the project root, or files that look like they were extracted from a zip without being merged. Never deletes anything without explicit confirmation — default action is always move-to-archive, not delete.
---

# Jacson3 Folder Tidy-Up

This skill covers two genuinely different zones with different detection logic. Identify which zone(s) the request is about before doing anything — don't apply repo logic to Downloads or vice versa.

**Hard rule across both zones: never delete without explicit confirmation.** Default action is always move-to-archive. The only exception is removing a file from git tracking after the user has explicitly confirmed (as happened this session) — and even then, the file isn't gone, just untracked; recommend the user keep or make a filesystem backup before any git removal if they haven't already.

**If unsure whether a file is needed, leave it in place** and flag it for the user to decide, rather than guessing.

---

## Zone 1: Inside the git repo

**Detection signal: git history, not filename or file age.** A file or folder's last-touched commit date is the reliable signal for whether it's part of active work — not how it's named, not when it was last opened (opening doesn't change git history), not its modification timestamp (which can be misleading — e.g. a stale file re-extracted from a zip gets a fresh mtime even though its content is old).

### How to check

For any suspected duplicate or stale file/folder:
```
git log --oneline -5 -- "<path>"
```
Compare against the equivalent file elsewhere (e.g. the same filename at a different path) using the same command. The one with more recent, more frequent commit activity is the live copy. A file with zero commits since its first appearance, sitting alongside a file with ongoing activity, is the strongest possible signal of staleness — this is exactly how the nested `jacson3-portfolio-project/` duplicate was identified and confirmed safe to remove in this project on 2026-06-30.

### Specific patterns to watch for in this repo

- **A subfolder that mirrors the project root** — e.g. `<project-name>/<project-name>/...` or any folder containing what looks like a second copy of `CHECKLISTS/`, `docs/`, `data/`, etc. This pattern has already occurred once (a zip extracted into the repo root and committed as-is, rather than its contents merged with existing files). Check for it specifically after any zip-based file delivery.
- **A `.zip` file committed directly into the repo.** Source zips should never be tracked in git — they're delivery mechanisms, not project assets. If found, confirm with the user, then `git rm` it (the zip's actual content, if still needed, should already be reflected in the unpacked, tracked files).
- **Two files with the same logical purpose at different paths** — e.g. two `CHECKLISTS/03-live-data-wiring.md`-named files. Always resolve via the git log check above, never by eyeballing content and guessing which "looks more current."

### Before removing anything from git tracking

1. Run the git log comparison above and show the user the actual output — both paths, both histories — not just a conclusion.
2. State explicitly which one has recent activity and which doesn't.
3. Get explicit confirmation before `git rm`.
4. Stage the removal, show the user the full `git status` (every file being removed, not a summary count), and get a second confirmation before committing.
5. Write a commit message that documents *why* — not just "removed duplicate" but the actual evidence (which commits, which dates) that justified the removal, so a future session reading git log understands the reasoning without re-deriving it.

### What NOT to do in this zone

- Don't move git-tracked files around the filesystem without using `git mv` or being explicit that an untrack step is needed — a plain filesystem move desyncs git's view of the file from its actual location.
- Don't archive `.git/`, `.gitignore`, or anything that affects repo function, regardless of how it looks.
- Don't touch `secrets/` — it's gitignored for a reason; tidying should never involve reading or moving its contents.

---

## Zone 2: Downloads folder

**Detection signal: filename pattern and modification date — there's no git history here, this is a flat folder of delivered files.**

### Specific pattern already observed in this project

Generic or auto-incremented filenames from repeated downloads of the same logical file:
```
files.zip
jacson3-portfolio-project.zip
jacson3-portfolio-project_1.zip
jacson3-portfolio-project_2.zip
```
This happens because browser downloads auto-suffix a number when a same-named file already exists, rather than overwriting or asking. None of these names indicate which one is actually current — that has to be determined by **modification date** (most recent timestamp = most recently downloaded = most likely current), cross-referenced with what the user can recall about when they last did a relevant download.

### How to tidy this zone

1. List files matching likely project-related patterns (the project name, "skill", checklist names, or other known project file names) sorted by modification date, most recent first.
2. Identify clusters of similarly-named files — same base name with `_1`, `_2`, `(1)`, `(2)` suffixes, or generic names like `files.zip` downloaded around the same time as a known project action.
3. **Do not assume the most recent file is correct without the user confirming what they expected to download at that time** — a generic `files.zip` downloaded "just now" is likely correct if the user just clicked "Download all", but verify against what they were actually doing.
4. Propose moving all but the confirmed-current file(s) into an `Archive/` subfolder within Downloads (create it if it doesn't exist), preserving original filenames so the user can still identify them later if needed.
5. Never auto-delete from Downloads — same rule as the repo zone.

### A standing fix, not just a cleanup

Tidying Downloads after the fact treats a symptom. The actual fix is reducing future pile-up: when handing the user a file to download, suggest a specific, dated filename rather than relying on the default (e.g. recommend renaming `files.zip` to `jacson3-<description>-YYYY-MM-DD.zip` at save time, as was done later in this session) — mention this to the user when relevant rather than assuming they'll remember.

---

## General workflow for either zone

1. **Survey first, act second.** List what you find before proposing any moves — the user should see the actual file list, not a summary, before deciding.
2. **Propose, don't execute silently.** State what you'd move where, and why (citing the git log or modification-date evidence), then wait for confirmation.
3. **One zone at a time.** Don't mix repo cleanup and Downloads cleanup into one undifferentiated pass — they have different evidence types and different risk profiles (one is reversible via git, the other isn't).
4. **After any tidy-up, summarize what changed** in the same Changed/Still-open format the `jacson3-project-manager` skill uses for session close-outs, so the two skills produce consistent, comparable records.
