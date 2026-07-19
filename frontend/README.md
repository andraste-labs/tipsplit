# TipSplit

A single-page tip calculator that helps you quickly figure out how much to tip and how to split a bill among friends. Enter your bill amount, pick a quick tip preset (or type a custom percentage), and instantly see the tip amount, total, and per-person cost — all calculated live in the browser with no server required.

## Features

- **Bill amount input** with live validation for non-negative numbers and empty-field handling
- **Quick tip presets** (10%, 15%, 20%) with clear visual "active" state when selected
- **Custom tip percentage** input that automatically deselects presets when used
- **Split between people** field to divide the total evenly among a group
- **Real-time results** for tip amount, total amount, and per-person amount
- **Inline error messages** for invalid bill, tip, or people values (no alerts, no console-only errors)
- **Reset button** that clears all fields and results back to their defaults
- **State persistence** via `localStorage` so your last entry is restored on reload
- **Responsive, accessible layout** with keyboard focus states and reduced-motion support

## Tech Stack

Plain HTML5, CSS3, and vanilla JavaScript (ES modules) — no frameworks, no build tools, no npm dependencies.

## Quick Start

No installation or build step is required. Choose one of the following:

1. **Open directly in a browser**
   Double-click `frontend/index.html` (or open it via your browser's File > Open menu).

2. **Serve locally (recommended for full module support)**
   From the `frontend` directory, run:
   ```bash
   python -m http.server
   ```
   Then visit `http://localhost:8000` in your browser.

That's it — enter a bill amount, choose a tip preset or enter a custom percentage, and see your results update instantly.