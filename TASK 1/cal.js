const screenEl = document.getElementById('screen');
const subEl = document.getElementById('sub');
const pad = document.getElementById('pad');

let expr = '';
let lastResult = null;

function evaluateExpression(e) {
  if (!e) return '';
  let safe = e.replace(/×/g, '*').replace(/÷/g, '/');
  safe = safe.replace(/^[+*/]+/, '');
  safe = safe.replace(/([^0-9.)])+/g, (m) => m.slice(-1));
  try {
    let val = Function('"use strict";return(' + safe + ')')();
    if (typeof val === 'number' && isFinite(val)) {
      if (Math.abs(val) > 1e12 || Math.abs(val) < 1e-12) return val.toExponential(8);
      return Number.isInteger(val) ? String(val) : String(parseFloat(val.toFixed(10)));
    } else return 'Error';
  } catch {
    return 'Error';
  }
}

function refresh() {
  screenEl.textContent = expr === '' ? '0' : expr;
  subEl.textContent = lastResult === null ? '' : 'Ans: ' + lastResult;
}

function insert(val) {
  if (val === '.') {
    const parts = expr.split(/[\+\-\×\÷]/);
    const last = parts[parts.length - 1];
    if (last.includes('.')) return;
    if (last === '') {
      expr += '0.';
      refresh();
      return;
    }
  }
  if (/^[\+\-\×\÷]$/.test(val)) {
    if (expr === '' && val !== '-') return;
    if (/[\+\-\×\÷]$/.test(expr)) {
      expr = expr.slice(0, -1) + val;
      refresh();
      return;
    }
  }
  expr += val;
  refresh();
}

function clearAll() {
  expr = '';
  lastResult = null;
  refresh();
}

function del() {
  if (expr.length > 0) expr = expr.slice(0, -1);
  refresh();
}

function compute() {
  if (!expr) return;
  const result = evaluateExpression(expr);
  if (result === 'Error') {
    screenEl.textContent = 'Error';
    lastResult = null;
    expr = '';
    setTimeout(refresh, 1200);
    return;
  }
  lastResult = result;
  expr = String(result);
  refresh();
}

pad.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');
  if (action === 'clear') clearAll();
  else if (action === 'delete') del();
  else if (action === 'equals') compute();
  else if (val) insert(val);
});

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (/\d/.test(key)) insert(key);
  else if (key === '.' || key === ',') insert('.');
  else if (key === '+' || key === '-') insert(key);
  else if (key === '*') insert('×');
  else if (key === '/') insert('÷');
  else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    compute();
  } else if (key === 'Backspace') {
    e.preventDefault();
    del();
  } else if (key === 'Escape') clearAll();
});

refresh();
