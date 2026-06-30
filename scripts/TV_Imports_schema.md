# TV_Imports Tab — Schema & XLOOKUP Reference

This document covers three things in sequence:
1. How to configure TradingView Screener so its CSV export has the right columns.
2. The exact layout of the `TV_Imports` tab that `tv-import.gs` writes to.
3. XLOOKUP formula templates to paste into `Master_Watchlist`.

---

## 1. TradingView Screener column setup

Open the TradingView Screener (the same watchlist you export from). Add these columns to the
Screener view, then save the layout so it persists across sessions. The Apps Script matches
columns by header name, so the names below must appear in the CSV header row.

| Column to add in TV | Header in exported CSV | Maps to TV_Imports col |
|---------------------|------------------------|------------------------|
| *(always present)*  | `Ticker`               | `Ticker` (col B)       |
| Last price          | `Last price`           | `Last_Close` (col C)   |
| ATR (14)            | `ATR (14)`             | `ATR_14` (col D)       |
| RSI (14)            | `Relative Strength Index (14)` | `RSI_14` (col E) |
| Change %            | `Change %`             | `Change_Pct` (col F)   |
| Volume              | `Volume`               | `Volume` (col G)       |

**Minimum required:** `Ticker` + `Last price`. ATR_14 and RSI_14 are critical for the
stop-loss formulas and Confluence Score — include them. If either is missing the script
will import successfully but leave those columns blank.

**Alias tolerance:** the script accepts common alternative spellings (e.g. `Last`, `Close`,
`ATR(14)`, `RSI (14)`) — see `TV_HEADER_MAP` at the top of `tv-import.gs` for the full list.

---

## 2. TV_Imports tab column layout

The Apps Script creates this tab automatically on first import. **Do not rename, reorder,
or insert columns** — the XLOOKUP formulas in Master_Watchlist reference columns by letter.

| Col | Header             | Type     | Populated by           |
|-----|--------------------|----------|------------------------|
| A   | Import_Timestamp   | Datetime | Script — same value for every row in one import |
| B   | Ticker             | Text     | TV export `Ticker` column, exchange prefix stripped |
| C   | Last_Close         | Number   | TV `Last price`        |
| D   | ATR_14             | Number   | TV `ATR (14)`          |
| E   | RSI_14             | Number   | TV `Relative Strength Index (14)` |
| F   | Change_Pct         | Text     | TV `Change %`          |
| G   | Volume             | Text     | TV `Volume`            |
| H   | TV_Source_Label    | Text     | `"TradingView Screener — manual export"` |

**Row 1** = header, frozen, bold.  
**Rows 2+** = one row per ticker. Every row from a single import shares the same
`Import_Timestamp`, so `MAX(TV_Imports!$A:$A)` always equals the last import time.

**On each import the script clears rows 2+ and rewrites them from scratch.** This means
TV_Imports always reflects one point-in-time snapshot, never an accumulated log. If you
want a historical log of imports, copy the tab to the `data/archive/` folder before
importing (the script does not do this automatically).

### Ticker format note

TradingView sometimes exports tickers with an exchange prefix (e.g. `NASDAQ:AAPL`,
`NZX:MEL`, `COINBASE:BTCUSD`). The script strips the prefix by default (`STRIP_EXCHANGE_PREFIX = true`
in `tv-import.gs`) so the stored ticker is bare (e.g. `AAPL`, `MEL`, `BTCUSD`). This must
match exactly what is in `Master_Watchlist` column A.

If your `Master_Watchlist` uses full TV symbols including the exchange prefix, set
`STRIP_EXCHANGE_PREFIX = false` in the script.

---

## 3. XLOOKUP formula templates for Master_Watchlist

Paste these into the relevant cells. All formulas assume:
- **Master_Watchlist column A** = Ticker (the lookup key)
- **TV_Imports columns B–E** = Ticker, Last_Close, ATR_14, RSI_14 as per section 2 above

Adjust the row number (`2` → actual row) for each formula you paste.

---

### Last Close (price)

Paste in the Master_Watchlist column that holds the current price for each asset.
The fallback string matches the project's data-integrity convention (skill §2).

```
=IFERROR(XLOOKUP(A2, TV_Imports!$B:$B, TV_Imports!$C:$C, "⏳ NO PRICE DATA YET"), "⏳ NO PRICE DATA YET")
```

---

### ATR(14) — used in Tight/Wide/Accumulation stop formulas

Paste in the Master_Watchlist column that holds ATR(14). The stop formulas in
columns G/H/I reference this column, so it must be in place before those formulas
will compute correctly. Use an empty string fallback (not a zero) to avoid silently
computing stops against a zero ATR.

```
=IFERROR(XLOOKUP(A2, TV_Imports!$B:$B, TV_Imports!$D:$D, ""), "")
```

---

### RSI(14) → Master_Watchlist column Q

```
=IFERROR(XLOOKUP(A2, TV_Imports!$B:$B, TV_Imports!$E:$E, ""), "")
```

After pasting, update column Q's header comment to note that values are now
populated from TV_Imports (not manually entered). Column P (Larsson Line) remains
manual-entry only — never computed or populated from this import.

---

### Per-row import timestamp

For a "data as of" display next to each asset row. Optional — useful if different
assets are on different import cadences (not currently the case, but safe to include).

```
=IFERROR(XLOOKUP(A2, TV_Imports!$B:$B, TV_Imports!$A:$A, ""), "")
```

Format this cell as `dd/mm/yyyy hh:mm` to match TV_Imports column A.

---

### Last import timestamp (batch-level) — for the <1hr freshness badge

Use this in a single "Data as of" cell — e.g. at the top of Master_Watchlist or in
the dashboard's header. This is the value the `AUDITED` / `STALE` badge logic reads.

```
=MAX(TV_Imports!$A:$A)
```

**Staleness check formula** (true if data is older than 1 hour):

```
=(NOW() - MAX(TV_Imports!$A:$A)) * 24 > 1
```

Use this in a conditional-format rule or as the input to the dashboard's freshness
badge. Per the project's non-negotiable <1hr rule (skill §2), any actionable
recommendation must show this badge and flag STALE if the formula returns TRUE.

---

## 4. Post-import verification checklist

After the first real import, run these checks before treating the wiring as done:

- [ ] TV_Imports tab exists, has the correct header row, and has one data row per ticker
- [ ] `Import_Timestamp` values are real datetimes (not blank, not "0")
- [ ] `Ticker` values in TV_Imports match Master_Watchlist column A exactly (no exchange prefix mismatch)
- [ ] `Last_Close` for an Active Trailing asset matches the TradingView chart print within rounding
- [ ] `ATR_14` for the same asset is populated and non-zero
- [ ] Master_Watchlist price column is now pulling from TV_Imports (not showing "NO PRICE DATA YET" for a known asset)
- [ ] Tight/Wide/Accum stop formulas (cols G/H/I) are computing — not showing errors or zeros
- [ ] `=MAX(TV_Imports!$A:$A)` returns the correct import time
- [ ] Wait >1 hour without re-importing; confirm staleness formula flips to TRUE
- [ ] Re-import; confirm staleness formula returns to FALSE

Tick these off in `CHECKLISTS/03-live-data-wiring.md` once complete.
