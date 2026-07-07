/* DOGE REBORN — Main Application */
const CONTRACT_ADDRESS = '0xe92F7Fe3EAf61DF28b7B75f3FaAB199333c42302';

const ALL_CHARACTERS = [
  { name: 'Doge', file: 'doge.jpg' }, { name: 'Shiba', file: 'shiba.jpg' },
  { name: 'Pepe', file: 'pepe.jpg' }, { name: 'Floki', file: 'floki.jpg' },
  { name: 'Bonk', file: 'bonk.jpg' }, { name: 'Cheems', file: 'cheems.jpg' },
  { name: 'Catgirl', file: 'catgirl.jpg' }, { name: 'Elon', file: 'elon.jpg' },
  { name: 'Siren', file: 'siren.jpg' }, { name: 'Wojak', file: 'wojak.jpg' },
  { name: 'BabyDoge', file: 'babydoge.jpg' }, { name: 'Kabosu', file: 'kabosu.jpg' },
  { name: 'Mother', file: 'mother.jpg' }, { name: 'Ponke', file: 'ponke.jpg' },
  { name: 'Wif', file: 'wif.jpg' }, { name: 'Turbo', file: 'turbo.jpg' },
  { name: 'Troll', file: 'troll.jpg' }, { name: 'Pnut', file: 'pnut.jpg' },
  { name: 'Hawk', file: 'hawk.jpg' }, { name: 'Quant', file: 'quant.jpg' },
  { name: 'Akita', file: 'akita.jpg' }, { name: 'Arc', file: 'arc.jpg' },
  { name: 'Ban', file: 'ban.jpg' }, { name: 'Bob', file: 'bob.jpg' },
  { name: 'Davido', file: 'davido.jpg' }, { name: 'Dobo', file: 'dobo.jpg' },
  { name: 'Fartcoin', file: 'fartcoin.jpg' }, { name: 'Hoge', file: 'hoge.jpg' },
  { name: 'JellyJelly', file: 'jellyjelly.jpg' }, { name: 'Jenner', file: 'jenner.jpg' },
  { name: 'Json', file: 'json.jpg' }, { name: 'Kishu', file: 'kishu.jpg' },
  { name: 'Ladys', file: 'ladys.jpg' }, { name: 'Leash', file: 'leash.jpg' },
  { name: 'LiveMom', file: 'livemom.jpg' }, { name: 'Pit', file: 'pit.jpg' },
  { name: 'Samo', file: 'samo.jpg' }, { name: 'Useless', file: 'useless.jpg' },
  { name: 'Would', file: 'would.jpg' },
];

/* ---- Character Bands (mame-style scrolling strips) ----
   Two "as you scroll" strips, both built from OUR OWN characters. The roster is
   split so the first band shows the first half and the second band the rest —
   "some in the first, some in the second".

   Each track is built as TWO identical halves. The marquee in animations.js
   translates the track by exactly one half and wraps, so the strip is always
   full — there is never an empty gap at either edge. Each half is padded out to
   comfortably exceed any screen width so the loop stays seamless. */
function buildCharBands() {
  const tracks = document.querySelectorAll('.char-band__track');
  const bandCount = tracks.length || 1;
  const perBand = Math.ceil(ALL_CHARACTERS.length / bandCount);

  tracks.forEach((track, idx) => {
    let group = ALL_CHARACTERS.slice(idx * perBand, idx * perBand + perBand);
    if (!group.length) group = ALL_CHARACTERS.slice();

    /* repeat the group until it's wide enough that the marquee never shows a gap */
    const half = [];
    while (half.length < 14) half.push(...group);

    const sequence = half.concat(half); // two identical halves = seamless loop
    sequence.forEach((char) => {
      const item = document.createElement('div');
      item.className = 'char-band__item';
      item.innerHTML = `<img src="characters/${char.file}" alt="${char.name}" loading="lazy" />`;
      track.appendChild(item);
    });
  });
}

/* ---- Copy Contract ---- */
function initCopyContract() {
  const btn = document.getElementById('copyCA');
  if (!btn) return;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    });
  });
}

/* ---- Navbar ---- */
function initNav(lenis) {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');

  if (burger && mobile) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-open');
      mobile.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target && lenis) lenis.scrollTo(target, { offset: -80 });
        else if (target) target.scrollIntoView({ behavior: 'smooth' });
        if (mobile) mobile.classList.remove('is-open');
        if (burger) burger.classList.remove('is-open');
      }
    });
  });
}

/* ---- Init Lenis ---- */
function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  return new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  buildCharBands();

  const lenis = initLenis();
  initNav(lenis);
  initParticles();
  initAnimations(lenis);
  initIdlePause();
  initTerminal();
  initTokenCounters();
  /* Magnetic cursor-follow disabled — buttons stay put, hover effects only. */
  /* initMagneticButtons(); */
  initRipples();
  initLogoEasterEgg();
  initCardTilt();
  initCopyContract();
});
