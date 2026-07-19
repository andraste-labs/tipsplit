const STORAGE_KEY = 'tipsplit-state';

const billInput = document.getElementById('bill-amount');
const billError = document.getElementById('bill-amount-error');
const tipPresetsContainer = document.getElementById('tip-presets');
const customTipInput = document.getElementById('custom-tip');
const customTipError = document.getElementById('custom-tip-error');
const numPeopleInput = document.getElementById('num-people');
const numPeopleError = document.getElementById('num-people-error');
const activeIndicator = document.getElementById('active-indicator');
const tipAmountEl = document.getElementById('tip-amount');
const totalAmountEl = document.getElementById('total-amount');
const perPersonAmountEl = document.getElementById('per-person-amount');
const resetBtn = document.getElementById('reset-btn');

let state = {
  bill: '',
  selectedPreset: null,
  customTip: '',
  numPeople: 1
};

function clearErrors() {
  billError.textContent = '';
  customTipError.textContent = '';
  numPeopleError.textContent = '';
}

function getValidBill() {
  const raw = billInput.value.trim();
  if (raw === '') {
    return { valid: false, value: 0, empty: true };
  }
  const num = parseFloat(raw);
  if (isNaN(num) || num < 0) {
    billError.textContent = 'Please enter a valid non-negative amount.';
    return { valid: false, value: 0, empty: false };
  }
  return { valid: true, value: num, empty: false };
}

function getValidCustomTip() {
  const raw = customTipInput.value.trim();
  if (raw === '') {
    return { valid: false, value: 0, empty: true };
  }
  const num = parseFloat(raw);
  if (isNaN(num) || num < 0) {
    customTipError.textContent = 'Please enter a valid non-negative percentage.';
    return { valid: false, value: 0, empty: false };
  }
  return { valid: true, value: num, empty: false };
}

function getValidNumPeople() {
  const raw = numPeopleInput.value.trim();
  if (raw === '') {
    return { valid: false, value: 1, empty: true };
  }
  const num = parseInt(raw, 10);
  if (isNaN(num) || num < 1) {
    numPeopleError.textContent = 'Number of people must be at least 1.';
    return { valid: false, value: 1, empty: false };
  }
  return { valid: true, value: num, empty: false };
}

function updateActivePresetButtons() {
  const buttons = tipPresetsContainer.querySelectorAll('.tip-preset');
  buttons.forEach(btn => {
    const percent = parseFloat(btn.dataset.percent);
    if (state.selectedPreset !== null && percent === state.selectedPreset) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateIndicator(tipPercent) {
  if (tipPercent === null) {
    activeIndicator.textContent = 'No tip selected yet';
  } else if (state.selectedPreset !== null) {
    activeIndicator.textContent = `Using preset: ${tipPercent}% tip`;
  } else {
    activeIndicator.textContent = `Using custom: ${tipPercent}% tip`;
  }
}

function formatCurrency(num) {
  return '$' + num.toFixed(2);
}

function calculateTip() {
  clearErrors();

  const billResult = getValidBill();
  const numPeopleResult = getValidNumPeople();

  let tipPercent = null;
  if (state.selectedPreset !== null) {
    tipPercent = state.selectedPreset;
  } else {
    const customResult = getValidCustomTip();
    if (customResult.valid) {
      tipPercent = customResult.value;
    } else if (!customResult.empty) {
      tipPercent = null;
    } else {
      tipPercent = null;
    }
  }

  updateIndicator(tipPercent);

  if (!billResult.valid || tipPercent === null || !numPeopleResult.valid) {
    tipAmountEl.textContent = formatCurrency(0);
    totalAmountEl.textContent = formatCurrency(0);
    perPersonAmountEl.textContent = formatCurrency(0);
    saveState();
    return;
  }

  const bill = billResult.value;
  const numPeople = numPeopleResult.value;
  const tipAmount = bill * (tipPercent / 100);
  const totalAmount = bill + tipAmount;
  const perPerson = totalAmount / numPeople;

  tipAmountEl.textContent = formatCurrency(tipAmount);
  totalAmountEl.textContent = formatCurrency(totalAmount);
  perPersonAmountEl.textContent = formatCurrency(perPerson);

  saveState();
}

function selectPreset(percent) {
  state.selectedPreset = percent;
  customTipInput.value = '';
  customTipError.textContent = '';
  updateActivePresetButtons();
  calculateTip();
}

function applyCustomTip() {
  const raw = customTipInput.value.trim();
  if (raw !== '') {
    state.selectedPreset = null;
    updateActivePresetButtons();
  }
  calculateTip();
}

function saveState() {
  const toSave = {
    bill: billInput.value,
    selectedPreset: state.selectedPreset,
    customTip: customTipInput.value,
    numPeople: numPeopleInput.value
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    // localStorage unavailable, ignore silently
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.bill !== undefined) billInput.value = parsed.bill;
    if (parsed.customTip !== undefined) customTipInput.value = parsed.customTip;
    if (parsed.numPeople !== undefined) numPeopleInput.value = parsed.numPeople;
    if (parsed.selectedPreset !== undefined && parsed.selectedPreset !== null) {
      state.selectedPreset = parsed.selectedPreset;
    }
  } catch (e) {
    // corrupt or unavailable localStorage, ignore
  }
}

function resetAll() {
  billInput.value = '';
  customTipInput.value = '';
  numPeopleInput.value = '1';
  state.selectedPreset = null;
  clearErrors();
  updateActivePresetButtons();
  tipAmountEl.textContent = formatCurrency(0);
  totalAmountEl.textContent = formatCurrency(0);
  perPersonAmountEl.textContent = formatCurrency(0);
  activeIndicator.textContent = 'No tip selected yet';
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

function attachEventListeners() {
  billInput.addEventListener('input', () => {
    calculateTip();
  });

  tipPresetsContainer.querySelectorAll('.tip-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const percent = parseFloat(btn.dataset.percent);
      selectPreset(percent);
    });
  });

  customTipInput.addEventListener('input', () => {
    applyCustomTip();
  });

  numPeopleInput.addEventListener('input', () => {
    calculateTip();
  });

  resetBtn.addEventListener('click', () => {
    resetAll();
  });
}

function init() {
  loadState();
  attachEventListeners();
  updateActivePresetButtons();
  calculateTip();
}

document.addEventListener('DOMContentLoaded', init);