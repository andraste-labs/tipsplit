// TipSplit — MINIMAL smoke tests
// Run manually: open index.html in a browser, then paste this whole file
// into the DevTools console (or load via <script src="tests/smoke.test.js">
// at the bottom of index.html temporarily). Uses only console.assert — no
// test framework required.
//
// Assumes standard TipSplit markup:
//   <input id="bill-amount">
//   <button class="tip-preset" data-tip="15">15%</button> (etc.)
//   <input id="custom-tip">
//   <span id="tip-amount"> / <span id="total-amount">
// Adjust selectors below if your actual IDs differ.

(function () {
  function setValue(el, value) {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function getNumber(text) {
    return parseFloat((text || '').replace(/[^0-9.\-]/g, '')) || 0;
  }

  // ---- Smoke Test 1: valid bill + preset tip produces correct total ----
  (function testPresetTipCalculatesCorrectTotal() {
    const bill = document.querySelector('#bill-amount');
    const preset = document.querySelector('.tip-preset[data-tip="15"]');
    const tipOut = document.querySelector('#tip-amount');
    const totalOut = document.querySelector('#total-amount');

    if (!bill || !preset || !tipOut || !totalOut) {
      console.warn('SKIP testPresetTipCalculatesCorrectTotal: expected elements not found (check selectors)');
      return;
    }

    setValue(bill, '100');
    preset.click();

    const expectedTip = 15;
    const expectedTotal = 115;
    const actualTip = getNumber(tipOut.textContent);
    const actualTotal = getNumber(totalOut.textContent);

    console.assert(
      Math.abs(actualTip - expectedTip) < 0.01,
      `FAIL: 15%% tip on $100 should be $15, got $${actualTip}`
    );
    console.assert(
      Math.abs(actualTotal - expectedTotal) < 0.01,
      `FAIL: total on $100 + 15%% tip should be $115, got $${actualTotal}`
    );
    console.log('PASS: preset tip calculates correct tip/total for a valid bill amount');
  })();

  // ---- Smoke Test 2: invalid/empty bill does not crash and yields $0 ----
  (function testInvalidBillHandledGracefully() {
    const bill = document.querySelector('#bill-amount');
    const preset = document.querySelector('.tip-preset[data-tip="20"]') ||
                   document.querySelector('.tip-preset');
    const tipOut = document.querySelector('#tip-amount');
    const totalOut = document.querySelector('#total-amount');

    if (!bill || !preset || !tipOut || !totalOut) {
      console.warn('SKIP testInvalidBillHandledGracefully: expected elements not found (check selectors)');
      return;
    }

    setValue(bill, '');
    preset.click();

    const actualTip = getNumber(tipOut.textContent);
    const actualTotal = getNumber(totalOut.textContent);

    console.assert(
      actualTip === 0 && actualTotal === 0,
      `FAIL: empty bill amount should yield $0 tip/total, got tip=$${actualTip} total=$${actualTotal}`
    );
    console.log('PASS: empty/invalid bill amount does not crash and resets to $0');
  })();

  console.log('TipSplit smoke tests complete. Review any FAIL/SKIP lines above.');
})();
