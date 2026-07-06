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

/* ---- Gallery ---- */
function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  ALL_CHARACTERS.forEach((char) => {
    const item = document.createElement('div');
    item.className = 'gallery__item';
    item.innerHTML = `
      <img src="characters/${char.file}" alt="${char.name}" loading="lazy" />
      <div class="gallery__item-info">
        <span class="gallery__item-name">${char.name}</span>
      </div>`;
    grid.appendChild(item);
  });
}

/* ---- Character Bands ----
   Each track is built as TWO identical halves. The marquee in animations.js
   translates the track by exactly one half and wraps, so the strip is always
   full — there is never an empty gap at either edge. Each half is 20 items
   wide, which comfortably exceeds any screen width. */
function buildCharBands() {
  const PER_BAND = 20;
  document.querySelectorAll('.char-band__track').forEach((track, idx) => {
    const slice = [];
    for (let i = 0; i < PER_BAND; i++) {
      /* offset each band so the two rows show different characters */
      slice.push(ALL_CHARACTERS[(idx * 7 + i) % ALL_CHARACTERS.length]);
    }
    const sequence = slice.concat(slice); // two identical halves = seamless loop
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
  buildGallery();
  buildCharBands();

  const lenis = initLenis();
  initNav(lenis);
  initParticles();
  initAnimations(lenis);
  initTerminal();
  initTokenCounters();
  initMagneticButtons();
  initRipples();
  initLogoEasterEgg();
  initCardTilt();
  initCopyContract();
});
