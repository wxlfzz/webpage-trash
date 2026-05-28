const answers = {};
let userName = '';

const rpQuotes = [
  "(El formulario lleva aquí desde antes de que llegaras.\nComo si ya te esperaran.)",
  "(Hay una planta en la esquina que nadie riega.\nSigue viva de todas formas.)",
  "(La psicóloga todavía no sale.\nPuedes escuchar sus notas desde aquí.)",
  "(El reloj de la pared no avanza.\nO tú no lo estás mirando.)",
  "(La sesión dura lo que tenga que durar.)",
  "(Cuando el video termine, sabrás qué hacer.)"
];

/* ── NAME STEP ── */
const nameInput = document.getElementById('name-input');
const nameNext  = document.getElementById('next0');

function refreshNameButton() {
  if (nameInput.value.trim()) nameNext.classList.add('visible');
  else nameNext.classList.remove('visible');
}

if (nameInput) {
  nameInput.addEventListener('input', refreshNameButton);
  nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && nameInput.value.trim()) {
      e.preventDefault();
      submitName();
    }
  });
}

function submitName() {
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }
  userName = name;
  const slot = document.getElementById('welcome-name');
  if (slot) slot.textContent = name;
  advance(1);
}

/* ── OPTION QUESTIONS ── */
document.querySelectorAll('.opt').forEach(btn => {
  btn.addEventListener('click', function() {
    const q = this.dataset.q;
    document.querySelectorAll(`.opt[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    answers[q] = this.dataset.v;
    const nb = document.getElementById('next' + (parseInt(q) + 2)); // q0 -> screen 2, etc.
    if (nb) nb.classList.add('visible');
  });
});

/* ── SIDEBAR / RIGHT-PANEL QUOTE ── */
function updateSidebar(step) {
  document.querySelectorAll('.sidebar-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === step) el.classList.add('active');
    else if (s < step) el.classList.add('done');
  });
}

function setQuote(step) {
  const el = document.getElementById('rp-quote');
  if (!el) return;
  const next = rpQuotes[step] || rpQuotes[rpQuotes.length - 1];
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = next;
    el.style.opacity = '1';
  }, 300);
}

/* ── SCREEN NAVIGATION ── */
function advance(to) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const next = document.getElementById('s' + to);
  if (next) {
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateSidebar(to);
    setQuote(to);
  }
}

/* ── VIDEO → PRE-SAVE ── */
const teaser     = document.getElementById('teaser');
const presaveBtn = document.getElementById('btn-presave');
const presaveHint = document.getElementById('presave-hint');

function revealPresave() {
  if (presaveBtn)  presaveBtn.classList.add('visible');
  if (presaveHint) presaveHint.classList.add('visible');
}

if (teaser) {
  teaser.addEventListener('ended', revealPresave);
}

const rpEl = document.getElementById('rp-quote');
if (rpEl) rpEl.style.transition = 'opacity .3s ease';
