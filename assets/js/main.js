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

/* ── GRAIN: the old-TV static grows coarser/faster up to the last question (#s4);
   the session (#s5) cuts the grain entirely (handled by body.session in CSS) ── */
const GRAIN_PEAK_STEP = 4;    // #s4 — the last question, where the TV is worst
const GRAIN = {
  size:  [200, 640],          // px — fine → coarse/chunky (brightness stays flat)
  speed: [1.2, 0.30]          // boil interval in seconds (lower = faster)
};

function setGrain(step) {
  const t = Math.min(Math.max(step / GRAIN_PEAK_STEP, 0), 1);
  const lerp = ([a, b]) => a + (b - a) * t;
  const root = document.documentElement.style;
  root.setProperty('--noise-size', Math.round(lerp(GRAIN.size)) + 'px');
  root.setProperty('--noise-speed', lerp(GRAIN.speed).toFixed(2) + 's');
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
    setGrain(to);
  }
}

/* ── LAST QUESTION → SESSION: CRT power-off cut, then the glitchy teaser ── */
function enterSession() {
  const tv = document.getElementById('tv-off');

  // restart the overlay animation cleanly even if it ran before
  if (tv) {
    tv.classList.remove('run');
    void tv.offsetWidth; // force reflow so the animation re-fires
    tv.classList.add('run');
  }

  // swap to the session DURING the black hold (white line already gone, black still
  // fully covering ~6%–78% of the 1.3s animation), so the change is hidden behind black;
  // body.session kills the grain + arms the glitch
  setTimeout(() => {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const s5 = document.getElementById('s5');
    if (s5) s5.classList.add('active');
    document.body.classList.add('session');
    updateSidebar(5);
    setQuote(5);
    window.scrollTo({ top: 0 });
    // arranca el teaser solo (con sonido): seguimos dentro de la activación del
    // clic en "entrar a la sesión", así el navegador no bloquea el play.
    // controls sigue puesto como fallback si algún navegador igual lo bloquea.
    if (teaser) {
      teaser.currentTime = 0;
      teaser.play().catch(() => {});
    }
  }, 850);

  // tidy up the overlay once it has fully faded back out
  setTimeout(() => { if (tv) tv.classList.remove('run'); }, 1350);
}

/* ── VIDEO → PRE-SAVE ── */
const teaser      = document.getElementById('teaser');
const presaveBtn  = document.getElementById('btn-presave');
const presaveHint = document.getElementById('presave-hint');
const presaveLinks = document.getElementById('presave-links');

function revealPresave() {
  if (presaveBtn)   presaveBtn.classList.add('visible');
  if (presaveHint)  presaveHint.classList.add('visible');
  if (presaveLinks) presaveLinks.classList.add('visible');
}

if (teaser) {
  teaser.addEventListener('ended', revealPresave);
}

const rpEl = document.getElementById('rp-quote');
if (rpEl) rpEl.style.transition = 'opacity .3s ease';
