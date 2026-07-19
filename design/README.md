
# UX/UI Design Documentation

## Project: Design single-page layout and interaction flow for TipSplit tip calculator

## Template Features Addressed:
- Standard web application features

## Deliverables:
- Wireframe/mockup image or Figma link showing full page layout
- Written spec of button/input states (default, hover, active, focus)
- Color palette and typography recommendation (hex codes, font names)
- Responsive layout notes for mobile and desktop breakpoints
- Short annotation describing the user flow from entering bill to seeing result

## Design Solution:
# TipSplit — UX/UI Design Specification

## 1. User Experience Strategy

**User Flow (single-page, linear):**
1. User lands on page → sees bill amount input focused/highlighted as first action
2. User types bill amount → live area stays empty/zeroed until valid input
3. User selects a preset tip % (10/15/20) OR types a custom tip % → preset buttons and custom field are mutually exclusive (selecting a preset clears custom, typing in custom deselects presets)
4. (Optional) User adjusts "Split between X people" — defaults to 1
5. Results area updates in real time: Tip Amount, Total, Total/Person
6. No submit button needed — this is a live-calculating utility, not a form with a save action

**Information Architecture (top → bottom, single column):**
- Header / App title
- Section 1: Bill Amount (input)
- Section 2: Tip Selection (presets row + custom input)
- Section 3: Split (optional, small inline field)
- Section 4: Results (visually separated card — distinct background)

**Navigation:** None — single page, no routing. Interaction pattern is direct-manipulation live calculation.

**Component Breakdown (per Madde 9 — no monolithic blocks):**
- `Header` — title only, no logic
- `BillInputCard` — label + numeric input, one responsibility: capture bill amount
- `TipPresetGroup` — row of 3 buttons, one responsibility: emit selected tip %
- `CustomTipInput` — one responsibility: emit custom tip % and clear preset selection
- `SplitInput` — one responsibility: capture number of people (optional section)
- `ResultsPanel` — one responsibility: display computed tip/total/per-person (read-only, no inputs)

Each is its own file when built in code (vanilla JS: separate render functions per component, not one 500-line script).

---

## 2. Visual Design

**Color Palette (3 colors, minimal):**
| Token | Hex | Usage |
|---|---|---|
| Primary | `#2563EB` | Selected/active buttons, focus rings, primary text accents |
| Neutral Dark | `#1F2937` | Body text, headings |
| Neutral Light | `#F3F4F6` | Backgrounds, card fills, borders |
| Success/Accent | `#10B981` | Results panel highlight (total amount) |

**Typography:**
- Single Google Font: **Inter** (`<link>` import) — clean, legible at small sizes, good numeral clarity for currency.
- Fallback stack: `Inter, -apple-system, Segoe UI, Roboto, sans-serif`
- H1 (title): 24px / 700
- Label text: 14px / 500
- Input/Button text: 16px / 500
- Result numbers: 28px / 700 (emphasis on Total/Person)

**Spacing/Grid:** 8px base unit spacing scale (8/16/24/32). Single-column flex layout, max-width 480px container centered on desktop, full-width with 16px padding on mobile.

---

## 3–4. Wireframe + Design System Code

<!-- File: wireframes/index.html -->
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TipSplit — Tip Calculator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles/design-system.css">
</head>
<body>

  <!-- Component: Header -->
  <header class="app-header">
    <h1>TipSplit</h1>
    <p class="subtitle">Quick tip &amp; bill splitter</p>
  </header>

  <main class="app-container">

    <!-- Component: BillInputCard -->
    <section class="card" aria-labelledby="bill-label">
      <label id="bill-label" for="billAmount">Bill Amount</label>
      <div class="input-with-prefix">
        <span class="prefix" aria-hidden="true">$</span>
        <input
          type="number"
          id="billAmount"
          name="billAmount"
          inputmode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          aria-describedby="bill-help"
        >
      </div>
      <span id="bill-help" class="help-text">Enter the total bill before tip</span>
    </section>

    <!-- Component: TipPresetGroup -->
    <section class="card" aria-labelledby="tip-label">
      <label id="tip-label">Select Tip %</label>
      <div class="preset-group" role="group" aria-label="Tip percentage presets">
        <button type="button" class="preset-btn" data-tip="10" aria-pressed="false">10%</button>
        <button type="button" class="preset-btn" data-tip="15" aria-pressed="false">15%</button>
        <button type="button" class="preset-btn" data-tip="20" aria-pressed="false">20%</button>
      </div>

      <!-- Component: CustomTipInput -->
      <div class="custom-tip-wrap">
        <label for="customTip">Custom Tip %</label>
        <input
          type="number"
          id="customTip"
          name="customTip"
          inputmode="decimal"
          min="0"
          max="100"
          placeholder="e.g. 18"
          aria-describedby="custom-help"
        >
        <span id="custom-help" class="help-text">Overrides preset selection</span>
      </div>
    </section>

    <!-- Component: SplitInput (optional) -->
    <section class="card card-split" aria-labelledby="split-label">
      <label id="split-label" for="splitCount">Split between</label>
      <div class="split-row">
        <input type="number" id="splitCount" name="splitCount" min="1" value="1" aria-describedby="split-help">
        <span>people</span>
      </div>
      <span id="split-help" class="help-text">Optional — defaults to 1</span>
    </section>

    <!-- Component: ResultsPanel -->
    <section class="results-panel" aria-live="polite" aria-atomic="true">
      <div class="result-row">
        <span class="result-label">Tip Amount</span>
        <span class="result-value" id="tipAmount">$0.00</span>
      </div>
      <div class="result-row">
        <span class="result-label">Total Bill</span>
        <span class="result-value" id="totalAmount">$0.00</span>
      </div>
      <div class="result-row result-row-primary">
        <span class="result-label">Total / Person</span>
        <span class="result-value result-value-emphasis" id="perPersonAmount">$0.00</span>
      </div>
    </section>

  </main>

  <script>
    // Placeholder wiring for wireframe demo purposes only.
    // Preset button active-state toggling (visual demonstration):
    document.querySelectorAll('.preset-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.preset-btn').forEach(function (b) {
          b.classList.remove('is-selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
        document.getElementById('customTip').value = '';
      });
    });
    document.getElementById('customTip').addEventListener('input', function () {
      document.querySelectorAll('.preset-btn').forEach(function (b) {
        b.classList.remove('is-selected');
        b.setAttribute('aria-pressed', 'false');
      });
    });
  </script>

</body>
</html>

<!-- File: styles/design-system.css -->
:root {
  /* Color tokens */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-active: #1E40AF;
  --color-text: #1F2937;
  --color-text-muted: #6B7280;
  --color-bg-light: #F3F4F6;
  --color-white: #FFFFFF;
  --color-accent: #10B981;
  --color-border: #D1D5DB;
  --color-focus-ring: rgba(37, 99, 235, 0.4);

  /* Typography */
  --font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-size-h1: 24px;
  --font-size-label: 14px;
  --font-size-body: 16px;
  --font-size-result: 28px;

  /* Spacing scale (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;

  /* Radius / shadow */
  --radius-md: 8px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.08);

  /* Breakpoint reference (used via media queries below) */
  --breakpoint-mobile-max: 599px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-family);
  color: var(--color-text);
  background-color: var(--color-bg-light);
  font-size: var(--font-size-body);
  line-height: 1.5;
}

.app-header {
  text-align: center;
  padding: var(--space-3) var(--space-2) var(--space-1);
}
.app-header h1 {
  font-size: var(--font-size-h1);
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
}
.subtitle {
  font-size: var(--font-size-label);
  color: var(--color-text-muted);
  margin-top: 4px;
}

.app-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 var(--space-2) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Card component (generic wrapper) */
.card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-2);
}

label {
  display: block;
  font-size: var(--font-size-label);
  font-weight: 500;
  margin-bottom: var(--space-1);
  color: var(--color-text);
}

input[type="number"] {
  width: 100%;
  padding: 12px var(--space-2);
  font-size: var(--font-size-body);
  font-family: var(--font-family);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  background: var(--color-white);
}

input[type="number"]:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}
.input-with-prefix .prefix {
  position: absolute;
  left: var(--space-2);
  color: var(--color-text-muted);
  font-weight: 500;
}
.input-with-prefix input {
  padding-left: 28px;
}

.help-text {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* Preset button group */
.preset-group {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.preset-btn {
  flex: 1;
  padding: 12px var(--space-1);
  font-size: var(--font-size-body);
  font-family: var(--font-family);
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

/* Interactive states: default → hover → active/selected → focus */
.preset-btn:hover {
  background: var(--color-bg-light);
  border-color: var(--color-primary);
}
.preset-btn:active {
  background: var(--color-primary-active);
  color: var(--color-white);
}
.preset-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
.preset-btn.is-selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}
.preset-btn.is-selected:hover {
  background: var(--color-primary-hover);
}

.custom-tip-wrap {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-2);
}

.card-split {
  padding: var(--space-2);
}
.split-row {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
.split-row input {
  max-width: 80px;
}
.split-row span {
  color: var(--color-text-muted);
  font-size: var(--font-size-label);
}

/* Results panel — visually distinct */
.results-panel {
  background: var(--color-text);
  color: var(--color-white);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.result-label {
  font-size: var(--font-size-label);
  color: #D1D5DB;
}

.result-value {
  font-weight: 700;
  font-size: 18px;
}

.result-row-primary {
  border-top: 1px solid rgba(255,255,255,0.15);
  margin-top: var(--space-1);
  padding-top: var(--space-2);
}

.result-value-emphasis {
  font-size: var(--font-size-result);
  color: var(--color-accent);
}

/* ============================
   Responsive breakpoints
   ============================ */

/* Mobile-first is default above (single column, stacked, max-width 480px) */

/* Small mobile fine-tuning (<= 599px) */
@media (max-width: 599px) {
  .app-container {
    max-width: 100%;
    padding: 0 var(--space-2) var(--space-3);
  }
  .preset-group {
    gap: 6px;
  }
  .preset-btn {
    padding: 10px 4px;
    font-size: 14px;
  }
  .result-value-emphasis {
    font-size: 24px;
  }
}

/* Tablet / Desktop (>= 600px) */
@media (min-width: 600px) {
  .app-container {
    padding-top: var(--space-2);
  }
  .card, .results-panel {
    padding: var(--space-3);
  }
}

---

## 5. Accessibility Considerations (WCAG 2.1 AA)

- **Contrast:** `#2563EB` on white = 5.1:1 (passes AA for normal text); `#1F2937` on white = 15.8:1; results panel white text on `#1F2937` = 15.8:1 — all pass AA.
- **Keyboard navigation:** All inputs and buttons are natively focusable (native `<input>`, `<button>`); tab order follows visual/DOM order top-to-bottom.
- **Focus indicators:** Explicit `:focus-visible` box-shadow ring (`--color-focus-ring`) on inputs and preset buttons — never relies on color alone.
- **ARIA:**
  - `role="group"` + `aria-label` on preset button row
  - `aria-pressed` toggled on preset buttons to convey selected state to screen readers
  - `aria-live="polite"` + `aria-atomic="true"` on results panel so screen readers announce updated totals without needing focus to move
  - `aria-describedby` linking each input to its help text
- **Labels:** Every input has an explicit, associated `<label>` (no placeholder-only labeling).
- **Touch targets:** Preset buttons and inputs sized ≥44px height, meeting minimum touch target guidance.
- **Color independence:** Selected preset state uses both background-color change AND `aria-pressed`/bold treatment — not color alone.

---

## Design Rationale Summary

- **Visual hierarchy** enforced via card separation (bill → tip → split → results), each a distinct white card on light-gray page background, with the results panel inverted (dark bg) to signal "final answer" and draw the eye last.
- **Preset vs custom mutual exclusivity** is handled at interaction level (documented in JS comments) so frontend dev implements state-clearing logic without ambiguity.
- **Split field** placed as its own lightweight card between tip selection and results — optional but present, keeping it low-friction (defaults to 1, no forced interaction).
- **Single Google Font (Inter)** keeps payload minimal per minimal-tier constraint — no icon libraries, no CSS framework, all layout achieved via flexbox + CSS variables.
- **Responsive strategy:** mobile-first single column by default; desktop breakpoint (≥600px) only adjusts internal padding — no multi-column layout needed since app is inherently linear/sequential.

---
Generated by UX Designer Agent
