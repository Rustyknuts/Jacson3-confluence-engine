/**
 * Jacson3 Portfolio — TradingView CSV Import (Google Apps Script)
 *
 * Install:
 *   1. Open Master_Watchlist in Google Sheets.
 *   2. Extensions → Apps Script → paste this file → Save.
 *   3. Reload the Sheet — a "Jacson3 Portfolio" menu will appear.
 *
 * Workflow each refresh:
 *   1. In TradingView Screener, configure your watchlist columns (see TV_Imports_schema.md).
 *   2. Click the TradingView Screener Export (⬇) button → save the .csv file.
 *   3. Open the .csv, select all (Ctrl+A / ⌘A), copy.
 *   4. In the Sheet: Jacson3 Portfolio → Import TradingView CSV…
 *   5. Paste into the dialog → Import.
 *
 * After import, TV_Imports tab is replaced with fresh data stamped to the second.
 * Master_Watchlist reads from it via XLOOKUP — see TV_Imports_schema.md for those formulas.
 *
 * The <1hr freshness rule: dashboard/sheet reads =MAX(TV_Imports!$A:$A) and flags STALE
 * if (NOW() − that value) × 24 > 1.
 */

'use strict';

// ── Column mapping: TradingView Screener header names → our field keys ────────
// List aliases in order of preference; first match wins. Case-insensitive.
const TV_HEADER_MAP = {
  ticker:     ['Ticker', 'Symbol', 'Name'],
  last_close: ['Last price', 'Last', 'Close', 'Price', 'Last Price'],
  atr_14:     ['ATR (14)', 'Average True Range (14)', 'ATR(14)', 'ATR'],
  rsi_14:     ['Relative Strength Index (14)', 'RSI (14)', 'RSI(14)', 'RSI'],
  change_pct: ['Change %', '% Change', 'Change', 'Chg %'],
  volume:     ['Volume', 'Vol'],
};

// ── TV_Imports tab definition (must mirror TV_Imports_schema.md) ──────────────
const IMPORTS_TAB  = 'TV_Imports';
const IMPORTS_COLS = [
  'Import_Timestamp',
  'Ticker',
  'Last_Close',
  'ATR_14',
  'RSI_14',
  'Change_Pct',
  'Volume',
  'TV_Source_Label',
];

// ── Custom menu ───────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Jacson3 Portfolio')
    .addItem('Import TradingView CSV…', 'openImportDialog')
    .addSeparator()
    .addItem('About / Help', 'showHelp')
    .addToUi();
}

// ── Import dialog (HTML rendered inline — no separate .html file needed) ──────
function openImportDialog() {
  const html = HtmlService
    .createHtmlOutput(buildDialogHtml())
    .setWidth(660)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import TradingView CSV');
}

function buildDialogHtml() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body   { font-family: Arial, sans-serif; font-size: 13px; margin: 0; padding: 16px; }
  h3     { margin: 0 0 10px; font-size: 15px; }
  .hint  { color: #555; margin-bottom: 10px; line-height: 1.5; }
  .hint code { background: #f1f3f4; padding: 1px 4px; border-radius: 3px; }
  textarea { width: 100%; height: 290px; font-family: monospace; font-size: 11px;
             border: 1px solid #dadce0; border-radius: 4px; padding: 6px; box-sizing: border-box; }
  .actions { margin-top: 12px; display: flex; align-items: center; gap: 10px; }
  .btn  { padding: 8px 20px; font-size: 13px; border-radius: 4px; cursor: pointer; }
  .primary { background: #1a73e8; color: #fff; border: none; }
  .primary:hover { background: #1765cc; }
  .cancel  { background: #f1f3f4; color: #333; border: 1px solid #dadce0; }
  #status  { font-weight: bold; color: #333; }
  .ok   { color: #0a7c42; }
  .err  { color: #c5221f; }
</style>
</head>
<body>
<h3>Import TradingView Screener CSV</h3>
<p class="hint">
  In TradingView Screener: click <strong>Export (⬇)</strong>, open the file,
  <strong>Ctrl+A → Ctrl+C</strong>, then paste below.<br>
  Required columns: <code>Ticker</code>, <code>Last price</code>,
  <code>ATR (14)</code>, <code>RSI (14)</code>.
  See <code>scripts/TV_Imports_schema.md</code> for full setup.
</p>
<textarea id="csv" placeholder="Ticker,Last price,ATR (14),Relative Strength Index (14),Change %,Volume&#10;BTC,107500,3241.5,58.3,0.8%,28.4B&#10;GOOG,178.42,3.21,52.1,0.3%,22.1M&#10;..."></textarea>
<div class="actions">
  <button class="btn primary" onclick="submit()">Import</button>
  <button class="btn cancel" onclick="google.script.host.close()">Cancel</button>
  <span id="status"></span>
</div>
<script>
  function submit() {
    const csv = document.getElementById('csv').value.trim();
    const st  = document.getElementById('status');
    if (!csv) { st.textContent = 'Paste CSV text first.'; return; }
    st.className = ''; st.textContent = 'Importing…';
    document.querySelector('.primary').disabled = true;
    google.script.run
      .withSuccessHandler(function(msg) {
        st.className = 'ok'; st.textContent = msg;
        document.querySelector('.primary').disabled = false;
      })
      .withFailureHandler(function(err) {
        st.className = 'err'; st.textContent = 'Error: ' + err.message;
        document.querySelector('.primary').disabled = false;
      })
      .processTvCsv(csv);
  }
</script>
</body>
</html>`;
}

// ── Main processing function (called from the dialog via google.script.run) ───
function processTvCsv(csvText) {
  const rows = parseCsvText(csvText);
  if (rows.length < 2) {
    throw new Error('No data rows found — is this a valid TradingView CSV export?');
  }

  const headers  = rows[0];
  const colIndex = mapTvHeaders(headers);

  if (colIndex.ticker === -1) {
    throw new Error(
      'Could not find a Ticker/Symbol column in the CSV. ' +
      'Check that your TradingView Screener includes a "Ticker" column and ' +
      'that it matches one of the aliases in TV_Imports_schema.md.'
    );
  }
  if (colIndex.last_close === -1) {
    throw new Error(
      'Could not find a Last price/Close column in the CSV. ' +
      'Check that your TradingView Screener includes "Last price" or "Last" ' +
      'and see TV_Imports_schema.md for the full alias list.'
    );
  }

  const timestamp   = new Date();
  const sourceLabel = 'TradingView Screener — manual export';

  const importRows = rows.slice(1)
    .filter(r => r.length > 1 && r[colIndex.ticker] && r[colIndex.ticker].trim())
    .map(r => [
      timestamp,
      normalizeTicker(r[colIndex.ticker]),
      numericOrRaw(colIndex.last_close >= 0 ? r[colIndex.last_close] : ''),
      numericOrRaw(colIndex.atr_14     >= 0 ? r[colIndex.atr_14]     : ''),
      numericOrRaw(colIndex.rsi_14     >= 0 ? r[colIndex.rsi_14]     : ''),
      colIndex.change_pct >= 0 ? (r[colIndex.change_pct] || '') : '',
      colIndex.volume     >= 0 ? (r[colIndex.volume]     || '') : '',
      sourceLabel,
    ]);

  if (importRows.length === 0) {
    throw new Error('CSV parsed successfully but no ticker rows found after the header row.');
  }

  writeToImportsTab(importRows);

  const tz = Session.getScriptTimeZone();
  const ts = Utilities.formatDate(timestamp, tz, 'dd MMM yyyy HH:mm');
  return `✅ Imported ${importRows.length} tickers — ${ts}`;
}

// ── Write rows to TV_Imports tab ──────────────────────────────────────────────
function writeToImportsTab(importRows) {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  let   tab = ss.getSheetByName(IMPORTS_TAB);

  // First-run: create the tab with the correct header if it doesn't exist.
  if (!tab) {
    tab = ss.insertSheet(IMPORTS_TAB);
    const headerRange = tab.getRange(1, 1, 1, IMPORTS_COLS.length);
    headerRange.setValues([IMPORTS_COLS]);
    headerRange.setFontWeight('bold').setBackground('#f3f3f3');
    tab.setFrozenRows(1);
    // Set column widths for readability.
    tab.setColumnWidth(1, 160); // Import_Timestamp
    tab.setColumnWidth(2, 80);  // Ticker
    tab.setColumnWidth(3, 90);  // Last_Close
    tab.setColumnWidth(4, 70);  // ATR_14
    tab.setColumnWidth(5, 60);  // RSI_14
    tab.setColumnWidth(8, 250); // TV_Source_Label
  }

  // Clear previous import rows (row 1 = header, keep it).
  const lastRow = tab.getLastRow();
  if (lastRow > 1) {
    tab.getRange(2, 1, lastRow - 1, IMPORTS_COLS.length).clearContent();
  }

  // Write new rows starting at row 2.
  tab.getRange(2, 1, importRows.length, IMPORTS_COLS.length).setValues(importRows);

  // Format the Import_Timestamp column as a readable datetime.
  tab.getRange(2, 1, importRows.length, 1)
     .setNumberFormat('dd/mm/yyyy hh:mm');

  // Format numeric columns (Last_Close, ATR_14, RSI_14) to 4 decimal places.
  tab.getRange(2, 3, importRows.length, 3)
     .setNumberFormat('0.0000');

  SpreadsheetApp.flush();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Minimal RFC-4180-compatible CSV parser.
 * Handles quoted fields (including embedded commas and "" escapes),
 * Windows (\r\n) and Unix (\n) line endings, and trims whitespace from
 * unquoted fields.
 */
function parseCsvText(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  return lines
    .map(line => {
      const fields = [];
      let cur = '', inQuote = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuote && line[i + 1] === '"') { cur += '"'; i++; } // escaped quote
          else inQuote = !inQuote;
        } else if (ch === ',' && !inQuote) {
          fields.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      fields.push(cur.trim());
      return fields;
    })
    .filter(r => r.length > 0 && r.some(f => f !== ''));
}

/**
 * Matches CSV headers (case-insensitive) against TV_HEADER_MAP aliases.
 * Returns an object: { ticker: colIndex, last_close: colIndex, ... }
 * A value of -1 means the column wasn't found in the CSV.
 */
function mapTvHeaders(headers) {
  const normalized = headers.map(h => h.trim().toLowerCase());
  const result = {};
  for (const [field, aliases] of Object.entries(TV_HEADER_MAP)) {
    result[field] = normalized.findIndex(
      h => aliases.some(a => a.toLowerCase() === h)
    );
  }
  return result;
}

/**
 * TradingView Screener exports tickers with an exchange prefix
 * (e.g. "NASDAQ:AAPL", "NZX:MEL"). Strip the prefix so the value
 * matches what's in Master_Watchlist column A.
 *
 * If Master_Watchlist uses full TV symbols (e.g. "COINBASE:BTCUSD")
 * instead of bare tickers, set STRIP_EXCHANGE_PREFIX = false below.
 */
const STRIP_EXCHANGE_PREFIX = true;

function normalizeTicker(raw) {
  const t = raw.trim();
  if (STRIP_EXCHANGE_PREFIX && t.includes(':')) return t.split(':').pop();
  return t;
}

/**
 * Parses a string to a float if possible; returns the raw string otherwise.
 * Handles TradingView's "1,234.56" comma-formatted numbers and "%" suffixes.
 */
function numericOrRaw(raw) {
  if (raw === '' || raw == null) return '';
  const cleaned = String(raw).replace(/,/g, '').replace(/%$/, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? raw : n;
}

// ── Help dialog ───────────────────────────────────────────────────────────────
function showHelp() {
  SpreadsheetApp.getUi().alert(
    'Jacson3 TV Import — Help',
    'Setup guide and XLOOKUP formulas:\n' +
    '  scripts/TV_Imports_schema.md in the project repo\n\n' +
    'Required TradingView Screener columns:\n' +
    '  Ticker, Last price, ATR (14), RSI (14)\n\n' +
    'Optional (recommended):\n' +
    '  Change %, Volume\n\n' +
    'Freshness rule (<1hr):\n' +
    '  =MAX(TV_Imports!$A:$A) gives last import time.\n' +
    '  Flag STALE if (NOW() − that value) × 24 > 1.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
